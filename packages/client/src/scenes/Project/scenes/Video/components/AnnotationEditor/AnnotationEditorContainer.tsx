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

import AnnotationEditorComponent from './AnnotationEditorComponent';

interface Props {
  user: UserRecord;
  error?: string;
  projectId: string;
  annotation?: AnnotationRecord;
  performance_mode: boolean;
  sequencing: boolean;
  emotionDetected: string;
  video: {
    position: number;
    duration: number;
  };
  ontology?: any;
  semiAutoAnnotation: boolean;
  semiAutoAnnotationMe: boolean;
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

function init({
  annotation,
  video,
  performance_mode,
  sequencing,
  semiAutoAnnotation,
  semiAutoAnnotationMe,
}: Props): State {
  if (annotation) {
    return {
      annotation,
    };
  } else {
    let startAt: number = video.position;
    if (performance_mode) {
      const SECONDS_BEFORE_START: number = 2;
      if (startAt > SECONDS_BEFORE_START) {
        startAt = startAt - SECONDS_BEFORE_START;
      }
    }
    return {
      annotation: {
        text: '',
        startTime: video.position,
        stopTime: maxAnnotationDuration(video.position, video.duration),
        semiAutoAnnotation,
        semiAutoAnnotationMe,
      
        pause: true,
      },
    } as State;
  }
}

const mapStateToProps = (state: AppState) => ({
  semiAutoAnnotation: state.project.player.semiAutoAnnotation,
  semiAutoAnnotationMe: state.project.player.semiAutoAnnotationMe,
  error: state.project.video.annotationError,
  annotation: state.project.video.focusedAnnotation,
  performance_mode: state.project.player.performance_mode,
  sequencing: state.project.player.sequencing,
  
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onCreate: (projectId: string, data: AnnotationData) =>
    createAnnotationThunk(projectId, data)(dispatch),
  onUpdate: (projectId: string, record: AnnotationRecord) =>
    updateAnnotationThunk(projectId, record)(dispatch),
  onCancel: (annotation?: AnnotationRecord) =>
    dispatch(triggerCancelAnnotation(annotation)),
});
// export let userName = '';
// export let userId = '';
// let annotationId: string[];
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class extends React.Component<Props, State> {
    state = init(this.props);

    render() {
      const {
        projectId,
        video,
        onCreate,
        onUpdate,
        onCancel,
        onSeek,
        emotionDetected,
      } = this.props;

      const { annotation } = this.state;

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
        if (!this.props.performance_mode) {
          console.log('on time changing..', this.props.performance_mode);
          const state = this.state as State;
          if (isStart) {
            state.annotation.startTime = position;
          } else {
            state.annotation.stopTime = position;
          }
          this.setState(state);
          onSeek(position, true, true);
        }
      };

      const onClickSave = async () => {
        annotation.user = this.props.user;

        if (this.props.annotation) {
          onUpdate(projectId, {
            ...this.props.annotation,
            ...annotation,
          });
        } else {
          let res = await onCreate(projectId, annotation);
          //@ts-ignore
          return res.payload.id;
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

      const onEmotionChange = (emotion: string) => {
        this.setState((state) => ({
          ...state,
          annotation: {
            ...state.annotation,
            emotion,
          },
        }));
      };

      const onOntologyChange = (ontology: any) => {
        this.setState((state) => ({
          ...state,
          annotation: {
            ...state.annotation,
            ontology,
          },
        }));
      };

      return (
        <AnnotationEditorComponent
          {...annotation}
          user={this.props.user}
          performance_mode={this.props.performance_mode}
          sequencing={this.props.sequencing}
          onCheckPauseChange={onCheckPauseChange}
          onTimingChange={onTimingChange}
          onClickSave={onClickSave}
          onClickCancel={onClickCancel}
          onTextChange={onTextChange}
          onEmotionChange={onEmotionChange}
          duration={video.duration}
          position={video.position}
          projectId={projectId}
          emotionDetected={emotionDetected}
        
        />
      );
    }
  }
);
