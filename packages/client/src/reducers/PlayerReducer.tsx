import { AnyAction } from 'redux';
import { ActionType } from 'types/ActionTypes';
import { PlayerState } from 'types/StateTypes';

const initialState = {
  performance_mode: false,
  autoDetection_mode: false,
  semiAutoDetection_mode: false,
  semiAutoDetectionMe_mode: false,
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
      if (state.autoDetection_mode)
        return {
          ...state,
          semiAutoDetection_mode: false,
          semiAutoDetectionMe_mode: false,
          autoDetection_mode: false,
        };
      else
        return {
          ...state,
          autoDetection_mode: true,
        };

    case ActionType.PLAYER_SWITCH_SEMI_AUTO_DETECTION:
      if (state.semiAutoDetection_mode)
        return {
          ...state,
          semiAutoDetectionMe_mode: false,
          semiAutoDetection_mode: false,
        };
      else
        return {
          ...state,
          autoDetection_mode: true,
          semiAutoDetectionMe_mode: false,
          semiAutoDetection_mode: true,
        };

    case ActionType.PLAYER_SWITCH_SEMI_AUTO_DETECTION_ME:
      if (state.semiAutoDetectionMe_mode)
        return {
          ...state,
          semiAutoDetection_mode: false,
          semiAutoDetectionMe_mode: false,
        };
      else
        return {
          ...state,
          autoDetection_mode: true,
          semiAutoDetection_mode: false,
          semiAutoDetectionMe_mode: true,
        };

    default:
      return state;
  }
};
