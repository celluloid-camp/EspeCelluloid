
import { AnnotationRecord } from '@celluloid/types';




export function calcEmotion( annotations?:AnnotationRecord [] ){
    const labels=['Happy', 'Laugh', 'Smile', 'Sad', 'Surprise', 'Angry', 'Disgusted', 'Fearful', 'Empathy', 'ItsStrange'] ;
    let happy=0;
    let laugh=0;
    let smile=0;
    let sad=0;
    let surprise=0;
    let angry=0;
    let disgusted=0;
    let fearful=0;
    let empathy=0;
    let itsStrange=0;
    annotations?.map( (annotation: AnnotationRecord) => {
      if (annotation.emotion){
       
        if(annotation.emotion==='happy'){
          happy++
        }else if(annotation.emotion==='Laugh'){
           laugh++
        }
        else if(annotation.emotion==='smile'){
          smile++
       }
       else if(annotation.emotion==='sad'){
        sad++
       } else if(annotation.emotion==='surprised'){
         surprise++
      } else if(annotation.emotion==='angry'){
      angry++
      }
      else if(annotation.emotion==='Disgust'){
        disgusted++
        }
      else if(annotation.emotion==='fearful'){
          fearful++
          }
      else if(annotation.emotion==='Empathy'){
            empathy++
            }
       else if(annotation.emotion==='ItsStrange'){
              itsStrange++
              }
      }
    
    })


    let data= {
      labels: labels,
      datasets: [{
         label: "nombre de réaction",
         data: [happy,laugh, smile, sad,surprise, angry,disgusted,fearful, empathy, itsStrange],
         maxBarThickness: 30,
         backgroundColor:['#0B9A8D']
     
      }],
    }
    return data
}

export function calcAnnotationType( annotations?:AnnotationRecord [] ){
 
  let automatique=0;
  let sa=0;
  let comment=0;
  let emoji=0;

  annotations?.map( (annotation: AnnotationRecord) => {

      if(annotation.text){
        comment++
     }else if(annotation.autoDetect){
        automatique++
      }else if(annotation.semiAutoDetect){
         sa++
      }else if(annotation.emotion!==null && !annotation.autoDetect && !annotation.semiAutoDetect){
        emoji++
       }
  })


  const data= {
    labels: ['Automatique', 'SA','Commentaire','Emojis'],
    datasets: [{
       label: "Modes",
       data: [automatique, sa,comment,emoji],
       backgroundColor:['#772F67','#9C2162','#D03454','#FF6F50']
    }],
  }
  return data
}

export function calcJugement( annotations?:AnnotationRecord [] ){
 
  let iLike=0;
  let iDontLike=0;
 

  annotations?.map( (annotation: AnnotationRecord) => {
    if (annotation.emotion){
     
      if(annotation.emotion==='iLike'){
        iLike++
      }else if(annotation.emotion==='iDontLike'){
         iDontLike++
      }
    
    }
  
  })
  const data= {
    labels: ['iLike', 'iDontLike'],
    datasets: [{
       label: "Jugements",
       data: [iLike, iDontLike],
       backgroundColor:['#0075A4','#D8D8D8']
    }],
  }
  return data
}