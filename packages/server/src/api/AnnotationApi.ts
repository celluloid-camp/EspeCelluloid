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

router.get('/recommended-emotions', async (req, res) => {
  //http://localhost:3000/api/projects/:id/annotations/top-emotions?onlyMe=true&startTime=0&offset=10&limit=5
  // @ts-ignore
  const projectId = req.params.projectId;
  const onlyMe = (req.query.onlyMe as string) === 'true';
  const user = req.user as UserRecord;
  const startTime = Number(req.query.startTime) || 0;
  const stopTime = startTime + Number(req.query.offset) || 0;
  const limit = Number(req.query.limit) || 4;
  try {
    await ProjectStore.selectOne(projectId, user);
    let results = await AnnotationStore.getRecommendedEmojis(
      projectId,
      user.id,
      {
        onlyMe,
        startTime,
        stopTime,
        limit,
      }
    );

    // Suggestion algorithm
    const weightAutoDetect = {
      neutral: 0.5,
      happy: 0.5,
      surprised: 0.5,
      sad: 0.2,
      fearful: 0.2,
      disgusted: 0.2,
      angry: 0.2,
    };

    const emotionCounts = {};
    const emotionDurations = {};
    const annotations = results;

    annotations.forEach((annotation) => {
      const emotion = annotation.emotion;
      const duration =
        Math.min(annotation.stopTime, stopTime) -
        Math.max(annotation.startTime, startTime);

      // Initialize counts and durations if not present
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      emotionDurations[emotion] = (emotionDurations[emotion] || 0) + duration;
    });

    const suggestions: {
      emotion: string;
      score: number;
    }[] = [];

    // Calculate a weighted score for each emotion
    Object.keys(emotionCounts).forEach((emotion) => {
      const count = emotionCounts[emotion];
      const duration = emotionDurations[emotion];

      // Check if there's at least one manually entered annotation for this emotion
      const hasManualAnnotation = annotations.some(
        (annotation) => annotation.emotion === emotion && !annotation.autoDetect
      );

      // Adjust weight based on manual entry
      const weight = hasManualAnnotation
        ? 1 - (weightAutoDetect[emotion] || 0)
        : weightAutoDetect[emotion];

      const score = count * weight + duration;

      suggestions.push({ emotion, score });
    });

    // Sort suggestions by score in descending order
    suggestions.sort((a, b) => b.score - a.score);

    results = suggestions.slice(0, limit);
    // .map((suggestion) => suggestion.emotion);

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
