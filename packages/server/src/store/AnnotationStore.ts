import { AnnotationData, AnnotationRecord, UserRecord } from '@celluloid/types';
import { Knex } from 'knex';

import { database, getExactlyOne } from '../backends/Database';
import * as ProjectStore from './ProjectStore';

interface QueryString {
  onlyMe: boolean;
  startTime: number;
  stopTime: number;
  limit: number;
}

export function getRecommendedEmojis(
  projectId: string,
  userId: string,
  queryString: QueryString
) {
  const { startTime, stopTime, onlyMe } = queryString;

  const subquery = database('Annotation')
    .max('stopTime as max_stop_time')
    .first();

  const query = database('Annotation as a')
    .select('*')
    .where('projectId', projectId)
    .whereNotNull('emotion')
    .andWhere('stopTime', '>=', startTime)
    .andWhere('startTime', '<=', stopTime === startTime ? subquery : stopTime);

  if (onlyMe) query.andWhere('userId', userId);

  return query;
}

export function getRecentEmojis(
  projectId: string,
  userId: string,
  queryString: QueryString
) {
  const { startTime, stopTime, limit } = queryString;

  const subquery = database('Annotation')
    .max('stopTime as max_stop_time')
    .first();

  return database('Annotation as a')
    .select('emotion')
    .where('userId', userId)
    .andWhere('projectId', projectId)
    .whereNotNull('emotion')
    .andWhere('stopTime', '>=', startTime)
    .andWhere('startTime', '<=', stopTime === startTime ? subquery : stopTime)
    .orderBy('createdAt', 'desc')
    .limit(limit);
}

export function selectByProject(
  projectId: string,
  user: UserRecord,
  autoDetect = true
) {
  return database
    .select(
      database.raw('"Annotation".*'),
      database.raw(
        'json_build_object(' +
          `'id', "User"."id",` +
          `'email', "User"."email",` +
          `'username', "User"."username",` +
          `'role', "User"."role"` +
          ') as "user"'
      )
    )
    .from('Annotation')
    .innerJoin('Project', 'Project.id', 'Annotation.projectId')
    .innerJoin('User', 'User.id', 'Annotation.userId')
    .where('Annotation.projectId', projectId)
    .whereIn(
      'Annotation.autoDetect',
      autoDetect === false ? [false] : [true, false]
    )
    .andWhere((nested: Knex.QueryBuilder) => {
      nested.modify(ProjectStore.orIsOwner, user);
      nested.modify(ProjectStore.orIsMember, user);
      return nested;
    })
    .orderBy('Annotation.startTime', 'asc');
}

export function selectOne(
  annotation: string | { id: string },
  user?: Partial<UserRecord>
) {
  let annotationId = annotation;

  if (typeof annotation === 'object') {
    annotationId = annotation.id;
  }

  return database
    .select(
      database.raw('"Annotation".*'),
      database.raw(
        'json_build_object(' +
          `'id', "User"."id",` +
          `'email', "User"."email",` +
          `'username', "User"."username",` +
          `'role', "User"."role"` +
          ') as "user"'
      )
    )
    .from('Annotation')
    .innerJoin('Project', 'Project.id', 'Annotation.projectId')
    .innerJoin('User', 'User.id', 'Annotation.userId')
    .where('Annotation.id', annotationId)
    .andWhere((nested: Knex.QueryBuilder) => {
      nested.modify(ProjectStore.orIsOwner, user);
      nested.modify(ProjectStore.orIsMember, user);
      return nested;
    })
    .first()
    .then((row?: AnnotationRecord) =>
      row
        ? Promise.resolve(row)
        : Promise.reject(new Error('AnnotationNotFound'))
    );
}

export function insert(
  annotation: AnnotationData,
  user: UserRecord,
  projectId: string
) {
  return database('Annotation')
  
    .insert({
      text: annotation.text || '',
      startTime: annotation.startTime,
      stopTime: annotation.stopTime,
      pause: annotation.pause,
      autoDetect: annotation.autoDetect || false,
      semiAutoAnnotation: annotation.semiAutoAnnotation || false,
      semiAutoAnnotationMe: annotation.semiAutoAnnotationMe || false,
      emotion: annotation.emotion || null,
      userId: user.id,
      projectId: projectId,
      timeStamp: database.raw("NOW()"),
    })
    .returning('id')
    .then(getExactlyOne)
    .then((id) => selectOne(id, user));
}

export function update(id: string, data: AnnotationData, user: UserRecord) {
  return database('Annotation')
    .update({
      text: data.text,
      startTime: data.startTime,
      stopTime: data.stopTime,
      pause: data.pause,
      emotion: data.emotion || null,
    })
    .returning('id')
    .where('id', id)
    .then(getExactlyOne)
    .then(() => selectOne(id, user));
}

export function del(id: string) {
  return database('Annotation').where('id', id).del();
}
