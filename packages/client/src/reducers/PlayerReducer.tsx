import { AnyAction } from 'redux';
import { ActionType } from 'types/ActionTypes';
import { PlayerState } from 'types/StateTypes';

const initialState = {
  performance_mode: false,
  autoDetect: false,
  semiAutoAnnotation: false,
  semiAutoAnnotationMe: false,
  seeking: false,
  sequencing: false,
} as PlayerState;

export default (
  state = initialState,
  { type, payload }: AnyAction
): PlayerState => {
  switch (type) {
    case ActionType.PLAYER_NOTIFY_SEEK:
      return {
        ...state,
        seeking: false,
      };
    case ActionType.PLAYER_REQUEST_SEEK:
      return {
        ...state,
        seeking: true,
        seekTarget: payload,
      };
    case ActionType.PLAYER_SWITCH_MODE:
      return {
        ...state,
        performance_mode: !state.performance_mode,
      };
    case ActionType.PLAYER_SWITCH_SEQUENCING:
      return {
        ...state,
        sequencing: !state.sequencing,
      };

    case ActionType.PLAYER_SWITCH_AUTO_DETECTION:
      if (state.autoDetect)
        return {
          ...state,
          semiAutoAnnotation: false,
          semiAutoAnnotationMe: false,
          autoDetect: false,
        };
      else
        return {
          ...state,
          autoDetect: true,
        };

    case ActionType.PLAYER_SWITCH_SEMI_AUTO_DETECTION:
      if (state.semiAutoAnnotation)
        return {
          ...state,
          semiAutoAnnotationMe: false,
          semiAutoAnnotation: false,
        };
      else
        return {
          ...state,
          autoDetect: true,
          semiAutoAnnotationMe: false,
          semiAutoAnnotation: true,
        };

    case ActionType.PLAYER_SWITCH_SEMI_AUTO_DETECTION_ME:
      if (state.semiAutoAnnotationMe)
        return {
          ...state,
          semiAutoAnnotation: false,
          semiAutoAnnotationMe: false,
        };
      else
        return {
          ...state,
          autoDetect: true,
          semiAutoAnnotation: false,
          semiAutoAnnotationMe: true,
        };

    default:
      return state;
  }
};
