import React from 'react';
import characterSprite from '../assets/minecraft-character2.png';

// Bubble style fits farm theme (soft green + white text)
const bubbleStyle = {
  backgroundColor: '#3D8B35',       // farm green
  borderRadius: '16px',
  padding: '14px 20px',
  color: '#FFFFFF',                 // white text for contrast
  fontFamily: "'Baloo 2', cursive",
  fontWeight: 'bold',
  boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
  maxWidth: '280px',
  position: 'relative',
};

// Bubble pointer flipped to the right side
const bubblePointer = {
  content: '""',
  position: 'absolute',
  right: '-10px',
  top: '20px',
  width: 0,
  height: 0,
  borderTop: '10px solid transparent',
  borderBottom: '10px solid transparent',
  borderLeft: '10px solid #3D8B35', // points left instead of right
};

const guideContainer = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  position: 'fixed',
  top: '150px',    // top instead of bottom
  right: '20px',  // right instead of left
  zIndex: 50,
};

function FarmGuide({ message }) {
  return (
    <div style={guideContainer}>
      <div style={bubbleStyle}>
        <span>{message}</span>
        <div style={bubblePointer}></div>
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
