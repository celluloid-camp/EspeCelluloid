import {
  ActionType,
  createAction,
  createEmptyAction
} from 'types/ActionTypes';

export const playerRequestSeek = (seekTarget: number) =>
  createAction(ActionType.PLAYER_REQUEST_SEEK, seekTarget);

export const playerNotifySeek = () =>
  createEmptyAction(ActionType.PLAYER_NOTIFY_SEEK);

export const playerSwitchMode = () =>
  createEmptyAction(ActionType.PLAYER_SWITCH_MODE);

export const playerSwitchSequencing = () =>
  createEmptyAction(ActionType.PLAYER_SWITCH_SEQUENCING);

//Auto Detect 
export const playerSwitchAutoDetection = () =>
  createEmptyAction(ActionType.PLAYER_SWITCH_AUTO_DETECTION);

// export const playerStartAutoDetection = () =>
//   createEmptyAction(ActionType.PLAYER_START_AUTO_DETECTION);

// export const playerStopAutoDetection = () =>
//   createEmptyAction(ActionType.PLAYER_STOP_AUTO_DETECTION);
