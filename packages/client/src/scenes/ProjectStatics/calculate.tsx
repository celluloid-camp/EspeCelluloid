import { AnnotationRecord } from '@celluloid/types';
import { getConcept } from '../Project/scenes/Video/api/Annotation';
import AnnotationService from 'services/AnnotationService';

export function calcEmotion(annotations?: AnnotationRecord[]) {
  const labels = [
    'Happy',
    'Laugh',
    'Smile',
    'Sad',
    'Surprise',
    'Angry',
    'Disgusted',
    'Fear',
    'Empathy',
    'ItsStrange',
  ];
  let happy = 0;
  let laugh = 0;
  let smile = 0;
  let sad = 0;
  let surprise = 0;
  let angry = 0;
  let disgusted = 0;
  let fearful = 0;
  let empathy = 0;
  let itsStrange = 0;
  annotations?.map((annotation: AnnotationRecord) => {
    if (annotation.emotion) {
      if (annotation.emotion === 'happy') {
        happy++;
      } else if (annotation.emotion === 'laugh') {
        laugh++;
      } else if (annotation.emotion === 'smile') {
        smile++;
      } else if (annotation.emotion === 'sad') {
        sad++;
      } else if (annotation.emotion === 'surprised') {
        surprise++;
      } else if (annotation.emotion === 'angry') {
        angry++;
      } else if (annotation.emotion === 'disgusted') {
        disgusted++;
      } else if (annotation.emotion === 'fearful') {
        fearful++;
      } else if (annotation.emotion === 'empathy') {
        empathy++;
      } else if (annotation.emotion === 'itsStrange') {
        itsStrange++;
      }
    }
  });

  let data = {
    labels: labels,
    datasets: [
      {
        label: 'nombre de réaction',
        data: [
          happy,
          laugh,
          smile,
          sad,
          surprise,
          angry,
          disgusted,
          fearful,
          empathy,
          itsStrange,
        ],
        maxBarThickness: 30,
        backgroundColor: ['#0B9A8D'],
      },
    ],
  };
  return data;
}
export function calcEmotionByMode(annotations?: AnnotationRecord[]) {
  const labels = [
    'Happy',
    'Laugh',
    'Smile',
    'Sad',
    'Surprise',
    'Angry',
    'Disgusted',
    'Fear',
    'Empathy',
    'ItsStrange',
  ];
  let happy = 0;
  let laugh = 0;
  let smile = 0;
  let sad = 0;
  let surprise = 0;
  let angry = 0;
  let disgusted = 0;
  let fearful = 0;
  let empathy = 0;
  let itsStrange = 0;
  let happyAut = 0;
  let laughAut = 0;
  let smileAut = 0;
  let sadAut = 0;
  let surpriseAut = 0;
  let angryAut = 0;
  let disgustedAut = 0;
  let fearfulAut = 0;
  let empathyAut = 0;
  let itsStrangeAut = 0;
  annotations?.map((annotation: AnnotationRecord) => {
    if (annotation.emotion) {
      if (annotation.emotion === 'happy') {
        if (annotation.autoDetect || annotation.semiAutoAnnotation) {
          happyAut++;
        } else {
          happy++;
        }
      } else if (annotation.emotion === 'laugh') {
        if (annotation.autoDetect || annotation.semiAutoAnnotation) {
          laughAut++;
        } else {
          laugh++;
        }
      } else if (annotation.emotion === 'smile') {
        if (annotation.autoDetect || annotation.semiAutoAnnotation) {
          smileAut++;
        } else {
          smile++;
        }
      } else if (annotation.emotion === 'sad') {
        if (annotation.autoDetect || annotation.semiAutoAnnotation) {
          sadAut++;
        } else {
          sad++;
        }
      } else if (annotation.emotion === 'surprised') {
        if (annotation.autoDetect || annotation.semiAutoAnnotation) {
          surpriseAut++;
        } else {
          surprise++;
        }
      } else if (annotation.emotion === 'angry') {
        if (annotation.autoDetect || annotation.semiAutoAnnotation) {
          angryAut++;
        } else {
          angry++;
        }
      } else if (annotation.emotion === 'disgusted') {
        if (annotation.autoDetect || annotation.semiAutoAnnotation) {
          disgustedAut++;
        } else {
          disgusted++;
        }
      } else if (annotation.emotion === 'fearful') {
        if (annotation.autoDetect || annotation.semiAutoAnnotation) {
          fearfulAut++;
        } else {
          fearful++;
        }
      } else if (annotation.emotion === 'empathy') {
        if (annotation.autoDetect || annotation.semiAutoAnnotation) {
          empathyAut++;
        } else {
          empathy++;
        }
      } else if (annotation.emotion === 'itsStrange') {
        if (annotation.autoDetect || annotation.semiAutoAnnotation) {
          itsStrangeAut++;
        } else {
          itsStrange++;
        }
      }
    }
  });

  let data = {
    labels: labels,
    datasets: [
      {
        label: 'automatique',
        data: [
          happyAut,
          laughAut,
          smileAut,
          sadAut,
          surpriseAut,
          angryAut,
          disgustedAut,
          fearfulAut,
          empathyAut,
          itsStrangeAut,
        ],
        maxBarThickness: 30,
        barPercentage: 0.5,
        backgroundColor: ['#D5255E'],
      },
      {
        label: 'déclaratif',
        data: [
          happy,
          laugh,
          smile,
          sad,
          surprise,
          angry,
          disgusted,
          fearful,
          empathy,
          itsStrange,
        ],
        maxBarThickness: 30,
        barPercentage: 0.5,
        backgroundColor: ['#0B9A8D'],
      },
    ],
  };
  return data;
}

