import { useEffect, useState, useRef, CSSProperties } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'types/StateTypes';
import AnnotationService from 'services/AnnotationService';

interface EmotionsPaletteProps {
  projectId: string;
  position: number;
  semiAutoDetect: boolean;
  semiAutoDetectMe: boolean;
  emotion?: string;
  emotionDetected: string;
  onEmotionChange(emotion: string | undefined): void;

}

interface Emoji {
  label: string;
  value: string;
}

interface EmotionCount {
  emotion: string;
  autoDetect: boolean;
  emotion_count: string;
}

const emojisArray: Emoji[] = [
  // {
  //   label: 'Emotions & Judgements',
  //   value: '',
  // },
  {
    label: '👍',
    value: 'iLike',
  },
  {
    label: '👎',
    value: 'iDontLike',
  },
  {
    label: '😐',
    value: 'Neutral',
  },
  {
    label: '😮',
    value: 'surprised',
  },
  {
    label: '😄',
    value: 'Smile',
  },
  {
    label: '😂',
    value: 'Laugh',
  },
  {
    label: '😠',
    value: 'angry',
  },
  {
    label: '☹️',
    value: 'sad',
  },
  {
    label: '🥹',
    value: 'Empathy',
  },
  {
    label: '😨',
    value: 'fearful',
  },
  {
    label: '🤮',
    value: 'disgusted',
  },
  {
    label: '🤔',
    value: 'ItsStrange',
  },
];

const OFFSET = 10;

