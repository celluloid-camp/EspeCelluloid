import {
  AnnotationRecord,
  ProjectGraphRecord,
  UserRecord,
} from "@celluloid/types";
import {
  listAnnotationsThunk,
  triggerBlurAnnotation,
} from "actions/AnnotationsActions";
import { playerNotifySeek, playerRequestSeek } from "actions/PlayerActions";
import * as R from "ramda";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Action, AsyncAction, EmptyAction } from "types/ActionTypes";
import { AppState } from "types/StateTypes";
import * as AnnotationUtils from "utils/AnnotationUtils";
import ReactPlayer from "@celluloid/react-player";

import VideoComponent, {
  PlayerEvent,
  PlayerProgressState,
} from "./VideoComponent";

import AutoDetection from "./components/AutoDetection";

const AutoDetectionMemo = React.memo(AutoDetection)


const FADE_TIMEOUT = 3000;

interface Props {
  user?: UserRecord;
  annotations: AnnotationRecord[];
  project: ProjectGraphRecord;
  seeking: boolean;
  focusedAnnotation?: AnnotationRecord;
  performance_mode: boolean;
  autoDetection_mode: boolean;
  sequencing_mode: boolean;
  load(projectId: string): AsyncAction<AnnotationRecord[], string>;
  notifySeek(): EmptyAction;
  requestSeek(seekTarget: number): Action<number>;
  blurAnnotation(): EmptyAction;
}

interface State {
  player?: ReactPlayer;
  position: number;
  positionFloored: number;
  duration: number;
  playing: boolean;
  fullscreen: boolean;
  showControls: boolean;
  showHints: boolean;
  visibleAnnotations: AnnotationRecord[];
  performance_mode: boolean;
}

