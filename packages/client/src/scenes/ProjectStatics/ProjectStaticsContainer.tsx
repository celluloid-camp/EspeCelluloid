import { SharedLayout } from "scenes/Menu";
import 'chart.js/auto';
import {Chart, ArcElement} from 'chart.js'

import { Bar , Doughnut, Pie} from 'react-chartjs-2';
import './style.css'
Chart.register(ArcElement);
// Chart.register(Bar);
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
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

const ProjectStatics: React.FC = ({
 
  }) => {
   
  
    return (
      <SharedLayout>
      {/* <ProjectComponent project={project} onVideoChange={load} /> */}
      {/* <div>
      <div>
     
      </div>
      </div> */}
        <div className="App">
          <div className="container">
            <div className="card">
              <Bar data={data} /> 
            </div>
            <div className="card">
              <Bar data={Doubledata} /> 
            </div>
            <div className="card">
              <Doughnut data={Doughnutdata} /> 
            </div>
            <div className="card">
              <Doughnut data={Ontologydata} /> 
            </div>
            <div className="card">
              <Pie data={Piedata} /> 
            </div>
          </div>
        </div>
        {/* <div className="App">
          <div className="container">
            <div className="card">
            <Bar data={data} options={options}/> 
            
            </div>
          </div>
        </div>
           */}
         
     
    </SharedLayout>
    );
  };
  export default (ProjectStatics);