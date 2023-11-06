import 'rc-slider/assets/index.css';
import {
  Button,
  Checkbox,
  createStyles,
  FormControlLabel,
  IconButton,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Clear';
import { Range } from 'rc-slider';
import React from 'react';
import { formatDuration } from 'utils/DurationUtils';
import TransparentInput from '../TransparentInput';
import { sliderRailStyle, sliderTrackStyle } from 'utils/SliderUtils';
import { useTranslation } from 'react-i18next';
import EmotionOntologyPicker from './EmotionOntologyPicker';
import addAnnotation from '../../api/Annotation';
import { UserRecord } from '@celluloid/types';
import styles from './styles';
import getFirstConcepts, {
  getSubConcepts,
  getRelation,
} from '../../api/Concept';
import { PostAnnotation } from './EmotionOntologyPicker';

const caretStart = require('images/caret-start.png');
const caretStop = require('images/caret-stop.png');

interface Props extends WithStyles<typeof styles> {
  user: UserRecord;
  startTime: number;
  stopTime: number;
  pause: boolean;
  projectId: string;
  text: string;
  emotion?: string;
  duration: number;
  position: number;
  error?: string;
  ontology?: string[];
  performance_mode: boolean;
  sequencing:boolean;
  emotionDetected: string;
  onTextChange(text: string): void;
  onEmotionChange(emotion: string): void;
  onCheckPauseChange(value: boolean): void;
  onTimingChange(value: number, isStart: boolean, seekAhead: boolean): void;
  onClickSave(): void;
  onClickCancel(): void;
}

interface TimingButtonProps extends WithStyles<typeof styles> {
  forward: boolean;
  onSeek(): void;
}

interface TimingControlProps extends WithStyles<typeof styles> {
  position: number;
  onBack(): void;
  onForward(): void;
}

const TimingButton = (props: TimingButtonProps) => (
  <Button
    classes={{ root: props.classes.buttonRoot }}
    size="small"
    onClick={() => {
      props.onSeek();
    }}
  >
    {!props.forward ? `◀` : `▶`}
  </Button>
);

const TimingControl = (props: TimingControlProps) => (
  <>
    <TimingButton
      forward={false}
      onSeek={props.onBack}
      classes={props.classes}
    />
    <Typography variant="caption">{formatDuration(props.position)}</Typography>
    <TimingButton
      forward={true}
      onSeek={props.onForward}
      classes={props.classes}
    />
  </>
);

const AnnotationEditorComponent: React.FC<Props> = ({
  user,
  startTime,
  stopTime,
  pause,
  text,
  emotion,
  duration,
  position,
  error,
  projectId,
  performance_mode,
  sequencing,
  onCheckPauseChange,
  onTimingChange,
  onTextChange,
  onEmotionChange,
  onClickSave,
  onClickCancel,
  emotionDetected,
  classes,
}: Props) => {
  const { t } = useTranslation();

  const handleStyles = {
    border: 0,
    borderRadius: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    backgroundSize: 'cover',
    width: 12,
    height: 12,
  };

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        {/* <div className={classes.centerVerticalement}>
          <EmotionOntologyPicker
            position={position}
            emotion={emotion}
            onEmotionChange={onEmotionChange}
            perf={performance_mode}
            emotionDetected={emotionDetected}
          />
        </div> */}
        <>
     
          {/* <TransparentInput
            text={text}
            error={error}
            onChange={onTextChange}
            placeholder={t('annotation.contentPlaceholder')}
          /> */}
          <EmotionOntologyPicker
            text={text}
            error={error}
            onTextChange={onTextChange}
            position={position}
            emotion={emotion}
            onEmotionChange={onEmotionChange}
            perf={performance_mode}
            sequencing={sequencing}
            emotionDetected={emotionDetected}
          />
        
        </>
        <div className={classes.timeline}>
          <TimingControl
            onBack={() =>
              onTimingChange(Math.max(0, startTime - 1), true, true)
            }
            onForward={() =>
              onTimingChange(Math.min(stopTime, startTime + 1), true, true)
            }
            position={startTime}
            classes={classes}
          />
          <div style={{ padding: 8, flexGrow: 1 }}>
            <Range
              min={0}
              max={duration}
              value={[startTime, stopTime]}
              onChange={(values) => {
                if (startTime !== values[0]) {
                  onTimingChange(values[0], true, false);
                } else if (stopTime !== values[1]) {
                  onTimingChange(values[1], false, false);
                }
              }}
              onAfterChange={(values) => {
                if (startTime !== values[0]) {
                  onTimingChange(values[0], true, true);
                } else if (stopTime !== values[1]) {
                  onTimingChange(values[1], false, true);
                }
              }}
              trackStyle={sliderTrackStyle}
              railStyle={sliderRailStyle}
              handleStyle={[
                {
                  ...handleStyles,
                  marginTop: -11,
                  marginLeft: -5,
                  backgroundImage: `url(${caretStart})`,
                },
                {
                  ...handleStyles,
                  marginTop: 3,
                  marginLeft: -6,
                  backgroundImage: `url(${caretStop})`,
                },
              ]}
              allowCross={false}
            />
          </div>
          <TimingControl
            onBack={() =>
              onTimingChange(Math.max(startTime, stopTime - 1), false, true)
            }
            onForward={() =>
              onTimingChange(Math.min(stopTime + 1, duration), false, true)
            }
            position={stopTime}
            classes={classes}
          />
        </div>
        <div className={classes.buttons}>
          {/* <FormControlLabel
            control={
              <Checkbox
                checked={pause}
                onChange={(event) => onCheckPauseChange(event.target.checked)}
              />
            }
            label={t("annotation.pauseLabel")}
          /> */}
          <IconButton color="secondary" onClick={() => onClickCancel()}>
            <CancelIcon />
          </IconButton>
          <IconButton
            color="primary"
            // onClick={() => onClickSave()}
            onClick={async () => {
              const annotationId = await onClickSave();
              PostAnnotation(
                user,
                startTime,
                stopTime,
                text,
                projectId,
                annotationId
              );
            }}
          >
            <CheckIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(AnnotationEditorComponent);