const mapStateToProps = (state: AppState) => ({
  user: state.user,
  annotations: state.project.video.annotations,
  seeking: state.project.player.seeking,
  focusedAnnotation: state.project.video.focusedAnnotation,
  performance_mode: state.project.player.performance_mode,
  autoDetection_mode: state.project.player.autoDetection_mode,
  sequencing_mode: state.project.player.sequencing
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  load: (projectId: string) => listAnnotationsThunk(projectId)(dispatch),
  notifySeek: () => dispatch(playerNotifySeek()),
  requestSeek: (seekTarget: number) => dispatch(playerRequestSeek(seekTarget)),
  blurAnnotation: () => dispatch(triggerBlurAnnotation()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class extends React.Component<Props, State> {
    fadeoutTimer = -1;
    refreshTimer = -1;
    state = {
      playing: true,
      position: 0,
      positionFloored: 0,
      duration: 0,
      fullscreen: false,
      showControls: true,
      showHints: false,
      visibleAnnotations: [],
      annotating: false,
      performance_mode: false,
    } as State;

    componentDidMount() {
      this.resetFadeOutTimer();
      this.props.load(this.props.project.id);
    }

    componentDidUpdate(prevProps: Props) {
      if (!R.equals(this.props.user, prevProps.user)) {
        this.props.load(this.props.project.id);
      }
    }

    componentWillUnmount() {
      clearInterval(this.refreshTimer);
      clearInterval(this.fadeoutTimer);
    }

    refreshPlayer() {
      const { player } = this.state;
      if (player) {
        const annotations = this.props.annotations;
        const focusedAnnotation = this.props.focusedAnnotation;
        const position = player.getCurrentTime();
        if (position) {
          const visibleAnnotations = annotations.filter((annotation) =>
            AnnotationUtils.visible(annotation, position)
          );

          visibleAnnotations.forEach((annotation) => {
            if (
              annotation.pause &&
              annotation.startTime >= position - 0.1 &&
              annotation.startTime < position + 0.1
            ) {
              // player.pause();
              this.setState({
                playing: false,
              });
              player.seekTo(position + 0.1, "seconds");
            }
          });

          const isFocusedAnnotationPredicate = (elem: AnnotationRecord) =>
            !!focusedAnnotation && elem.id === focusedAnnotation.id;
          const shouldBlur =
            !R.find(isFocusedAnnotationPredicate, visibleAnnotations) &&
            focusedAnnotation;

          if (shouldBlur) {
            this.props.blurAnnotation();
          }

          if (!this.props.seeking) {
            this.setState({
              visibleAnnotations,
              position: position,
              positionFloored: (Math.round(position * 10) / 10),
            });
          }
        }
      }
    }

    resetFadeOutTimer() {
      this.setState({ showControls: true });
      clearInterval(this.fadeoutTimer);
      this.fadeoutTimer = window.setInterval(
        this.fadeOutControls.bind(this),
        FADE_TIMEOUT
      );
    }

    fadeOutControls() {
      this.setState({ showControls: false });
    }

    seek(value: number, pause: boolean, seekAhead: boolean) {
      this.setState({ position: value, positionFloored: (Math.round(value * 10) / 10) });
      const player = this.state.player;
      if (!this.props.performance_mode) {
        if (player) {
          if (pause) {
            // player.pauseVideo();
            this.setState({
              playing: false,
            });
          }
          console.log("seekTo", value);
          player.seekTo(value, "seconds");
          // this.props.requestSeek(value);
        }
      } else {
        if (player) {
          this.setState({
            playing: false,
          });
          player.seekTo(value, "seconds");
        }
      }
    }

    render() {
      const { user, project, annotations } = this.props;

      const {
        player,
        playing,
        position,
        positionFloored,
        duration,
        showControls,
        showHints,
        fullscreen,
        visibleAnnotations,
      } = this.state;

      const onUserAction = this.resetFadeOutTimer.bind(this);

      const onPlayerReady = (player: ReactPlayer) => {
        console.log("onPlayerReady");
        this.refreshTimer = window.setInterval(
          this.refreshPlayer.bind(this),
          500
        );
        this.setState({
          player,
          duration: player.getDuration(),
        });
      };

      const onPlayerProgress = (state: PlayerProgressState) => {
        this.setState({
          position: state.playedSeconds,
          positionFloored: (Math.round(state.playedSeconds * 10) / 10)

        });
      };

      const onDuration = (duration: number) => {
        console.log("onDuration");
        this.setState({
          duration,
        });
      };

      const onPlayerStateChange = (event: PlayerEvent, data: number) => {
        console.log('hhhhhhhhhhhhhh')
        switch (event) {
          case PlayerEvent.PLAYING:
            console.log('WE ARE PLAYING')
            this.setState({ playing: true });
            this.props.notifySeek();
            break;
          case PlayerEvent.BUFFERING:
          case PlayerEvent.ENDED:
          case PlayerEvent.PAUSED:
          default:
            console.log('WE ARE PAUSED')
            this.setState({ playing: false });
        }
      };

      const onFullscreenChange = (newFullscreen: boolean) =>
        this.setState({ fullscreen: newFullscreen });
      const performance_mode = this.props.performance_mode;
      const onTogglePlayPause = () => {

        onUserAction();
        if (player) {

          if (playing && !this.props.performance_mode) {
            this.setState({ playing: false });
            // player.pauseVideo();
          } else {
            // player.playVideo();
            this.setState({ playing: true });
          }
        }
        return playing;
      };

      const onToggleFullscreen = () =>
        this.setState((prevState) => ({
          ...prevState,
          fullscreen: !prevState.fullscreen,
        }));

      const onToggleHints = () => {
        this.setState((prevState) => ({
          ...prevState,
          showHints: !prevState.showHints,
        }));
      };

      const onClickHint = (annotation: AnnotationRecord) => {
        this.setState({
          showHints: false,
        });
        this.seek(annotation.startTime, false, true);
      };

      const onSeek = this.seek.bind(this);

      return (

        <>
          <VideoComponent
            user={user}
            project={project}
            annotations={annotations}
            visibleAnnotations={visibleAnnotations}
            position={position}
            duration={duration}
            playing={playing}
            fullscreen={fullscreen}
            showControls={showControls}
            showHints={showHints}
            onUserAction={onUserAction}
            onPlayerReady={onPlayerReady}
            onPlayerStateChange={onPlayerStateChange}
            onPlayerProgress={onPlayerProgress}
            onDuration={onDuration}
            onFullscreenChange={onFullscreenChange}
            onTogglePlayPause={onTogglePlayPause}
            onToggleFullscreen={onToggleFullscreen}
            onToggleHints={onToggleHints}
            onClickHint={onClickHint}
            onSeek={onSeek}
            performance_mode={performance_mode}
          />

          {this.props.autoDetection_mode && (
            <AutoDetectionMemo
              positionFloored={positionFloored}
              playing={playing}
              projectId={project.id}
            // position={position}
            />
          )}


        </>
      );
    }
  }
);
