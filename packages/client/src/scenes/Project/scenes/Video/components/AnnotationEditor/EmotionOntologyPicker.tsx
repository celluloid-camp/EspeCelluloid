import React from 'react';
import getFirstConcepts, {
  getSubConcepts,
  getRelation,
} from '../../api/Concept';
import addAnnotation from '../../api/Annotation';
import { UserRecord } from '@celluloid/types';
import EmotionsPalette from './EmotionsPalette';
import TransparentInput from '../TransparentInput';
import { useTranslation } from 'react-i18next';
interface Props {
  perf: boolean;
  position: number;
  emotion?: string;
  emotionDetected: string;
  text:string;
  error?: string;
  onTextChange(text: string):void;
  onEmotionChange(emotion: string): void;

}

interface State {
  text: string;
  error: string;

  concept: string;
  concept1: string;
  concept2: string;
  concept3: string;
  concept4: string;
  concept5: string;
  concept6: string;
  option1: any;
  option2: any;
  option3: any;
  option4: any;
  option5: any;
  option6: any;
}

const ontologyStyles: React.CSSProperties = {
  position: 'relative',
  maxWidth: '30px',
  fontFamily: 'sans-serif',
  fontSize: '20px',
  // color: 'inherit',
  fontWeight: 'bold',
  width: '30px',
  display: 'inline',
  paddingLeft: '10px',
  color:'#333',
  backgroundColor: 'transparent',
};



let globalConcept = 'concept';
let firstConcept = globalConcept;
let secondConcept = 'concept';
let thirdConcept = 'concept';
let fourthConcept = 'concept';
let fiveConcept = 'concept';
let sixConcept = 'concept';
const options = getFirstConcepts(globalConcept);
console.log('Options, ', options);

export function PostAnnotation(
  user: UserRecord,
  startTime: number,
  stopTime: number,
  text: String,
  projectId: string,
  annotationId: any
) {
  const relation = getRelation(firstConcept);

  console.log(
    ' les 3 derniers concept',
    fourthConcept,
    sixConcept,
    fiveConcept,
    globalConcept
  );

  const annotationData = {
    projectId: projectId,
    userId: user.id,
    commentaire: text,
    stopTime: stopTime,
    startTime: startTime,
    userName: user.username,
    annotationId: annotationId,

    objet: [
      firstConcept,
      secondConcept,
      thirdConcept,
      fourthConcept,
      fiveConcept,
      sixConcept,
      globalConcept,
    ],
    relation: relation,
  };
  if (firstConcept !== 'Annotation Libre') {
    addAnnotation(annotationData);
  }
}

