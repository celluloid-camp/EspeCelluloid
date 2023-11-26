import { useEffect, useState, useRef, CSSProperties } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'types/StateTypes';
import AnnotationService from 'services/AnnotationService';

interface EmotionsPaletteProps {
  projectId: string;
  position: number;
  semiAutoAnnotation: boolean;
  semiAutoAnnotationMe: boolean;
  emotion?: string;
  emotionDetected: string;
  onEmotionChange(emotion: string | undefined): void;
}

interface Emoji {
  label: string;
  value: string;
}

interface EmotionRecommended {
  emotion: string;
  score: number;
}

const emojisArray: Emoji[] = [
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
    value: 'neutral',
  },
  {
    label: '😮',
    value: 'surprised',
  },
  {
    label: '😄',
    value: 'smile',
  },
  {
    label: '😂',
    value: 'laugh',
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
    value: 'empathy',
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
    value: 'itsStrange',
  },
];

const OFFSET = 10;

const EmotionsPalette = ({
  position,
  projectId,
  semiAutoAnnotation,
  semiAutoAnnotationMe,
  emotion,
  emotionDetected,
  onEmotionChange,
}: EmotionsPaletteProps) => {
  const [hoveredComponent, setHoveredComponent] = useState<number | null>(null);
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const captureIntervalRef = useRef<number | null>(null);
  const startPositionRef = useRef<number>(0);

  // const addMappedEmojis = (slots: number = 4, emojisMapped: Emoji[]) => {
  //   const initEmojis = [emojisArray[0], emojisArray[1]]; //Always add Like/Dislike

  //   let prevEmojis = emojis.filter(
  //     (prevEmoji) =>
  //       !emojisMapped.some((emoji) => prevEmoji.value === emoji.value) &&
  //       !initEmojis.some((emoji) => prevEmoji.value === emoji.value)
  //   );

  //   const availableSlots = slots - prevEmojis.length;

  //   if (emojisMapped.length > availableSlots)
  //     prevEmojis = prevEmojis.slice(0, slots - emojisMapped.length);

  //   setEmojis([...initEmojis, ...emojisMapped, ...prevEmojis]);
  // };

  // Only Me Detection
  // useEffect(() => {
  //   if (semiAutoAnnotationMe) setEmojis([]);
  // }, [semiAutoAnnotationMe]);

  // useEffect(() => {
  //   if (semiAutoAnnotationMe) {
  //     const emojisMapped: Emoji[] = mapEmotionDetectedToEmojis(emotionDetected);
  //     if (emojisMapped.length) addMappedEmojis(4, emojisMapped);
  //   }
  // }, [semiAutoAnnotationMe, emotionDetected, projectId]);

  // Update position ref
  useEffect(() => {
    startPositionRef.current = position;
  }, [position]);

  // Others Detection/No Detection
  useEffect(() => {
    const mapEmotionToEmojis = (emotionDetected: string): Emoji[] => {
      const emojis = (() => {
        switch (emotionDetected) {
          case 'neutral':
            return [emojisArray.find((emoji) => emoji.value === 'neutral')];
          case 'happy':
            return [
              emojisArray.find((emoji) => emoji.value === 'laugh'),
              emojisArray.find((emoji) => emoji.value === 'smile'),
            ];
          case 'surprised':
            return [
              emojisArray.find((emoji) => emoji.value === 'surprised'),
              emojisArray.find((emoji) => emoji.value === 'fearful'),
            ];
          case 'fearful':
            return [
              emojisArray.find((emoji) => emoji.value === 'surprised'),
              emojisArray.find((emoji) => emoji.value === 'fearful'),
            ];
          case 'angry':
            return [
              emojisArray.find((emoji) => emoji.value === 'angry'),
              emojisArray.find((emoji) => emoji.value === 'sad'),
              emojisArray.find((emoji) => emoji.value === 'disgusted'),
            ];
          case 'disgusted':
            return [
              emojisArray.find((emoji) => emoji.value === 'angry'),
              emojisArray.find((emoji) => emoji.value === 'sad'),
              emojisArray.find((emoji) => emoji.value === 'disgusted'),
            ];
          case 'sad':
            return [
              emojisArray.find((emoji) => emoji.value === 'angry'),
              emojisArray.find((emoji) => emoji.value === 'sad'),
              emojisArray.find((emoji) => emoji.value === 'disgusted'),
            ];
          case 'iLike':
            return [emojisArray.find((emoji) => emoji.value === 'neutral')];
          case 'iDontLike':
            return [emojisArray.find((emoji) => emoji.value === 'iDontLike')];
          case 'laugh':
            return [emojisArray.find((emoji) => emoji.value === 'laugh')];
          case 'smile':
            return [emojisArray.find((emoji) => emoji.value === 'smile')];
          case 'empathy':
            return [emojisArray.find((emoji) => emoji.value === 'empathy')];
          case 'itsStrange':
            return [emojisArray.find((emoji) => emoji.value === 'itsStrange')];
          default:
            return [emojisArray.find((emoji) => emoji.value === 'neutral')];
        }
      })().filter((item): item is Emoji => item !== undefined);

      return emojis;
    };

    const generatePalette = (suggestions: EmotionRecommended[]): Emoji[] => {
      const emojisFlattened: Emoji[] = suggestions
        .map((emotionRecommended) =>
          mapEmotionToEmojis(emotionRecommended.emotion)
        )
        .flat();

      const palette = Array.from(
        new Set(emojisFlattened.map((obj) => obj.value))
      )
        .map((value) => emojisFlattened.find((obj) => obj.value === value))
        .filter((item): item is Emoji => item !== undefined);

      return palette;
    };

    const updateEmojis = async () => {
      try {
        let startTimeParam: number = startPositionRef.current;

        if (semiAutoAnnotationMe) {
          if (startTimeParam - 10 >= 0) startTimeParam = startTimeParam - 10;
          else startTimeParam = 0;
        } else {
          if (startTimeParam - 5 >= 0) startTimeParam = startTimeParam - 5;
          else startTimeParam = 0;
        }

        const suggestions: EmotionRecommended[] =
          await AnnotationService.getRecommendedEmotions(projectId, {
            onlyMe: semiAutoAnnotationMe,
            startTime: startTimeParam,
            offset: OFFSET + 5,
            limit: 4,
          });

        const palette: Emoji[] = generatePalette(suggestions);

        if (!palette.length) {
          const neutralEmoji = emojisArray.find(
            (emoji) => emoji.value === 'neutral'
          );

          if (neutralEmoji) palette.push(neutralEmoji);
        }

        // Always add like and dislike
        if (!palette.find((emotion) => emotion.value === 'iDontLike'))
          palette.unshift(emojisArray[1]);

        if (!palette.find((emotion) => emotion.value === 'iLike'))
          palette.unshift(emojisArray[0]);

        setEmojis(palette);
      } catch (e) {
        console.log(e);
      }
    };

    if (semiAutoAnnotation || semiAutoAnnotationMe) {
      updateEmojis();
      captureIntervalRef.current = window.setInterval(
        updateEmojis,
        OFFSET * 1000
      );
    } else setEmojis(emojisArray);

    return () => {
      clearInterval(captureIntervalRef.current as number);
    };
  }, [semiAutoAnnotation, semiAutoAnnotationMe, projectId]);

  // UI Code
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
    borderTopRightRadius: '20px',
    borderBottomRightRadius: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // margin: '10px 0 0 0',
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
  semiAutoAnnotation: state.project.player.semiAutoAnnotation,
  semiAutoAnnotationMe: state.project.player.semiAutoAnnotationMe,
  // @ts-ignore
  projectId: state.project.details.project.id,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(EmotionsPalette);