const EmotionsPalette = ({
  position,
  projectId,
  semiAutoDetect,
  semiAutoDetectMe,
  emotion,
  emotionDetected,
  onEmotionChange,
}: EmotionsPaletteProps) => {
  const [hoveredComponent, setHoveredComponent] = useState<number | null>(null);
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const captureIntervalRef = useRef<number | null>(null);
  const startPositionRef = useRef<number>(0);

  const mapEmotionDetectedToEmojis = (emotionDetected: string): Emoji[] => {
    const emojis = (() => {
      switch (emotionDetected) {
        case 'neutral':
          return [emojisArray.find((emoji) => emoji.value === 'Neutral')];
        case 'happy':
          return [
            emojisArray.find((emoji) => emoji.value === 'Laugh'),
            emojisArray.find((emoji) => emoji.value === 'Smile'),
          ];
        case 'surprised':
          return [
            emojisArray.find((emoji) => emoji.value === 'Surprise'),
            emojisArray.find((emoji) => emoji.value === 'Fear'),
          ];
        case 'fearful':
          return [
            emojisArray.find((emoji) => emoji.value === 'Surprise'),
            emojisArray.find((emoji) => emoji.value === 'Fear'),
          ];
        case 'angry':
          return [
            emojisArray.find((emoji) => emoji.value === 'Angry'),
            emojisArray.find((emoji) => emoji.value === 'Sad'),
            emojisArray.find((emoji) => emoji.value === 'Disgust'),
          ];
        case 'disgusted':
          return [
            emojisArray.find((emoji) => emoji.value === 'Angry'),
            emojisArray.find((emoji) => emoji.value === 'Sad'),
            emojisArray.find((emoji) => emoji.value === 'Disgust'),
          ];
        case 'sad':
          return [
            emojisArray.find((emoji) => emoji.value === 'Angry'),
            emojisArray.find((emoji) => emoji.value === 'Sad'),
            emojisArray.find((emoji) => emoji.value === 'Disgust'),
          ];
        default:
          return [emojisArray.find((emoji) => emoji.value === 'Neutral')];
      }
    })().filter((item): item is Emoji => item !== undefined);

    return emojis;
  };

  const addMappedEmojis = (slots: number = 4, emojisMapped: Emoji[]) => {
    const prevEmojis = emojis.filter(
      (prevEmoji) =>
        !emojisMapped.some((emoji) => prevEmoji.value === emoji.value)
    );

    const availableSlots = slots - prevEmojis.length;

    if (emojisMapped.length <= availableSlots)
      setEmojis([...emojisMapped, ...prevEmojis]);
    else {
      setEmojis([
        ...emojisMapped,
        ...prevEmojis.slice(0, slots - emojisMapped.length),
      ]);
    }
  };

  useEffect(() => {
    startPositionRef.current = position;
  }, [position]);

  // Only Me
  useEffect(() => {
    if (semiAutoDetectMe) setEmojis([]);
  }, [semiAutoDetectMe]);

  useEffect(() => {
    if (semiAutoDetectMe) {
      const emojisMapped: Emoji[] = mapEmotionDetectedToEmojis(emotionDetected);
      if (emojisMapped.length) addMappedEmojis(4, emojisMapped);
    }
  }, [semiAutoDetectMe, emotionDetected, projectId]);

  useEffect(() => {
    const mapEmotionToEmoji = (emotions: EmotionCount[]): Emoji[] => {
      const mapCallback = (emotionCount: EmotionCount): any => {
        if (emotionCount.autoDetect)
          return mapEmotionDetectedToEmojis(emotionCount.emotion);
        else
          return [
            emojisArray.find((emoji) => emoji.value === emotionCount.emotion),
          ];
      };

      const emojisFlattened = emotions.map(mapCallback).flat();

      const emojis = Array.from(
        new Set(emojisFlattened.map((obj) => obj.value))
      )
        .map((value) => emojisFlattened.find((obj) => obj.value === value))
        .filter((item): item is Emoji => item !== undefined);

      return emojis;
    };

    const updateEmojis = async () => {
      try {
        const emotions: EmotionCount[] = await AnnotationService.getTopEmotions(
          projectId,
          {
            startTime:
              startPositionRef.current - 4 >= 0
                ? startPositionRef.current - 4
                : 0,
            offset: OFFSET + 4,
            limit: 4,
          }
        );

        const emotionsMapped: Emoji[] = mapEmotionToEmoji(emotions);
        const iLike={
          label: '👍',
          value: 'iLike',
        }
        const iDontLike=
        {
          label: '👎',
          value: 'iDontLike',
        }
        console.log('Semi Auto Mapped Emotions ', emotionsMapped);
        
        if (!emotionsMapped.length) {
          const neutralEmoji = emojisArray.find(
            (emoji) => emoji.value === 'Neutral'
          );

          if (neutralEmoji) emotionsMapped.push(neutralEmoji);
        }
        if(!((emotionsMapped.find(emotion=> emotion.value===iDontLike.value)) ) ){
          
          emotionsMapped.unshift(iDontLike)
          setEmojis(emotionsMapped);
        }
        if(!(emotionsMapped.find(emotion=> emotion.value===iLike.value))){
          emotionsMapped.unshift(iLike)
          setEmojis(emotionsMapped);

        }


       
      } catch (e) {
        console.log(e);
      }
    };

    // All users's emotions
    if (semiAutoDetect) {
      updateEmojis();
      captureIntervalRef.current = window.setInterval(
        updateEmojis,
        OFFSET * 1000
      );

      // No Detection
    } else if (!semiAutoDetect && !semiAutoDetectMe) setEmojis(emojisArray);

    return () => {
      clearInterval(captureIntervalRef.current as number);
    };
  }, [semiAutoDetect, semiAutoDetectMe, projectId]);

  const handleHover = (index: number) => {
    setHoveredComponent(index);
  };

  const handleHoverLeave = () => {
    setHoveredComponent(null);
  };

  const containerStyle: CSSProperties = {
    // backgroundColor: '#f3f3f3',
    // backgroundColor: '#708090',
    // backgroundColor: '#36454F',
    backgroundColor: '#333333',
    borderRadius: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '10px 0 0 0',
    padding: '0 5px',
    height: '2.5rem',
    width: '100%',
  };

  const elementStyle: CSSProperties = {
    display: 'inline-block',
    fontSize: '1.3rem',
    borderRadius: '50%',
    margin: '1px 2px',
    padding: '2px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform .3s',
    boxShadow:
      'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
  };

  return (
    <div style={containerStyle}>
      {emojis.map((emoji, index) => (
        <div
          key={index}
          onMouseEnter={() => handleHover(index)}
          onMouseLeave={handleHoverLeave}
          title={emoji.value}
          style={{
            ...elementStyle,
            transform:
              hoveredComponent === index ? 'translateY(-20%) scale(2)' : '',
            backgroundColor: emotion === emoji.value ? 'black' : 'transparent',
          }}
          onClick={(e) => {
            if (emoji.value !== emotion) onEmotionChange(emoji.value);
            else onEmotionChange(undefined);
          }}
        >
          {emoji.label}
        </div>
      ))}
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  semiAutoDetect: state.project.player.semiAutoDetection_mode,
  semiAutoDetectMe: state.project.player.semiAutoDetectionMe_mode,
  // @ts-ignore
  projectId: state.project.details.project.id,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(EmotionsPalette);