export default class EmotionOntologyPicker extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      text:'',
      error:'',
      concept: globalConcept,
      concept1: 'concept 2',
      concept2: 'concept 3',
      concept3: 'concept 4',
      concept4: fourthConcept,
      concept5: fiveConcept,
      concept6: sixConcept,
      option1: [],
      option2: [],
      option3: [],
      option4: [],
      option5: [],
      option6: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);
    this.handleChange4 = this.handleChange4.bind(this);
    this.handleChange5 = this.handleChange5.bind(this);
    this.handleChange6 = this.handleChange6.bind(this);
   
    // this.handleEmoji = this.handleEmoji.bind(this);
  }

  handleChange(e: any) {
    this.setState({ concept: e.target.value });
    const conc1 = getSubConcepts(e.target.value);
    this.setState({ option1: conc1 });
    globalConcept = e.target.value;
    firstConcept = e.target.value;
    secondConcept = e.target.value;
    thirdConcept = e.target.value;
    fourthConcept = e.target.value;
    fiveConcept = e.target.value;
    sixConcept = e.target.value;
    console.log(' button 1', globalConcept);
  }
 

  handleChange1(e: any) {
    this.setState({ concept1: e.target.value });
    const conc1 = getSubConcepts(e.target.value);
    this.setState({ option2: conc1 });
    secondConcept = e.target.value;
    thirdConcept = e.target.value;
    fourthConcept = e.target.value;
    fiveConcept = e.target.value;
    sixConcept = e.target.value;
    globalConcept = e.target.value;
    console.log(' button 2', globalConcept);
  }
  handleChange2(e: any) {
    this.setState({ concept2: e.target.value });
    const conc1 = getSubConcepts(e.target.value);
    this.setState({ option3: conc1 });
    thirdConcept = e.target.value;
    fourthConcept = e.target.value;
    fiveConcept = e.target.value;
    sixConcept = e.target.value;
    globalConcept = e.target.value;
    console.log(' button 3', globalConcept);
  }
  handleChange3(e: any) {
    this.setState({ concept3: e.target.value });
    const conc1 = getSubConcepts(e.target.value);
    this.setState({ option4: conc1 });
    fourthConcept = e.target.value;
    fiveConcept = e.target.value;
    sixConcept = e.target.value;
    globalConcept = e.target.value;
    console.log(' button 4', globalConcept);
  }
  handleChange4(e: any) {
    this.setState({ concept4: e.target.value });
    const conc1 = getSubConcepts(e.target.value);
    this.setState({ option5: conc1 });
    fiveConcept = e.target.value;
    sixConcept = e.target.value;
    globalConcept = e.target.value;
    console.log(' button 5', globalConcept);
  }
  handleChange5(e: any) {
    this.setState({ concept5: e.target.value });
    const conc1 = getSubConcepts(e.target.value);
    this.setState({ option6: conc1 });
    sixConcept = e.target.value;
    globalConcept = e.target.value;
    console.log(' button 6', globalConcept);
  }
  handleChange6(e: any) {
    this.setState({ concept6: e.target.value });
    const conc1 = getSubConcepts(e.target.value);
    this.setState({ option6: conc1 });
    globalConcept = e.target.value;
    console.log(' button 6', globalConcept);
  }

  render() {
    const { onEmotionChange, position } = this.props;
    const { onTextChange, text } = this.props;
    // const { t } = useTranslation();
    return (
      <div>
        <div style={ontologyStyles}>
          {!this.props.perf ? (
            <>
              <select value={this.state.concept} onChange={this.handleChange}>
                {options.map((option) => (
                  <option value={option.concept}>{option.concept}</option>
                ))}
              </select>
              {/* <select value={this.state.concept1} onChange={this.handleChange1}>
            {this.state.option1.map((option) => (
              <option value={option.concept}>{option.concept}</option>
            ))}
          </select>
          <select value={this.state.concept2} onChange={this.handleChange2}>
            {this.state.option2.map((option) => (
              <option value={option.concept}>{option.concept}</option>
            ))}
          </select>
          <select value={this.state.concept3} onChange={this.handleChange3}>
            {this.state.option3.map((option) => (
              <option value={option.concept}>{option.concept}</option>
            ))}
          </select>
          <select value={this.state.concept4} onChange={this.handleChange4}>
            {this.state.option4.map((option) => (
              <option value={option.concept}>{option.concept}</option>
            ))}
          </select>
          <select value={this.state.concept5} onChange={this.handleChange5}>
            {this.state.option5.map((option) => (
              <option value={option.concept}>{option.concept}</option>
            ))}
          </select>
          <select value={this.state.concept6} onChange={this.handleChange6}>
            {this.state.option6.map((option) => (
              <option value={option.concept}>{option.concept}</option>
            ))}
          </select> */}
            </>
          ) : (
            <></>
          )}
           </div>
        <div style={{ display: 'flex' }}>
        <div style={{ width: '60%', marginRight: '10px', flex:1}}>
          <TransparentInput
            text={this.props.text}
            error={this.props.error}
            onChange={onTextChange}
            placeholder={'put your comment'}
           
          />
         </div>
         <div  style={{ width: '40%', flex:1}}>
          <EmotionsPalette
            emotion={this.props.emotion}
            onEmotionChange={onEmotionChange}
            position={position}
            emotionDetected={this.props.emotionDetected}
          />
          </div>
        </div>
       
      </div>
    );
  }
}
