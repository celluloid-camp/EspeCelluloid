import {
  ProjectCreateData,
  ProjectRecord,
  ProjectShareData,
  UserRecord,
  VideoUpdateData,
  VideoData
} from "@celluloid/types";
import { Knex } from "knex";

import { generateUniqueShareName } from "../auth/Utils";
import {
  database,
  filterNull,
  getExactlyOne,
  hasConflictedOn,
} from "../backends/Database";
import { logger } from "../backends/Logger";
import { Project, Tag, User } from "../knex";
import { tagProject } from "./TagStore";

const log = logger("store/ProjectStore");

export const orIsMember = (nested: Knex.QueryBuilder, user?: UserRecord) =>
  user
    ? nested.orWhereIn(
        "Project.id",
        database
          .select("projectId")
          .from("UserToProject")
          .where("userId", user.id)
      )
    : nested;

export const orIsOwner = (nested: Knex.QueryBuilder, user?: UserRecord) =>
  user ? nested.orWhere("Project.userId", user.id) : nested;

function filterUserProps({ id, username, role }: UserRecord) {
  return {
    id,
    username,
    role,
  };
}

export function isOwnerOrCollaborativeMember(
  projectId: string,
  user: UserRecord
) {
  return Promise.all([
    isOwner(projectId, user),
    isCollaborativeMember(projectId, user),
  ]).then(([owner, member]: boolean[]) => owner || member);
}

export function updataMetaData(projectId: string, props: VideoUpdateData) {
  return database('Video')
    .update(props)
    .returning('*')
    .where('id', projectId)
    .then(getExactlyOne);
}
export function isOwner(projectId: string, user: UserRecord) {
  return database
    .first("id")
    .from("Project")
    .where("id", projectId)
    .andWhere("userId", user.id)
    .then((row: string) => (row ? true : false));
}

export function isMember(projectId: string, user: Partial<UserRecord>) {
  return (
    database
      .first("projectId")
      .from("UserToProject")
      .where("UserToProject.projectId", projectId)
      // @ts-ignore
      .andWhere("UserToProject.userId", user.id)
      .then((row: string) => (row ? true : false))
  );
}

export function isCollaborativeMember(projectId: string, user: UserRecord) {
  return database
    .first("projectId")
    .from("UserToProject")
    .innerJoin("Project", "Project.id", "UserToProject.projectId")
    .where("UserToProject.projectId", projectId)
    .andWhere("UserToProject.userId", user.id)
    .andWhere("Project.collaborative", true)
    .then((row: string) => (row ? true : false));
}

// < Project[] &{
//   tags: Tag[],
//   user: User
// }>
export function selectAll(user: UserRecord):Promise<ProjectRecord[]> {
  return database("projects")
    .select(
      database.raw('"Project".*'),
      database.raw(`to_json(array_agg("Tag")) AS "tags"`),
      database.raw(`row_to_json("User") as "user"`)
    )
    .from("Project")
    .innerJoin("User", "User.id", "Project.userId")
    .leftJoin("TagToProject", "Project.id", "TagToProject.projectId")
    .leftJoin("Tag", "Tag.id", "TagToProject.tagId")
    .where("Project.public", true)
    .modify(orIsOwner, user)
    .modify(orIsMember, user)
    .groupBy("Project.id", "User.id")
    .then((rows) =>
      rows.map((r: any) =>
        filterNull("tags")({
          ...r,
          user: filterUserProps(r.user),
        })
      )
    );
}

export function selectOneByShareName(shareName: string) {
  console.log('dans projectstore: ', shareName)
  return database.first("*").from("Project").where("shareName", shareName);
}

export function selectOne(projectId: string, user: Partial<UserRecord>) {
  return database
    .first(
      database.raw('"Project".*'),
      database.raw(`to_json(array_agg("Tag")) as "tags"`),
      database.raw(`row_to_json("User") as "user"`)
    )
    .from("Project")
    .innerJoin("User", "User.id", "Project.userId")
    .leftJoin("TagToProject", "Project.id", "TagToProject.projectId")
    .leftJoin("Tag", "Tag.id", "TagToProject.tagId")
    .where((nested: Knex.QueryBuilder) => {
      nested.where("Project.public", true);
      nested.modify(orIsMember, user);
      nested.modify(orIsOwner, user);
    })
    .andWhere("Project.id", projectId)
    .groupBy("Project.id", "User.id")
    .then((row?) => {
      return new Promise((resolve, reject) => {
        if (row) {
          return selectProjectMembers(projectId).then((members) =>
            resolve(
              filterNull("tags")({
                user: filterUserProps(row.user),
                members,
                ...row,
              })
            )
          );
        } else {
          return reject(new Error("ProjectNotFound"));
        }
      });
    });
}
function insertVideo(project:any) {
  const query = () =>
    database("Video")
      .insert({
        id: project.id,
        title: project.title,
       
      })
      .returning("*")
      .then(getExactlyOne);
  return query();
}

