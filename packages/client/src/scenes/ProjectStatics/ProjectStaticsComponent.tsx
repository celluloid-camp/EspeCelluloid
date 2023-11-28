import { ProjectGraphRecord, AnnotationRecord } from '@celluloid/types';
import { ChartData, ChartDataset } from 'chart.js/auto';
import React, { useState, useEffect } from 'react';
import {
  calcEmotion,
  calcAnnotationType,
  calcJugement,
  calcEmotionByMode,
  calcOntologyType,
} from './calculate';
import {
  Grid,
  MuiThemeProvider,
  WithStyles,
  withStyles,
  Typography,
  Divider,
} from '@material-ui/core';
import { styles } from '../Project/ProjectStyles';
import 'chart.js/auto';
import { Chart, ArcElement } from 'chart.js';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import './style.css';
import { useTable, useFilters, Column } from 'react-table';
Chart.register(ArcElement);

interface Props extends WithStyles<typeof styles> {
  project?: ProjectGraphRecord;
  annotations?: AnnotationRecord[];
}

const labels = [
  'Happy',
  'Laugh',
  'Smile',
  'Sad',
  'Surprise',
  'Angry',
  'Disgusted',
  'Fearful',
  'Empathy',
  'ItsStrange',
];
const data = {
  labels: labels,
  datasets: [
    {
      label: 'nombre de réaction',
      data: [20, 14, 24, 40, 30, 35, 4, 15, 4, 9],
      maxBarThickness: 30,
      backgroundColor: ['#0B9A8D'],
    },
  ],
};
const Doughnutdata = {
  labels: ['iLike', 'iDontLike'],
  datasets: [
    {
      label: 'Jugements',
      data: [20, 12],
      backgroundColor: ['#0075A4', '#D8D8D8'],
    },
  ],
};
const Piedata = {
  labels: ['Automatique', 'SA', 'Commentaire', 'Emojis'],
  datasets: [
    {
      label: 'Modes',
      data: [80, 56, 5, 17],
      backgroundColor: ['#772F67', '#9C2162', '#D03454', '#FF6F50'],
    },
  ],
};
const Ontologydata = {
  labels: ['Staging', 'Dramaturgy', 'Acting'],
  datasets: [
    {
      label: 'Ontologie',
      data: [22, 5, 3],
      backgroundColor: ['#034D44', '#077368', '#62BEB6'],
    },
  ],
};
const Doubledata = {
  labels: labels,
  datasets: [
    {
      label: 'automatique',
      data: [20, 12, 8, 40, 30, 35, 4, 15, 0, 0],
      maxBarThickness: 30,
      barPercentage: 0.5,
      backgroundColor: ['#D5255E'],
    },
    {
      label: 'déclaratif',
      data: [2, 11, 24, 50, 40, 3, 14, 5, 4, 9],
      maxBarThickness: 30,
      barPercentage: 0.5,
      backgroundColor: ['#0B9A8D'],
    },
  ],
};
const options = {
  responsive: false,
  maintainAspectRatio: false,
};

// const [chartData, setChartData] = useState<ChartData<'doughnut', number[], MyDataset>>();

// useEffect(() => {
//   calcOntologyType().then(dataset => {
//     // Assuming dataset has the structure you need for Chart.js
//     setChartData({
//       datasets: dataset
//     });
//   }).catch((error :string)=> {
//     // Handle errors
//     console.error('Error fetching data:', error);
//   });
// }, []);
interface Data {
  name: string;
  age: number;
  city: string;
}
export default withStyles(styles)(
  ({ project, classes, annotations }: Props) => {
    // const data = React.useMemo(
    //   () => [
    //     { name: 'John Doe', age: 30, city: 'New York' },
    //     { name: 'Jane Doe', age: 25, city: 'San Francisco' },
    //     { name: 'Bob Smith', age: 35, city: 'Los Angeles' },
    //     // Add more data as needed
    //   ],
    //   []
    // );

    // const columns = React.useMemo(
    //   () => [
    //     {
    //       Header: 'Name',
    //       accessor: 'name',
    //       Filter: DefaultColumnFilter, // Add a custom filter function
    //     },
    //     {
    //       Header: 'Age',
    //       accessor: 'age',
    //       Filter: DefaultColumnFilter,
    //     },
    //     {
    //       Header: 'City',
    //       accessor: 'city',
    //       Filter: DefaultColumnFilter,
    //     },
    //   ],
    //   []
    // );

    // const DefaultColumnFilter = ({ column: { filterValue, setFilter } }) => (
    //   <input
    //     value={filterValue || ''}
    //     onChange={(e) => setFilter(e.target.value)}
    //     placeholder={`Search ${column.Header.toLowerCase()}`}
    //   />
    // );

    // const {
    //   getTableProps,
    //   getTableBodyProps,
    //   headerGroups,
    //   rows,
    //   prepareRow,
    //   state,
    // } = useTable(
    //   { columns, data },
    //   useFilters, // Add the useFilters hook
    //   usePagination
    // );

    return (
      <div className={classes.root}>
        {project && (
          <div>
            <Typography
              style={{
                margin: '40px',
                fontStyle: 'revert-layer',
                color: '#0B9A8D',
              }}
              align="center"
              variant="h3"
              gutterBottom={true}
            >
              Résultat des annotations de la pièce {project.title}
            </Typography>
          </div>
        )}

        <div className="app">
          <div className="container">
            <h2>Fréquence de chaque émotion</h2>
            <Bar data={calcEmotion(annotations)} className="card" />
          </div>
          <div className="container">
            <h2>
              Fréquence de chaque émotion en mode déclaratif et automatique
            </h2>
            <Bar data={calcEmotionByMode(annotations)} className="card" />
          </div>
          <div className="spacer"></div>

          <div className="pieContainer">
            <h2>Résultats des jugements</h2>
            <Doughnut data={calcJugement(annotations)} className="card" />
          </div>
          <div className="pieContainer">
            <h2>Résultats des annotations sémantiques</h2>
            <Doughnut data={Ontologydata} className="card" />
          </div>
          <div className="pieContainer">
            <h2>Les types des annotations</h2>
            <Pie data={calcAnnotationType(annotations)} className="card" />
          </div>
        </div>
        <div className="spacer"></div>

        {/* <div>
        <h2>Data Table with Filters</h2>
        <table {...getTableProps()} style={{ width: '100%' }}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div> */}
      </div>
    );
  }
);
