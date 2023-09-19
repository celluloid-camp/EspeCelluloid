import React, { forwardRef } from 'react';
import {
  Modal,
  withStyles,
  WithStyles,
  Button,
  Grid,
  Typography,
  Divider,
} from '@material-ui/core';
import styles from './styles';

interface Props extends WithStyles<typeof styles> {
  detectionState: string;
  modalOpen: boolean;
  closeModal(): void;
}

const DetectionModal = forwardRef<HTMLVideoElement, Props>(
  ({ detectionState, modalOpen, closeModal, classes }, videoRefTmp) => {
    return (
      <Modal open={modalOpen} onClose={closeModal}>
        <div className={classes.modal}>
          <Grid container direction="column" justify="space-between">
            <Grid item>
              <div>
                <div
                  style={{ background: 'grey', zIndex: 10, width: '100%' }}
                ></div>
                <video
                  ref={videoRefTmp}
                  autoPlay
                  style={{
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: '100',
                  }}
                  id="video"
                  playsInline
                  className="video"
                ></video>
              </div>
            </Grid>

            <Grid item>
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
    );
  }
);

export default withStyles(styles)(DetectionModal);
