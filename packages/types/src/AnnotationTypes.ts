import { CommentRecord } from './CommentTypes';
import { UserRecord } from './UserTypes';

export interface AnnotationData {
  text: string;
  startTime: number;
  stopTime: number;
  pause: boolean;
  autoDetect: boolean;
  semiAutoDetect: boolean;
  emotion?: string;
  ontology: string[];
}

export interface AnnotationRecord extends AnnotationData {
  projectId: string;
  userId: string;
  id: string;
  user: UserRecord;
  comments: CommentRecord[];
}
