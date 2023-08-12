import { maxAnnotationDuration } from 'utils/AnnotationUtils';
import { AnnotationData, AnnotationRecord, UserRecord } from '@celluloid/types';
import {
  createAnnotationThunk,
  triggerCancelAnnotation,
  updateAnnotationThunk,
} from 'actions/AnnotationsActions';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Action, AsyncAction } from 'types/ActionTypes';
import { AppState } from 'types/StateTypes';

import AnnotationEditorComponent, {
  globalEmoji,
} from './AnnotationEditorComponent';

interface Props {
  user: UserRecord;
  error?: string;
  projectId: string;
  annotation?: AnnotationRecord;
  video: {
    position: number;
    duration: number;
  };
  ontology?: any;
  onSeek(position: number, pause: boolean, seekAhead: boolean): void;
  onCreate(
    projectId: string,
    data: AnnotationData
  ): AsyncAction<AnnotationRecord, string>;
  onUpdate(
    projectId: string,
    record: AnnotationRecord
  ): AsyncAction<AnnotationRecord, string>;
  onCancel(annotation?: AnnotationRecord): Action<AnnotationRecord | undefined>;
}

interface State {
  annotation: AnnotationRecord;
}

function init({ annotation, video }: Props): State {
  if (annotation) {
    return {
      annotation,
    };
  } else {
    return {
      annotation: {
        text: '',
        startTime: video.position,
        stopTime: maxAnnotationDuration(video.position, video.duration),
        pause: false,
      },
    } as State;
  }
}

const mapStateToProps = (state: AppState) => ({
  error: state.project.video.annotationError,
  annotation: state.project.video.focusedAnnotation,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onCreate: (projectId: string, data: AnnotationData) =>
    createAnnotationThunk(projectId, data)(dispatch),
  onUpdate: (projectId: string, record: AnnotationRecord) =>
    updateAnnotationThunk(projectId, record)(dispatch),
  onCancel: (annotation?: AnnotationRecord) =>
    dispatch(triggerCancelAnnotation(annotation)),
});
export let userName = '';
export let userId = '';
let annotationId: string[];
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class extends React.Component<Props, State> {
    state = init(this.props);

    render() {
      const { projectId, video, onCreate, onUpdate, onCancel, onSeek } =
        this.props;

      const { annotation } = this.state;
      // const onOntologyChange = (
      //   ontology: any
      // ) => {
      //   this.setState(state => ({
      //     ...state,
      //     annotation: {
      //       ...state.annotation,
      //       ontology
      //     }
      //   }));
      // };

      const onCheckPauseChange = (pause: boolean) => {
        this.setState((state) => ({
          ...state,
          annotation: {
            ...state.annotation,
            pause,
          },
        }));
      };

      const onTimingChange = (
        position: number,
        isStart: boolean,
        seekAhead: boolean
      ) => {
        const state = this.state as State;
        if (isStart) {
          state.annotation.startTime = position;
        } else {
          state.annotation.stopTime = position;
        }
        this.setState(state);
        onSeek(position, true, true);
      };

      const onClickSave = async () => {
        annotation.user = this.props.user;
        annotation.text = annotation.text;
        annotation.emotion = globalEmoji;

        if (this.props.annotation) {
          onUpdate(projectId, {
            ...this.props.annotation,
            ...annotation,
          });
        } else {
          let res = await onCreate(projectId, annotation);
          //@ts-ignore
          annotationId = res.payload.id;
          userName = annotation.user.username;
          userId = annotation.user.id;
          return annotationId;
        }
      };

      const onClickCancel = () => {
        onCancel(this.props.annotation);
      };

      const onTextChange = (text: string) => {
        this.setState((state) => ({
          ...state,
          annotation: {
            ...state.annotation,
            text,
          },
        }));
      };

      return (
        <AnnotationEditorComponent
          {...annotation}
          onCheckPauseChange={onCheckPauseChange}
          onTimingChange={onTimingChange}
          onClickSave={onClickSave}
          onClickCancel={onClickCancel}
          onTextChange={onTextChange}
          duration={video.duration}
          projectId={projectId}
        />
      );
    }
  }
);
