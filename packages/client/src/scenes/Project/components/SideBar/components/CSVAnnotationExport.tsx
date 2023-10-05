import * as React from 'react';
import ButtonProgress from 'components/ButtonProgress';
import { ProjectGraphRecord, AnnotationRecord } from '@celluloid/types';
import AnnotationService from 'services/AnnotationService';

import { getConcept } from '../../../scenes/Video/api/Annotation';

interface Props {
  annotations: AnnotationRecord[];
  project: ProjectGraphRecord;
  buttonName: string;
}

// import React from 'react'

// const CSVAnnotationExport = () => {
//   return (
//     <div>CSVAnnotationExport</div>
//   )
// }

// export default CSVAnnotationExport;

interface State {
  loading: boolean;
  dat: any;
}

export default (class extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      dat:
        'projectName, startTime, stopTime, user, sequecing, text, ontology,subConcept1,subConcept2,subConcept3' +
        '\n',
    };
  }

  render() {
    const { project } = this.props;

    return (
      <ButtonProgress
        variant="contained"
        color="primary"
        size="small"
        loading={this.state.loading}
        onClick={async () => {
          // const p = Promise.resolve('Hello World');
          this.setState((prevState) => {
            console.log('updated when clicked to ', {
              ...prevState,
              loading: true,
            });
            return { ...prevState, loading: true };
          });
          let data =
            'projectName, startTime, stopTime, user, text, emotion, autoDetect, semiAutoDetect, ontology,subConcept1,subConcept2,subConcept3, relationConcept' +
            '\n';
          //  console.log('annotations: ', annotations.)
          let subConcept1 = '';
          let subConcept2 = '';
          let subConcept3 = '';
          let relationConcept = '';
          let annotations: AnnotationRecord[] = await AnnotationService.list(
            project.id,
            { autoDetect: true }
          );

          await Promise.all(
            annotations.map(async (item: AnnotationRecord) => {
              // console.log('item ', item.user.username);
              let res = await getConcept(item.id);
              //  console.log('list des concept',res)
              let ontology = res[0];
              //  console.log('print ontology ',ontology, item.text)
              if (ontology === undefined || ontology === '') {
                ontology = '';
                //  console.log('dkhlna khawti')
              } else {
                let superClasses = res[1];

                for (let i = 0; i < superClasses.length; i++) {
                  subConcept1 = superClasses[0];
                  if (subConcept1 === undefined) {
                    subConcept1 = '';
                  }
                  subConcept2 = superClasses[1];
                  if (subConcept2 === undefined) {
                    subConcept2 = '';
                  }
                  subConcept3 = superClasses[2];
                  if (subConcept3 === undefined) {
                    subConcept3 = '';
                  }
                }
                relationConcept = res[2];

                if (relationConcept === undefined || relationConcept === '') {
                  relationConcept = '';
                }
              }
              let ontologyData = ontology;
              let textData = item.text !== '' ? item.text : 'none';
              data +=
                project.shareName +
                '    , ' +
                item.startTime +
                '   , ' +
                item.stopTime +
                '     , ' +
                item.user.username +
                '   , ' +
                textData +
                ' , ' +
                item.emotion +
                ' , ' +
                item.autoDetect +
                ' , ' +
                item.semiAutoDetect +
                '   , ' +
                ontologyData +
                '   , ' +
                subConcept1 +
                '    , ' +
                subConcept2 +
                '    , ' +
                subConcept3 +
                '    , ' +
                relationConcept +
                '\n';

              this.setState((prevState) => ({ ...prevState, dat: data }));

              return this.state;
            })
          );
          let dublinCore =
            '-------------------------------------------------------------Metadata-----------------------------------------------------------\n';

          let resultat = dublinCore + Object.values({ dat: this.state.dat });

          var blob = new Blob([resultat.toString()], { type: 'text/csv' });
          if ((window.navigator as any).msSaveOrOpenBlob) {
            (window.navigator as any).msSaveBlob(
              blob,
              'annotations_CSV_' + project.shareName
            );
          } else {
            var elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(blob);
            elem.download = 'annotations_' + project.shareName + '.csv';
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
          }

          this.setState((prevState) => {
            console.log('updated when finished to ', {
              ...prevState,
              loading: false,
            });
            return { ...prevState, loading: false };
          });
        }}
      >
        {this.props.buttonName} CSV
      </ButtonProgress>
    );
  }
});
