import React, { useRef, useState } from 'react';
import './style.css';

import BoxContainer from './components/BoxContainer';

const App = () => {
  const [showInputBox, setShowInputBox] = useState(0);

  const todoBoxRef = useRef();
  const todoBoxProps = {
    id: 1,
    name: 'Todo',
    boxRef: todoBoxRef,
    showInputBox,
    setShowInputBox,
  };

  const onProgressBoxRef = useRef();
  const onProgressBoxProps = {
    id: 2,
    name: 'On Progress',
    boxRef: onProgressBoxRef,
    showInputBox,
    setShowInputBox,
  };

  const doneBoxRef = useRef();
  const doneBoxProps = {
    id: 3,
    name: 'Done',
    boxRef: doneBoxRef,
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
