import { createStyles, Theme } from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing.unit,
      paddingTop: theme.spacing.unit,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    content: {
      flex: '1 1 auto',
      minWidth: 0,
      padding: `0 ${theme.spacing.unit * 2}px`,
      '&:first-child': {
        paddingLeft: 0,
      },
      margin: 10,
    },
    centerVerticalement: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    buttons: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    timeline: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    buttonRoot: {
      fontSize: 10,
      lineHeight: '20px',
      minWidth: 20,
      minHeight: 20,
      maxWidth: 20,
      maxHeight: 20,
      margin: 4,
      marginBottom: 7,
      padding: 0,
      borderRadius: '50%',
    },
  });

export default styles;
