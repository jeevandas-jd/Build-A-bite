import React from 'react';
import { playClickSound } from '../utils/debugger';

const MyButton = () => {
  return (
    <button onClick={playClickSound}>
      Click Me
    </button>
  );
};

export default MyButton;
