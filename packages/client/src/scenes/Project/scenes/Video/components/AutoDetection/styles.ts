import { createStyles, Theme } from '@material-ui/core';

const styles = ({ spacing, palette }: Theme) =>
  createStyles({
    video: {
      width: '600px',
      height: '400px',
      opacity: 0,
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
    modal: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '400px',
      height: '85vh',
      background: '#f3f3f3',
      // overflow: 'hidden',
      borderRadius: '7px',
      // boxShadow: theme.shadows[5],
      padding: '10px',
      outline: 'none',
    },

    gridContainer: {
      height: '100%',
    },

    videoContainer: {
      width: '100%',
      margin: '1rem 0',
    },

    detectionState: {},

    text: {
      color: 'black',
    },

    divider: {
      backgroundColor: '#D3D3D3',
      marginY: '5px',
    },
  });

export default styles;
