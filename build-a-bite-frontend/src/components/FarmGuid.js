import React from 'react';
import characterSprite from '../assets/minecraft-character2.png';

const bubbleStyle = {
  backgroundColor: '#FFEA65',
  borderRadius: '20px',
  padding: '16px 24px',
  color: '#3D8B35',
  fontFamily: "'Baloo 2', cursive",
  fontWeight: 'bold',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  maxWidth: '300px',
};

const guideContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  margin: '1rem 0',
  position: 'fixed',
  bottom: '20px',
  right: '20px',
};

function FarmGuide({ message }) {
  return (
    <div style={guideContainer}>
      <div style={bubbleStyle}>
        {message}
      </div>
      <img 
        src={characterSprite} 
        alt="Guide" 
        style={{ width: '78px' }} 
      />
    </div>
  );
}

export default FarmGuide;