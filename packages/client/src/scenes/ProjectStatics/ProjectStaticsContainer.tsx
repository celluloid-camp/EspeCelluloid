import { ProjectGraphRecord, UserRecord, AnnotationRecord } from "@celluloid/types";
import { clearProject, loadProjectThunk } from "actions/ProjectActions";

import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { AsyncAction, EmptyAction } from "types/ActionTypes";
import { AppState } from "types/StateTypes";
import { useParams } from "react-router-dom";
import { useDidUpdate } from "rooks";
import ProjectStaticsComponent from "./ProjectStaticsComponent";
import { useEffect } from "react";
import {
  listAnnotationsThunkGeneral,
  triggerBlurAnnotation,
} from 'actions/AnnotationsActions';




import { SharedLayout } from "scenes/Menu";
import 'chart.js/auto';
import {Chart, ArcElement} from 'chart.js'

import { Bar , Doughnut, Pie} from 'react-chartjs-2';
import './style.css'
import { props } from "ramda";
import { any } from "prop-types";
Chart.register(ArcElement);
// Chart.register(Bar);
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";


interface Props {
  user?: UserRecord;
  project?: ProjectGraphRecord;
  annotations?: AnnotationRecord[];
  error?: string;
  loadProject(projectId: string): AsyncAction<ProjectGraphRecord, string>;
  loadAnnotation(projectId: string): AsyncAction<AnnotationRecord[], string>;
  clearProject(): EmptyAction;
}

const mapStateToProps = (state: AppState) => ({
  user: state.user,
  project: state.project.details.project,
  error: state.project.details.error,
  annotations: state.project.video.annotations,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loadProject: (projectId: string) => loadProjectThunk(projectId)(dispatch),
  loadAnnotation: (projectId: string) => listAnnotationsThunkGeneral(projectId)(dispatch),
  clearProject: () => dispatch(clearProject()),
});

const ProjectStatics: React.FC<Props> = ({
  user,
  loadProject,
  loadAnnotation,
  project,
 annotations,
 error,
}) => {
  let { projectId } = useParams();
  
  const load = () => {
    if (projectId) {
      loadProject(projectId);
    
    }
  };
  const loadProjectAnnotation = () => {
    if (projectId) {
      loadAnnotation(projectId);
    }
  };

  useDidUpdate(() => {
    load();
    loadProjectAnnotation();
    
  }, [user]);


  useEffect(() => {
    load();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
  
    loadProjectAnnotation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
    return (
      <SharedLayout>
      <ProjectStaticsComponent project={project} annotations={annotations} />   
    </SharedLayout>
    );
  };
  export default connect(mapStateToProps, mapDispatchToProps) (ProjectStatics);