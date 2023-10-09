import { useEffect, useState, useRef, CSSProperties } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'types/StateTypes';
import AnnotationService from 'services/AnnotationService';

interface EmotionsPaletteProps {
  projectId: string;
  position: number;
  semiAutoDetect: boolean;
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
    label: '😮',
    value: 'Surprise',
  },
  {
    label: '😀',
    value: 'Smile',
  },
  {
    label: '😂',
    value: 'Laugh',
  },
  {
    label: '🤣',
    value: 'Hilarity',
  },
  {
    label: '😠',
    value: 'Tiredness',
  },

  {
    label: '🤯',
    value: 'Annoyance',
  },
  {
    label: '🥰',
    value: 'Empathy',
  },
  {
    label: '😍',
    value: 'iLove',
  },
  {
    label: '😨',
    value: 'Fear',
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
  emotion,
  emotionDetected,
  onEmotionChange,
}: EmotionsPaletteProps) => {
  const [hoveredComponent, setHoveredComponent] = useState<number | null>(null);
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const captureIntervalRef = useRef<number | null>(null);
  const startPositionRef = useRef<number>(0);

  useEffect(() => {
    startPositionRef.current = position;
  }, [position]);

  useEffect(() => {
    const mapEmotionDetectedToEmoji = (emotion: string) => {
      switch (emotion) {
        case 'neutral':
          return emojisArray.find((emoji) => emoji.value === 'Smile');
        case 'happy':
          return emojisArray.find((emoji) => emoji.value === 'Laugh');
        case 'surprised':
          return emojisArray.find((emoji) => emoji.value === 'Surprise');
        case 'fearful':
          return emojisArray.find((emoji) => emoji.value === 'Fear');
        default:
          return emojisArray.find((emoji) => emoji.value === 'Smile');
      }
    };

    if (semiAutoDetect) {
      const emojiMapped = mapEmotionDetectedToEmoji(emotionDetected);

      if (emojiMapped)
        setEmojis((prev) => [
          emojiMapped,
          ...prev.filter((emoji) => emoji.value !== emojiMapped.value),
        ]);
    }
  }, [emotionDetected, semiAutoDetect]);

  useEffect(() => {
    const mapEmotionToEmoji = (emotions: EmotionCount[]): Emoji[] => {
      const mapCallback = (emotionCount: EmotionCount): any => {
        if (emotionCount.autoDetect) {
          switch (emotionCount.emotion) {
            case 'neutral':
              return emojisArray.find((emoji) => emoji.value === 'Smile');
            case 'happy':
              return emojisArray.find((emoji) => emoji.value === 'Laugh');
            case 'surprised':
              return emojisArray.find((emoji) => emoji.value === 'Surprise');
            case 'fearful':
              return emojisArray.find((emoji) => emoji.value === 'Fear');
            case 'angry':
              break;
            case 'disgusted':
              break;
            case 'sad':
              break;
          }
        } else
          return emojisArray.find(
            (emoji) => emoji.value === emotionCount.emotion
          );
      };

      return emotions.map(mapCallback).filter((item) => item !== undefined);
    };

    const updateEmojis = async () => {
      try {
        const emotions: EmotionCount[] = await AnnotationService.getTopEmotions(
          projectId,
          {
            startTime: startPositionRef.current,
            offset: OFFSET,
            limit: 4,
          }
        );

        const emotionsMapped: Emoji[] = mapEmotionToEmoji(emotions);

        if (!emotionsMapped.length) {
          emotionsMapped.push(emojisArray[3]);
        }

        setEmojis(emotionsMapped);
      } catch (e) {
        console.log(e);
      }
    };

    if (semiAutoDetect) {
      updateEmojis();
      captureIntervalRef.current = window.setInterval(
        updateEmojis,
        OFFSET * 1000
      );
    } else setEmojis(emojisArray);

    return () => {
      clearInterval(captureIntervalRef.current as number);
    };
  }, [semiAutoDetect, projectId]);

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
    fontSize: '1.2rem',
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
  // @ts-ignore
  projectId: state.project.details.project.id,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(EmotionsPalette);
