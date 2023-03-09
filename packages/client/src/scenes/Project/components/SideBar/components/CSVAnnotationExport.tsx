import * as React from 'react';
import ButtonProgress from 'components/ButtonProgress';
import { ProjectGraphRecord, AnnotationRecord } from '@celluloid/types';


interface Props  {
    annotations: AnnotationRecord[];
    project: ProjectGraphRecord;
    buttonName: string;
    
  } 
export default (
      (
        class extends React.Component<Props> {
          constructor(props:any){
            super(props)
            this.state={
              dat : 'projectName, startTime, stopTime, user, sequecing, text, ontology,subConcept1,subConcept2,subConcept3' + '\n'
            }
                    
          }
         
          render() {

           const {annotations, project } = this.props;
          
           return (
            <ButtonProgress
                variant="contained"
                color="primary"
                size="small"
                onClick={async() => {
                 // const p = Promise.resolve('Hello World');
                  let data = 'projectName, startTime, stopTime, user, text, ontology,subConcept1,subConcept2,subConcept3, relationConcept' + '\n';
              
                  let subConcept1= ''
                  let subConcept2= ''
                  let subConcept3= ''
                  let relationConcept=''
                  await Promise.all(annotations.map(async (item) => {
                  //  let res= await getConcept(item.id)
                  //  console.log('list des concept',res)
                  //  let ontology=res[0]
                  //  if(ontology=== undefined|| ontology===''){
                  //    ontology=''
                  //  }else{
                  //     let superClasses=res[1]
                   
                  //     for(let i=0;i< superClasses.length; i++){
                  //       subConcept1= superClasses[0]
                  //       if(subConcept1=== undefined){
                  //         subConcept1=''
                  //       }
                  //       subConcept2= superClasses[1]
                  //       if(subConcept2=== undefined){
                  //         subConcept2=''
                  //       }
                  //       subConcept3= superClasses[2]
                  //       if(subConcept3=== undefined){
                  //         subConcept3=''
                  //       }
                  //     }
                  //     relationConcept=res[2]
                     
                  //     if(relationConcept=== undefined|| relationConcept===''){
                  //       relationConcept=''
                  //     }
                  //     console.log('relation concept:', relationConcept)
              
                  //  }
                   let ontologyData =  'ontology';
                   let textData = item.text !== '' ? item.text : 'none';
                   data += project.shareName + '    , ' + item.startTime + '   , ' + item.stopTime 
                   + '     , ' + item.user.username + '   , ' + textData 
                   + '   , ' + ontologyData + '   , ' + subConcept1
                   + '    , '+ subConcept2 +'    , ' + subConcept3+'    , ' + relationConcept+'\n'; 
                    // this.setState({dat:data})
               
                    this.setState({dat:data})
                    return this.state
                    } ))
                  let dublinCore='-------------------------------------------------------------Metadata-----------------------------------------------------------\n';
             
                  let resultat=dublinCore+Object.values(this.state)
               
                  var blob = new Blob([resultat.toString()], {type: 'text/csv'});
                  if ((window.navigator as any).msSaveOrOpenBlob) {
                      (window.navigator as any).msSaveBlob(blob, 'annotations_CSV_' + project.shareName);
                  } else {
                      var elem = window.document.createElement('a');
                      elem.href = window.URL.createObjectURL(blob);
                      elem.download = 'annotations_' + project.shareName + '.csv';        
                      document.body.appendChild(elem);
                      elem.click();        
                      document.body.removeChild(elem);
                    }
                  }
                }
            >
               {this.props.buttonName} CSV
            </ButtonProgress>
                );
          }
        
      }));
  
