import React, { useEffect, useState } from 'react';

const emojis = [
  // {
  //   label: 'Emotions & Judgements',
  //   value: '',
  // },
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
    label: '🙂',
    value: 'iLike',
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
    label: '🙁',
    value: 'iDontLike',
  },
  {
    label: '🤔',
    value: 'ItsStrange',
  },
];

interface Props {
  emotion?: string;
  onEmotionChange(emotion: string | undefined): void;
}

const EmotionsPalette = ({ emotion, onEmotionChange }: Props) => {
  const [hoveredComponent, setHoveredComponent] = useState<number | null>(null);

  useEffect(() => {
    // check if semi-auto mode
    // set interval that gets new emojis
    // update emojis

    return () => {
      //clear interval
      //reset emojis
    };
  }, []);

  const handleHover = (index: number) => {
    setHoveredComponent(index);
  };

  const handleHoverLeave = () => {
    setHoveredComponent(null);
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: '#f3f3f3',
    borderRadius: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '10px 0',
    padding: '0 5px',
    height: '2.5rem',
    width: '100%',
  };

  const elementStyle: React.CSSProperties = {
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

export default EmotionsPalette;
