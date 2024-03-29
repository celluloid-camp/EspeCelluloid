import { TeacherRecord, UserRecord } from "@celluloid/types";
import * as bcrypt from "bcrypt";
import passport from "passport";
import {
  Strategy,
  VerifyFunction,
  VerifyFunctionWithRequest,
} from "passport-local";

import { logger } from "../backends/Logger";
import * as ProjectStore from "../store/ProjectStore";
import * as UserStore from "../store/UserStore";
import { TeacherServerRecord, UserServerRecord } from "../types/UserTypes";
import { sendConfirmationCode } from "./Utils";

const log = logger("auth/Auth");


declare global {
  namespace Express {
    interface User {
      id: string;
    }
  }
}

export enum SigninStrategy {
  LOGIN = "login",
  TEACHER_SIGNUP = "teacher-signup",
  STUDENT_SIGNUP = "student-signup",
}

passport.serializeUser((user, done) => {
  return Promise.resolve(done(null, user.id));
});
passport.deserializeUser((id: string, done: any) => {
  return UserStore.selectOne(id)
    .then((result: TeacherRecord) => {
      if (result) {
        return Promise.resolve(done(null, result));
      } else {
        log.error(
          `Deserialize user failed: user with id` + ` ${id} does not exist`
        );
        return Promise.resolve(done(new Error("InvalidUser")));
      }
    })
    .catch((error: Error) => Promise.resolve(done(error)));
});

const signStudentUp: VerifyFunctionWithRequest = (
  req,
  username,
  password,
  done
) => {
  const { shareCode } = req.body;
  console.log(' shareCode ', shareCode)
  const parts = shareCode.split("-");
   console.log(' lol: ', parts)
  // const sharePassword = parts.slice(-2).join("-");
  const sharePassword = parts.slice(1).join("-");
  // const shareName = parts.slice(0, -1).slice(0, -1).join("-");
  const shareName = parts.slice(0, -1).join("-");
  return ProjectStore.selectOneByShareName(shareName)
    .then((result) => {
      if (result) {
        if (sharePassword === result.sharePassword) {
          return UserStore.createStudent(username, password, result.id);
        }
        return Promise.reject(new Error("IncorrectProjectPassword"));
      }
      return Promise.reject(new Error("ProjectNotFound"));
    })
    .then((user: any) => Promise.resolve(done(null, user)))
    .catch((error: Error) => {
      log.error("Failed to signup student:", error);
      return Promise.resolve(done(error));
    });
};

const signTeacherUp: VerifyFunctionWithRequest = (
  req,
  email,
  password,
  done
) => {
  return UserStore.createTeacher(req.body.username, email, password)
    .then((user: TeacherServerRecord) => sendConfirmationCode(user))
    .then((user: TeacherRecord) => Promise.resolve(done(null, user)))
    .catch((error: Error) => Promise.resolve(done(error)));
};

const logUserIn: VerifyFunction = (login, password, done) => {
  console.log('log the login: ', login)
  return UserStore.selectOneByUsernameOrEmail(login)
    .then((user: UserServerRecord) => {
      if (!user) {
        return Promise.resolve(done(new Error("InvalidUser")));
      }
      if (user.role !== "Student" && !bcrypt.compareSync(password, user.password)) {
        log.error(`Login failed for user ${user.username}: incorrect password`);
        return Promise.resolve(done(new Error("InvalidUser")));
      }
      if (!user.confirmed && user.role !== "Student") {
        log.error(`Login failed: ${user.username} is not confirmed`);
        return Promise.resolve(done(new Error("UserNotConfirmed")));
      }
      return Promise.resolve(done(null, user));
    })
    .catch((error: Error) => Promise.resolve(done(error)));
};

export const loginStrategy = new Strategy(
  { usernameField: "login" },
  logUserIn
);

export const teacherSignupStrategy = new Strategy(
  { passReqToCallback: true, usernameField: "email" },
  signTeacherUp
);

export const studentSignupStrategy = new Strategy(
  { passReqToCallback: true, usernameField: "username" },
  signStudentUp
);
