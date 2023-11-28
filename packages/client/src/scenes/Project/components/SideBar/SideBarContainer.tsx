import {
  ProjectGraphRecord,
  UserRecord,
  AnnotationRecord,
} from '@celluloid/types';
import {
  deleteProjectThunk,
  openShareProject,
  setProjectCollaborativeThunk,
  setProjectPublicThunk,
  unshareProjectThunk,
  setAnnotationShowingMode,
  switchOwnAnnotations,
} from 'actions/ProjectActions';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AsyncAction, EmptyAction } from 'types/ActionTypes';
import { AppState } from 'types/StateTypes';
import { triggerCancelAnnotation } from 'actions/AnnotationsActions';
import SideBarComponent from './SideBarComponent';
import {
  playerSwitchMode,
  playerSwitchSequencing,
  playerSwitchAutoDetection,
  playerSwitchSemiAutoDetection,
  playerSwitchSemiAutoDetectionMe,
} from '../../../../actions/PlayerActions';

interface Props {
  user?: UserRecord;
  project: ProjectGraphRecord;
  setPublicLoading: boolean;
  setCollaborativeLoading: boolean;
  unshareLoading: boolean;
  deleteLoading: boolean;
  setPublicError?: string;
  setCollaborativeError?: string;
  unshareError?: string;
  deleteError?: string;
  performance_mode: boolean;
  autoDetect: boolean;
  semiAutoAnnotation: boolean;
  semiAutoAnnotationMe: boolean;
  sequencing: boolean;
  annotations: AnnotationRecord[];
  ownAnnotations: boolean;
  onClickSetPublic(
    projectId: string,
    value: boolean
  ): AsyncAction<ProjectGraphRecord, string>;
  onClickSetCollaborative(
    projectId: string,
    value: boolean
  ): AsyncAction<ProjectGraphRecord, string>;
  openShareDialog(): EmptyAction;
  unshareProject(projectId: string): AsyncAction<ProjectGraphRecord, string>;
  onClickDelete(projectId: string): AsyncAction<null, string>;
  onClickSwitchPlayerMode(): void;
  onClickSwitchSequencing(): void;
  // Auto Detection
  onClickSwitchAutoDetection(): void;
  onClickSwitchSemiAutoDetection(): void;
  onClickSwitchSemiAutoDetectionMe(): void;

  onClickSwitchOwnAnnotations(): void;
  onChangeAnnotationShowingMode(
    event: React.ChangeEvent<HTMLSelectElement>
  ): void;
}

const mapStateToProps = (state: AppState) => ({
  setPublicLoading: state.project.details.setPublicLoading,
  setCollaborativeLoading: state.project.details.setCollaborativeLoading,
  unshareLoading: state.project.details.unshareLoading,
  deleteLoading: state.project.details.deleteLoading,
  setPublicError: state.project.details.setPublicError,
  setCollaborativeError: state.project.details.setCollaborativeError,
  unshareError: state.project.details.unshareError,
  deleteError: state.project.details.deleteError,
  user: state.user,
  performance_mode: state.project.player.performance_mode,
  autoDetect: state.project.player.autoDetect,
  semiAutoAnnotation: state.project.player.semiAutoAnnotation,
  semiAutoAnnotationMe: state.project.player.semiAutoAnnotationMe,
  sequencing: state.project.player.sequencing,
  annotations: state.project.video.annotations,
  ownAnnotations: state.project.details.ownAnnotations,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openShareDialog: () => dispatch(openShareProject()),
  unshareProject: (projectId: string) =>
    unshareProjectThunk(projectId)(dispatch),
  onClickDelete: (projectId: string) => deleteProjectThunk(projectId)(dispatch),
  onClickSetPublic: (projectId: string, value: boolean) =>
    setProjectPublicThunk(projectId, value)(dispatch),
  onClickSetCollaborative: (projectId: string, value: boolean) =>
    setProjectCollaborativeThunk(projectId, value)(dispatch),
  onClickSwitchPlayerMode: () =>
    dispatch(playerSwitchMode()) && dispatch(triggerCancelAnnotation()),
  onClickSwitchSequencing: () =>
    dispatch(playerSwitchSequencing()) && dispatch(triggerCancelAnnotation()),

  onClickSwitchAutoDetection: () =>
    dispatch(playerSwitchAutoDetection()) &&
    dispatch(triggerCancelAnnotation()),

  onClickSwitchSemiAutoDetection: () =>
    dispatch(playerSwitchSemiAutoDetection()) &&
    dispatch(triggerCancelAnnotation()),

  onClickSwitchSemiAutoDetectionMe: () =>
    dispatch(playerSwitchSemiAutoDetectionMe()) &&
    dispatch(triggerCancelAnnotation()),

  onClickSwitchOwnAnnotations: () =>
    dispatch(switchOwnAnnotations()) && dispatch(triggerCancelAnnotation()),
  onChangeAnnotationShowingMode: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => dispatch(setAnnotationShowingMode(event.target.value)),
});

const SideBarContainer: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  const content = new Set([
    { subtitle: t('project.creatorRole'), ...props.project.user },
    ...props.project.members,
  ]);

  const onClickShare = () => {
    if (props.project.shared) {
      props.unshareProject(props.project.id);
    } else {
      props.openShareDialog();
    }
  };

  return (
    <SideBarComponent
      {...props}
      onClickShare={onClickShare}
      members={content}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBarContainer);
