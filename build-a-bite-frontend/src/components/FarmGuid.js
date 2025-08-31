import React, { useState, useEffect } from 'react';
import characterSprite from '../assets/minecraft-character2.png';

const bubbleStyle = {
  backgroundColor: '#3D8B35',
  borderRadius: '16px',
  padding: '14px 20px',
  color: '#FFFFFF',
  fontFamily: "'Baloo 2', cursive",
  fontWeight: 'bold',
  boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
  maxWidth: '280px',
  position: 'relative',
};

const bubblePointer = {
  content: '""',
  position: 'absolute',
  right: '-10px',
  top: '20px',
  width: 0,
  height: 0,
  borderTop: '10px solid transparent',
  borderBottom: '10px solid transparent',
  borderLeft: '10px solid #3D8B35',
};

const guideContainer = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  position: 'fixed',
  bottom: '20px',   // ⬅️ now permanently bottom-right
  right: '20px',
  zIndex: 50,
  cursor: 'pointer'
};

function FarmGuide({ message, respawnTime = 10000 }) {
  const [visible, setVisible] = useState(true);

  // Auto respawn after interval
  useEffect(() => {
    let timer;
    if (!visible) {
      timer = setTimeout(() => setVisible(true), respawnTime);
    }
    return () => clearTimeout(timer);
  }, [visible, respawnTime]);

  if (!visible) return null;

  return (
    <div style={guideContainer} onClick={() => setVisible(false)}>
      <div style={bubbleStyle}>
        <span>{message}</span>
        <div style={bubblePointer}></div>
      </div>
      <img 
        src={characterSprite} 
        alt="Guide" 
        style={{ width: '180px' }} 
      />
    </div>
  );
}

export default FarmGuide;
