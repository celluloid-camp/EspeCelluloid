import { createStyles, Theme } from '@material-ui/core';

const styles = ({ spacing, palette }: Theme) => createStyles({
  video: {
    width: "600px",
    height: "400px",
    opacity: 0,
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
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
  section1: {
    width: '100%',
    height: '15rem',
    position: 'relative',
    margin: '1rem 0'
  },

  section2: {

  },

  text: {
    color: 'black',
  },

  divider: {
    backgroundColor: '#D3D3D3',

  }
});

export default styles;