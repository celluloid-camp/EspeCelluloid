import { AnyAction } from 'redux';
import { ActionType } from 'types/ActionTypes';
import { PlayerState } from 'types/StateTypes';

const initialState = {
  performance_mode: false,
  autoDetection_mode: false,
  seeking: false,
  sequencing: false
} as PlayerState;

export default (state = initialState, { type, payload }: AnyAction): PlayerState => {
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
        seekTarget: payload
      };
    case ActionType.PLAYER_SWITCH_MODE:
      return {
        ...state,
        performance_mode: !state.performance_mode
      };
    case ActionType.PLAYER_SWITCH_SEQUENCING:
      return {
        ...state,
        sequencing: !state.sequencing
      };

    // Auto Detect Reducer
    case ActionType.PLAYER_SWITCH_AUTO_DETECTION:
      return {
        ...state,
        autoDetection_mode: !state.autoDetection_mode
      };


    // case ActionType.PLAYER_START_AUTO_DETECTION:
    //   return {
    //     ...state,
    //     autoDetection_mode: true
    //   };

    // case ActionType.PLAYER_STOP_AUTO_DETECTION:
    //   return {
    //     ...state,
    //     autoDetection_mode: false
    //   };

    default:
      return state;
  }
};