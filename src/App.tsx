import React, { useState } from 'react';
import './style.css';

import BoxContainer from './components/BoxContainer';

const App = () => {
  const [showInputBox, setShowInputBox] = useState(0);

  const todoBoxProps = {
    id: 1,
    name: 'Todo',
    showInputBox,
    setShowInputBox,
  };

  const onProgressBoxProps = {
    id: 2,
    name: 'On Progress',
    showInputBox,
    setShowInputBox,
  };

  const doneBoxProps = {
    id: 3,
    name: 'Done',
    showInputBox,
    setShowInputBox,
  };

  return (
    <div className="App">
      <div className="appTitle-container">
        <div className="appTitle-text">Progress Board</div>
      </div>
      <div className="appContent-container">
        <BoxContainer {...todoBoxProps} />
        <BoxContainer {...onProgressBoxProps} />
        <BoxContainer {...doneBoxProps} />
      </div>
    </div>
  );
};

export default App;