export function insert(project: ProjectCreateData, user: UserRecord) {
  const INSERT_RETRY_COUNT = 20;
  const pjt={
    videoId: project.videoId,
    title: project.title,
    description: project.description,
    objective: project.objective,
    assignments: project.assignments,
    levelStart: project.levelStart,
    levelEnd: project.levelEnd,
    public: project.public,
    collaborative: project.collaborative,
    host: project.host,
    tags: project.tags
  }
  const { tags, ...props } = pjt;
  const query: any = (retry: number) =>
    database("Project")
      .insert<Project>({
        ...props,
        userId: user.id,
        publishedAt: database.raw("NOW()"),
        shareName: generateUniqueShareName(props.title, retry),
      })
      .returning("*")
      .then( getExactlyOne)
      .catch((error) => {
        if (hasConflictedOn(error, "User", "username")) {
          if (retry < INSERT_RETRY_COUNT) {
            return query(retry + 1);
          } else {
            log.warn(
              "Failed to insert project: unique share name generation failed"
            );
          }
        }
        throw error;
      });

      // export function insert(project: ProjectCreateData, user: UserRecord) {
      //   const INSERT_RETRY_COUNT = 20;
      //   const { video, tags, ...props } = project;
      //   const query = (retry: number) => 
      //     database('Project') 
      //       .insert({
      //         ...props,
      //         id: database.raw('uuid_generate_v4()'),
      //         userId: user.id,
      //         videoId: getOneVideoId(video),
      //         publishedAt: database.raw('NOW()'),
      //         shareName: generateUniqueShareName(props.title, retry)
      //       })
      //       .returning('*')
      //       .then(getExactlyOne)
      //       .catch(error => {
      //         if (hasConflictedOn(error, 'User', 'username')) {
      //           if (retry < INSERT_RETRY_COUNT) {
      //             return query(retry + 1);
      //           } else {
      //             console.warn('Failed to insert project: unique share name generation failed');
      //           }
      //         }
      //         throw error;
      //       });
      //   return query(0)
      //     .then(record =>
      //       Promise.all(project.tags.map(tag =>
      //         tagProject(tag.id, record.id)
      //       ))
      //         .then(() =>
      //           Promise.resolve({ tags, ...record })
      //         )
      //     );
      // }
  return query(0).then((record: any) =>
    Promise.all(project.tags.map((tag) => tagProject(tag.id, record.id))).then(
      () => Promise.resolve({ tags, ...record })
    )
  );
}

export function update(projectId: string, props: ProjectRecord) {
  return database("Project")
    .update(props)
    .returning("*")
    .where("id", projectId)
    .then(getExactlyOne);
}

export function del(projectId: string) {
  return database("Project").where("id", projectId).del();
}

export function shareById(projectId: string, data: ProjectShareData) {
  return database("Project")
    .update({
      shared: true,
      sharePassword: data.sharePassword,
    })
    .returning("*")
    .where("id", projectId)
    .then(getExactlyOne);
}

export function unshareById(projectId: string) {
  return database("Project")
    .update({
      shared: false,
      sharePassword: null,
    })
    .returning("*")
    .where("id", projectId)
    .then(getExactlyOne);
}

export function selectProjectMembers(projectId: string) {
  return database
    .select("User.id", "User.username", "User.role")
    .from("UserToProject")
    .innerJoin("User", "User.id", "UserToProject.userId")
    .where("UserToProject.projectId", projectId)
    .then((rows) => rows.map(filterUserProps));
}

export function setPublicById(projectId: string, _public: boolean) {
  return database("Project")
    .update({
      public: _public,
    })
    .where("id", projectId)
    .returning("*")
    .then(getExactlyOne);
}

export function setCollaborativeById(
  projectId: string,
  collaborative: boolean
) {
  return database("Project")
    .update({
      collaborative,
    })
    .where("id", projectId)
    .returning("*")
    .then(getExactlyOne);
}