export function calcAnnotationType(annotations?: AnnotationRecord[]) {
  let automatique = 0;
  let sa = 0;
  let comment = 0;
  let emoji = 0;

  annotations?.map((annotation: AnnotationRecord) => {
    if (annotation.text) {
      comment++;
    } else if (annotation.autoDetect) {
      automatique++;
    } else if (annotation.semiAutoAnnotation) {
      sa++;
    } else if (
      annotation.emotion !== null &&
      !annotation.autoDetect &&
      !annotation.semiAutoAnnotation
    ) {
      emoji++;
    }
  });

  const data = {
    labels: ['Automatique', 'SA', 'Commentaire', 'Emojis'],
    datasets: [
      {
        label: 'Modes',
        data: [automatique, sa, comment, emoji],
        backgroundColor: ['#772F67', '#9C2162', '#D03454', '#FF6F50'],
      },
    ],
  };
  return data;
}

export function calcJugement(annotations?: AnnotationRecord[]) {
  let iLike = 0;
  let iDontLike = 0;
  let itsStrange = 0;

  annotations?.map((annotation: AnnotationRecord) => {
    if (annotation.emotion) {
      if (annotation.emotion === 'iLike') {
        iLike++;
      } else if (annotation.emotion === 'iDontLike') {
        iDontLike++;
      } else if (annotation.emotion === 'itsStrange') {
        itsStrange++;
        console.log('nb stag ', itsStrange);
      }
    }
  });
  let data = {
    labels: ['iLike', 'iDontLike', 'itsStrange'],
    datasets: [
      {
        label: 'Jugements',
        data: [iLike, iDontLike, itsStrange],
        backgroundColor: ['#87ccdb', '#58508d', '#fd878a'],
      },
    ],
  };
  return data;
}

export async function calcOntologyType(projectid?: string) {
  let staging = 0;
  let acting = 0;
  let dramaturgy = 0;
  const data = {
    labels: ['Staging', 'Dramaturgy', 'Acting'],
    datasets: [
      {
        label: 'Ontologie',
        data: [staging, dramaturgy, acting],
        backgroundColor: ['#034D44', '#077368', '#62BEB6'],
      },
    ],
  };
  if (projectid) {
    let annotations: AnnotationRecord[] = await AnnotationService.list(
      projectid
    );
    await Promise.all(
      annotations.map(async (item: AnnotationRecord) => {
        // console.log('item ', item.user.username);
        let res = await getConcept(item.id);
        //  console.log('list des concept',res)
        let ontology = res[0];
        console.log('print ontology ', ontology);
        if (ontology === undefined || ontology === '') {
          ontology = '';
          //  console.log('dkhlna khawti')
        } else {
          let superClasses = res[1];
          console.log(' item ', superClasses);
        }
        return data;
      })
    )
      .then((data) => {
        return data;
      })
      .catch((error) => {
        // Handle any errors that occurred during fetching the data
        console.error('Error fetching data:', error);
      });
  } else {
    return data;
  }
}
