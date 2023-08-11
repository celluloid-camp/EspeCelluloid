import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { AppState } from "types/StateTypes";
import {
  Modal,
  withStyles,
  WithStyles,
  Button,
  Grid,
  Typography,
  Divider,
} from "@material-ui/core";
import * as faceapi from "@vladmandic/face-api";
import styles from "./styles";
import { AnnotationData } from "@celluloid/types";
import AnnotationService from "services/AnnotationService";

interface Props extends WithStyles<typeof styles> {
  positionFloored: number;
  // position: number;
  playing: boolean;
  projectId: string;
}

export const AutoDetection = ({
  classes,
  positionFloored,
  playing,
  projectId,
}: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const captureIntervalRef = useRef<number | null>(null);
  const startPositionRef = useRef<number>(0);
  const annotations = useRef<AnnotationData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const videoRefTmp = useRef<HTMLVideoElement>(null);
  const [detectionState, setDetectionState] = useState<string>("Loading ...");
  const [modalOpen, setModalOpen] = useState(true);

  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    startPositionRef.current = positionFloored;
  }, [positionFloored]);

  useEffect(() => {
    const loadModels = async () => {
      // load models
      const modelPath =
        "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";
      await Promise.all([
        await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
        // await faceapi.nets.tinyYolov2.loadFromUri(modelPath),
        // await faceapi.nets.ssdMobilenetv1.loadFromUri(modelPath),
        await faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
        await faceapi.nets.faceExpressionNet.loadFromUri(modelPath),
      ]);
    };

    loadModels();
  }, []);

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
        setDetectionState("Detection OK");

        const emotion = Object.entries(detections[0]?.expressions).sort(
          (a, b) => b[1] - a[1]
        )[0][0];

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
            text: "",
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
      } else
        setDetectionState("No detection, Please follow the recommendations");

      await delay(100);

      requestAnimationFrame(() => captureFrame());
    }
  };

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startStream = async () => {
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
          err.name === "PermissionDeniedError" ||
          err.name === "NotAllowedError"
        )
          setError(
            `Camera Error: camera permission denied: ${err.message || err}`
          );
        if (err.name === "SourceUnavailableError")
          setError(`Camera Error: camera not available: ${err.message || err}`);
        return null;
      }
    };

    startStream();

    return () => {
      // console.log(annotations.current);
      // clearInterval(captureIntervalRef.current as number);

      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <>
      <video ref={videoRef} style={{ display: "none" }} />
      {/* <canvas ref={canvasRef} style={{ display: 'none' }} /> */}
      {/* <canvas ref={canvasRef} style={{ height: '700px', width: '1000px' }} /> */}
      {/* <div
        style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', background: 'black', padding: '5px' }}>{positionFloored} -- {position}
        </div> */}

      <Modal open={modalOpen} onClose={closeModal}>
        <div className={classes.modal}>
          <Grid container direction="column" justify="space-between">
            <Grid item className={classes.section1}>
              <div>
                <div
                  style={{ background: "grey", zIndex: 10, width: "100%" }}
                ></div>
                <video
                  ref={videoRefTmp}
                  autoPlay
                  style={{
                    display: "block",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: "100",
                  }}
                  id="video"
                  playsInline
                  className="video"
                ></video>
              </div>
            </Grid>

            <Grid item className={classes.section2}>
              <div>
                <p> Detection state: {detectionState}</p>
              </div>
              <Divider className={classes.divider} variant="middle" />
              <Typography gutterBottom variant="h6" color="primary">
                Auto Detection Mode
              </Typography>

              <Typography className={classes.text} paragraph>
                Please follow these recommendation before using this mode
              </Typography>

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
