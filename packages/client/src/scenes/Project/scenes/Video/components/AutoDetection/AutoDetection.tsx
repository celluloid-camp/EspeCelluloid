import { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'types/StateTypes';
import {
  Modal,
  withStyles,
  WithStyles,
  Button,
  Grid,
  Typography,
  Divider,
  Link,
} from '@material-ui/core';
import * as faceapi from '@vladmandic/face-api';
import styles from './styles';
import { AnnotationData } from '@celluloid/types';
import AnnotationService from 'services/AnnotationService';

interface Props extends WithStyles<typeof styles> {
  positionFloored: number;
  // position: number;
  playing: boolean;
  projectId: string;
  onEmotionDetectedChange(emotion: string): void;
}

export const AutoDetection = ({
  classes,
  positionFloored,
  playing,
  projectId,
  onEmotionDetectedChange,
}: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const captureIntervalRef = useRef<number | null>(null);
  const startPositionRef = useRef<number>(0);
  const annotations = useRef<AnnotationData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const videoRefTmp = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetection, setIsDetection] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);

  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    startPositionRef.current = positionFloored;
  }, [positionFloored]);

  function delay(milliseconds: number) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  const captureFrame = async () => {
    if (videoRef.current) {
      const video = videoRef.current;

      // Detect faces in the captured frame
      const detections = await faceapi
        .detectAllFaces(
          video as faceapi.TNetInput,
          new faceapi.TinyFaceDetectorOptions()
        )
        // .detectAllFaces(video as faceapi.TNetInput, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections.length) {
        setIsDetection(true);

        const emotion = Object.entries(detections[0]?.expressions).sort(
          (a, b) => b[1] - a[1]
        )[0][0];

        onEmotionDetectedChange(emotion);

        if (
          annotations.current.length !== 0 &&
          annotations.current[annotations.current.length - 1].emotion ===
            emotion
        )
          annotations.current[annotations.current.length - 1].stopTime =
            startPositionRef.current;
        else {
          if (annotations.current.length !== 0) {
            try {
              await AnnotationService.create(
                projectId,
                annotations.current[annotations.current.length - 1]
              );
            } catch (e) {
              setError(e);
            }

            annotations.current.pop();
          }

          const annotation: AnnotationData = {
            text: '',
            startTime: startPositionRef.current,
            stopTime: startPositionRef.current,
            pause: !playing,
            autoDetect: true,
            semiAutoDetect: false,
            emotion,
            ontology: [],
          };

          annotations.current.push(annotation);
        }
      } else {
        setIsDetection(false);
        onEmotionDetectedChange('');
      }

      await delay(100);

      requestAnimationFrame(() => captureFrame());
    }
  };

  useEffect(() => {
    const loadModels = async () => {
      setIsLoading(true);

      const modelPath =
        'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

      try {
        await Promise.all([
          await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
          // await faceapi.nets.tinyYolov2.loadFromUri(modelPath),
          // await faceapi.nets.ssdMobilenetv1.loadFromUri(modelPath),
          await faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
          await faceapi.nets.faceExpressionNet.loadFromUri(modelPath),
        ]);
      } catch (e) {
        setError('Failed to load the models ...');
      } finally {
        setIsLoading(false);
      }
    };

    let stream: MediaStream | null = null;

    const startStream = async () => {
      await loadModels();
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (stream && videoRef.current && videoRefTmp.current) {
          videoRef.current.srcObject = stream;
          videoRefTmp.current.srcObject = stream;
          await videoRefTmp.current.play();
          videoRef.current.play().then(() => {
            // if (videoRef.current)
            //   videoRef.current.currentTime = startPositionRef.current;
            // captureIntervalRef.current = window.setInterval(captureFrame, 500);
            captureFrame();
          });
        }
      } catch (err) {
        if (
          err.name === 'PermissionDeniedError' ||
          err.name === 'NotAllowedError'
        )
          setError(
            `Camera Error: camera permission denied: ${err.message || err}`
          );
        if (err.name === 'SourceUnavailableError')
          setError(`Camera Error: camera not available: ${err.message || err}`);
        return null;
      }
    };

    startStream();

    return () => {
      // console.log(annotations.current);
      // clearInterval(captureIntervalRef.current as number);

      const pushLastAnnotation = async () => {
        if (annotations.current.length !== 0) {
          try {
            await AnnotationService.create(
              projectId,
              annotations.current[annotations.current.length - 1]
            );
          } catch (e) {
            setError(e);
          }

          annotations.current.pop();
        }
      };

      pushLastAnnotation();

      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <>
      <video ref={videoRef} style={{ display: 'none' }} />
      {/* <canvas ref={canvasRef} style={{ display: 'none' }} /> */}
      {/* <canvas ref={canvasRef} style={{ height: '700px', width: '1000px' }} /> */}
      {/* <div
        style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', background: 'black', padding: '5px' }}>{positionFloored} -- {position}
        </div> */}

      <Modal open={modalOpen} onClose={closeModal}>
        <div className={classes.modal}>
          <Grid
            className={classes.gridContainer}
            container
            direction="column"
            justify="space-between"
            alignItems="center"
          >
            <Grid item className={classes.videoContainer}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography gutterBottom variant="h6" color="primary">
                  Auto Detection Mode
                </Typography>
                <video
                  ref={videoRefTmp}
                  autoPlay
                  style={{
                    display: 'block',
                    width: '90%',
                    height: '90%',
                    zIndex: '100',
                  }}
                  id="video"
                  playsInline
                  className="video"
                ></video>
              </div>
            </Grid>

            <Grid item className={classes.detectionState}>
              {isLoading && (
                <Typography className={classes.text}>Loading ...</Typography>
              )}

              {!isLoading && isDetection && (
                <Typography color="primary" paragraph>
                  Detection OK
                </Typography>
              )}

              {!isLoading && !isDetection && (
                <Typography color="error" paragraph>
                  Detection failed, please follow the recommendations
                </Typography>
              )}

              {error && (
                <Typography color="error" paragraph>
                  {error}
                </Typography>
              )}

              <Divider className={classes.divider} variant="middle" />

              <Typography className={classes.text} paragraph>
                Please follow these recommendation before using this mode
              </Typography>

              <Link>Click here</Link>

              <Divider className={classes.divider} variant="middle" />
            </Grid>

            <Grid item>
              <Button variant="contained" color="primary" onClick={closeModal}>
                OK
              </Button>
            </Grid>
          </Grid>
        </div>
      </Modal>
    </>
  );
};

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AutoDetection));
