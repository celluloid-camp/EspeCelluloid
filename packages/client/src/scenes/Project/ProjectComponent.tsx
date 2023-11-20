import { ProjectGraphRecord } from '@celluloid/types';
import {
  Grid,
  MuiThemeProvider,
  WithStyles,
  withStyles,
  Divider,
} from '@material-ui/core';
import ProjectSummary from 'components/ProjectSummary';
import * as React from 'react';
import { Dark } from 'utils/ThemeUtils';

import SideBar from './components/SideBar';
import { styles } from './ProjectStyles';
import Video from './scenes/Video';
import Metadatacomponent from './components/MetaData/Metadatacomponent';
interface Props extends WithStyles<typeof styles> {
  project?: ProjectGraphRecord;
  onVideoChange(): void;
}

export default withStyles(styles)(({ project, classes }: Props) => (
  <div className={classes.root}>
    <MuiThemeProvider theme={Dark}>
      <div className={classes.videoContainer}>
        <div className={classes.video}>
          {project && <Video project={project} />}
        </div>
      </div>
    </MuiThemeProvider>
    <div className={classes.content}>
      {project && (
        <div>
          <Grid
            container={true}
            direction="row"
            alignItems="flex-start"
            spacing={16}
          >
            <Grid item={true} xs={12}>
              <ProjectSummary project={project} />
            </Grid>
            <Grid className={classes.sideBar} item={true} xs={12}>
              <SideBar project={project} />
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Metadatacomponent project={project} />
        </div>
      )}
    </div>
  </div>
));
