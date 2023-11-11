import { ProjectGraphRecord, AnnotationRecord } from '@celluloid/types';
import {calcEmotion, calcAnnotationType,calcJugement, calcEmotionByMode} from './calculate'
import {
  Grid,
  MuiThemeProvider,
  WithStyles,
  withStyles,
  Typography,
  Divider
} from '@material-ui/core';
import { styles } from '../Project/ProjectStyles';
import 'chart.js/auto';
import {Chart, ArcElement} from 'chart.js'
import { Bar , Doughnut, Pie} from 'react-chartjs-2';
import {
  listAnnotationsThunk,
  triggerBlurAnnotation,
} from 'actions/AnnotationsActions';
import './style.css'
import Project from 'scenes/Project';
import { project } from 'ramda';
Chart.register(ArcElement);


interface Props extends WithStyles<typeof styles> {
  project?: ProjectGraphRecord;
  annotations?: AnnotationRecord[];

}
const labels=['Happy', 'Laugh', 'Smile', 'Sad', 'Surprise', 'Angry', 'Disgusted', 'Fearful', 'Empathy', 'ItsStrange'] ;
const data= {
  labels: labels,
  datasets: [{
     label: "nombre de réaction",
     data: [20, 14, 24, 40, 30, 35,4,15, 4, 9],
     maxBarThickness: 30,
     backgroundColor:['#0B9A8D']
 
  }],
}
const Doughnutdata= {
  labels: ['iLike', 'iDontLike'],
  datasets: [{
     label: "Jugements",
     data: [20, 12],
     backgroundColor:['#0075A4','#D8D8D8']
  }],
}
const Piedata= {
  labels: ['Automatique', 'SA','Commentaire','Emojis'],
  datasets: [{
     label: "Modes",
     data: [80, 56,5,17],
     backgroundColor:['#772F67','#9C2162','#D03454','#FF6F50']
  }],
}
const Ontologydata= {
  labels: ['Staging', 'Dramaturgy', 'Acting'],
  datasets: [{
     label: "Ontologie",
     data: [22, 5,3],
     backgroundColor:['#034D44','#077368','#62BEB6']
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
     backgroundColor:['#D5255E']
 
  },
  {
    label: "déclaratif",
    data: [2, 11, 24, 50, 40, 3,14,5,4,9],
    maxBarThickness: 30,
    barPercentage: 0.5,
    backgroundColor:['#0B9A8D']

 }, 
],
}
const options= { 
  responsive: false, 
  maintainAspectRatio: false
}

export default 
  withStyles(styles)(({
  project,
  classes,
  annotations

}: Props) => {
  console.log('misu ', annotations)
     return(
    <div className={classes.root}>
        {project &&
        <div>
      <Typography  style={{ margin: '40px', fontStyle:'revert-layer' , color:'#0B9A8D'}} align="center" variant="h3" gutterBottom={true} >
         Résultat des annotations de la pièce {project.title}
      </Typography>
      </div>
        }
       
      <div className="app">

            <div className="container">
            <h2>Fréquence de chaque émotion</h2>
              <Bar data={calcEmotion(annotations)} className="card" /> 
            </div>
            <div className="container">
            <h2>Fréquence de chaque émotion en mode déclaratif et automatique</h2>
              <Bar data={calcEmotionByMode(annotations)} className="card" /> 
            </div>
            <div className="spacer"></div> 
         
            <div className="pieContainer">
            <h2>Résultats des jugements</h2>
              <Doughnut data={calcJugement(annotations)} className="card"/> 
            </div>
            <div className="pieContainer">
            <h2>Résultats des annotations sémantiques</h2>
              <Doughnut data={Ontologydata} className="card"/> 
            </div>
            <div className="pieContainer">
            <h2>Les types des annotations</h2>
              <Pie data={calcAnnotationType(annotations)} className="card" /> 
            </div>
          </div>
          <div className="spacer"></div> 
          </div>
          
      )});
