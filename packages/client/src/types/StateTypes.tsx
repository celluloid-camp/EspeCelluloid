import {
  AnnotationRecord,
  CommentRecord,
  Credentials,
  ProjectGraphRecord,
  SigninErrors,
  TagData,
  UserRecord,
} from '@celluloid/types';
import * as SigninDialog from 'components/Signin';
import { RouterState } from 'connected-react-router';
import { PeertubeVideoInfo } from './YoutubeTypes';

export type AnnotationShowingMode = 'All' | 'Nothing' | 'Own';
export interface SigninState {
  loading: boolean;
  dialog: SigninDialog.SigninState;
  errors: SigninErrors;
  credentials?: Credentials;
}

export interface VideoState {
  status: ComponentStatus;
  loadingError?: boolean;
  annotations: AnnotationRecord[];
  editing: boolean;
  commenting: boolean;
  annotationError?: string;
  focusedAnnotation?: AnnotationRecord;
  upsertAnnotationLoading: boolean;
  deleteAnnotationLoading: boolean;
  commentError?: string;
  focusedComment?: CommentRecord;
  upsertCommentLoading: boolean;
  deleteCommentLoading: boolean;
}

export interface ProjectDetailsState {
  status: ComponentStatus;
  error?: string;
  project?: ProjectGraphRecord;
  setPublicLoading: boolean;
  setCollaborativeLoading: boolean;
  unshareLoading: boolean;
  deleteLoading: boolean;
  setPublicError?: string;
  setCollaborativeError?: string;
  unshareError?: string;
  deleteError?: string;
  updateDataFeedback?: string;
  ownAnnotations: boolean;
  annotationShowingMode: AnnotationShowingMode;
}

export interface PlayerState {
  seeking: boolean;
  seekTarget: number;
  performance_mode: boolean;
  autoDetect: boolean;
  semiAutoAnnotation: boolean;
  semiAutoAnnotationMe: boolean;
  sequencing: boolean;
}

export interface ProjectState {
  player: PlayerState;
  video: VideoState;
  details: ProjectDetailsState;
}

export enum SharingStatus {
  OPEN,
  ERROR,
  LOADING,
  CLOSED,
}

export enum ComponentStatus {
  LOADING,
  ERROR,
  READY,
}

export interface HomeState {
  errors: {
    projects?: string;
    video?: string;
    createProject?: string;
  };
  projects: ProjectGraphRecord[];
  video?: PeertubeVideoInfo;
  createProjectLoading: boolean;
}

export interface SharingState {
  status: SharingStatus;
  error?: string;
}

export interface AppState extends RouterState {
  tags: TagData[];
  sharing: SharingState;
  project: ProjectState;
  home: HomeState;
  user?: UserRecord;
  signin: SigninState;
  updated: boolean;
}
