import { AnnotationData, AnnotationRecord, UserRecord } from '@celluloid/types';
import * as express from 'express';

import { isProjectOwnerOrCollaborativeMember } from '../auth/Utils';
import { logger } from '../backends/Logger';
import * as AnnotationStore from '../store/AnnotationStore';
import * as CommentStore from '../store/CommentStore';
import * as ProjectStore from '../store/ProjectStore';
import CommentApi from './CommentApi';

const log = logger('api/AnnotationApi');

const router = express.Router({ mergeParams: true });

router.use('/:annotationId/comments', CommentApi);

function fetchComments(annotation: AnnotationRecord, user: UserRecord) {
  return CommentStore.selectByAnnotation(annotation.id, user).then((comments) =>
    Promise.resolve({ ...annotation, comments } as AnnotationRecord)
  );
}

router.get('/top-emotions', async (req, res) => {
  //http://localhost:3000/api/projects/:id/annotations/top-emotions?onlyMe=true&startTime=0&offset=10&limit=5
  // @ts-ignore
  const projectId = req.params.projectId;
  const onlyMeParamString = req.query.onlyMe as string;
  const onlyMe = onlyMeParamString === 'true';
  const user = req.user as UserRecord;
  const startTime = Number(req.query.startTime) || 0;
  const stopTime = startTime + Number(req.query.offset) || 0;
  const limit = Number(req.query.limit) || 5;
  try {
    await ProjectStore.selectOne(projectId, user);
    const results = await AnnotationStore.getEmotionCounts(projectId, user.id, {
      onlyMe,
      startTime,
      stopTime,
      limit,
    });

    res.status(200).json(results);
    // @ts-ignore
  } catch (error: Error) {
    log.error('Failed to list annotations:', error);
    if (error.message === 'ProjectNotFound') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).send();
    }
  }
});

router.get('/', (req, res) => {
  // @ts-ignore
  const projectId = req.params.projectId;
  const user = req.user as UserRecord;
  const autoDetect = req.query.autoDetect === 'false' ? false : true;

  return ProjectStore.selectOne(projectId, user)
    .then(() => AnnotationStore.selectByProject(projectId, user, autoDetect))
    .then((annotations: AnnotationRecord[]) =>
      Promise.all(
        annotations.map((annotation) => fetchComments(annotation, user))
      )
    )
    .then((annotations) => {
      return res.status(200).json(annotations);
    })
    .catch((error: Error) => {
      log.error('Failed to list annotations:', error);
      if (error.message === 'ProjectNotFound') {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).send();
      }
    });
});

router.post('/', isProjectOwnerOrCollaborativeMember, (req, res) => {
  const projectId = req.params.projectId;
  const annotation = req.body as AnnotationData;
  const user = req.user as UserRecord;
  console.log('we are postinf annotation, ', annotation);
  AnnotationStore.insert(annotation, user, projectId)
    .then((result) => fetchComments(result, user))
    .then((result) => {
      return res.status(201).json(result);
    })
    .catch((error: Error) => {
      log.error(error, 'Failed to create annotation');
      return res.status(500).send();
    });
});

router.put(
  '/:annotationId',
  isProjectOwnerOrCollaborativeMember,
  (req, res) => {
    const annotationId = req.params.annotationId;
    const updated = req.body;
    const user = req.user as UserRecord;

    console.log('we are updating annotation', updated);

    AnnotationStore.selectOne(annotationId, user)
      .then((old: AnnotationRecord) =>
        old.userId !== user.id
          ? Promise.reject(new Error('UserNotAnnotationOwner'))
          : Promise.resolve()
      )
      .then(() => AnnotationStore.update(annotationId, updated, user))
      .then((result) => fetchComments(result, user))
      .then((result) => res.status(200).json(result))
      .catch((error: Error) => {
        log.error('Failed to update annotation:', error);
        if (error.message === 'AnnotationNotFound') {
          return res.status(404).json({ error: error.message });
        } else if (error.message === 'UserNotAnnotationOwner') {
          return res.status(403).json({ error: error.message });
        } else {
          return res.status(500).send();
        }
      });
  }
);

router.delete(
  '/:annotationId',
  isProjectOwnerOrCollaborativeMember,
  (req, res) => {
    const annotationId = req.params.annotationId;
    const user = req.user as UserRecord;

    AnnotationStore.selectOne(annotationId, user)
      .then((old: AnnotationRecord) =>
        old.userId !== user.id
          ? Promise.reject(new Error('UserNotAnnotationOwner'))
          : Promise.resolve()
      )
      .then(() => AnnotationStore.del(annotationId))
      .then(() => res.status(204).send())
      .catch((error: Error) => {
        log.error('Failed to delete annotation:', error);
        if (error.message === 'AnnotationNotFound') {
          return res.status(404).json({ error: error.message });
        } else if (error.message === 'UserNotAnnotationOwner') {
          return res.status(403).json({ error: error.message });
        } else {
          return res.status(500).send();
        }
      });
  }
);

export default router;
