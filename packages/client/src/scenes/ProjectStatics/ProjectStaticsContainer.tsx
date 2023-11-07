import { ProjectGraphRecord, UserRecord } from "@celluloid/types";
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





import { SharedLayout } from "scenes/Menu";
import 'chart.js/auto';
import {Chart, ArcElement} from 'chart.js'

import { Bar , Doughnut, Pie} from 'react-chartjs-2';
import './style.css'
Chart.register(ArcElement);
// Chart.register(Bar);
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";


interface Props {
  user?: UserRecord;
  project?: ProjectGraphRecord;
  error?: string;
  loadProject(projectId: string): AsyncAction<ProjectGraphRecord, string>;
  clearProject(): EmptyAction;
}

const mapStateToProps = (state: AppState) => ({
  user: state.user,
  project: state.project.details.project,
  error: state.project.details.error,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loadProject: (projectId: string) => loadProjectThunk(projectId)(dispatch),
  clearProject: () => dispatch(clearProject()),
});

const labels=['Happy', 'Laugh', 'Smile', 'Sad', 'Surprise', 'Angry', 'Disgusted', 'Fearful', 'Empathy', 'ItsStrange'] ;
const data= {
  labels: labels,
  datasets: [{
     label: "nombre de réaction",
     data: [20, 14, 24, 40, 30, 35,4,15, 4, 9],
     maxBarThickness: 30,
 
  }],
}
const Doughnutdata= {
  labels: ['iLike', 'iDontLike'],
  datasets: [{
     label: "Jugements",
     data: [20, 12],
  }],
}
const Piedata= {
  labels: ['Automatique', 'SA', 'SA moi uniquement','Commentaire','Emojis'],
  datasets: [{
     label: "Modes",
     data: [80, 56,43,5,17],
  }],
}
const Ontologydata= {
  labels: ['Staging', 'Dramaturgy', 'Acting'],
  datasets: [{
     label: "Ontologie",
     data: [22, 5,3],
  }],
}
const Doubledata= {
  labels: labels,
  datasets: [
  {
     label: "automatique",
     data: [20, 12, 8, 40, 30, 35,4,15,0,0],
     maxBarThickness: 30,
     barPercentage: 0.5,
 
  },
  {
    label: "déclarative",
    data: [2, 11, 24, 50, 40, 3,14,5,4,9],
    maxBarThickness: 30,
    barPercentage: 0.5,

 },
 
  
],
}
const options= { 
  responsive: false, 
  maintainAspectRatio: false
}

const ProjectStatics: React.FC<Props> = ({
  user,
  loadProject,
  project,
}) => {
  let { projectId } = useParams();

  const load = () => {
    if (projectId) {
      loadProject(projectId);
    }
  };

  useDidUpdate(() => {
    load();
  }, [user]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    return (
      <SharedLayout>
      <ProjectStaticsComponent project={project}  />   
    </SharedLayout>
    );
  };
  export default connect(mapStateToProps, mapDispatchToProps) (ProjectStatics);