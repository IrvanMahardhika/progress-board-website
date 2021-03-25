import React, { useState } from 'react';
import './css/styles.css';

import BoxContainer from './components/BoxContainer';

const App = () => {
  const [enableEditBoardName, setEnableEditBoardName] = useState(0);
  const [showInputBox, setShowInputBox] = useState(0);
  const [enableEditList, setEnableEditList] = useState({ id: 0, index: null });

  const todoBoxProps = {
    id: 1,
    enableEditBoardName,
    setEnableEditBoardName,
    showInputBox,
    setShowInputBox,
    enableEditList,
    setEnableEditList,
  };

  const onProgressBoxProps = {
    id: 2,
    enableEditBoardName,
    setEnableEditBoardName,
    showInputBox,
    setShowInputBox,
    enableEditList,
    setEnableEditList,
  };

  const doneBoxProps = {
    id: 3,
    enableEditBoardName,
    setEnableEditBoardName,
    showInputBox,
    setShowInputBox,
    enableEditList,
    setEnableEditList,
  };

  return (
    <div className="App">
      <div className="appTitle">
        <div className="appTitle-text">Progress Board</div>
      </div>
      <div className="appContent">
        <BoxContainer {...todoBoxProps} />
        <BoxContainer {...onProgressBoxProps} />
        <BoxContainer {...doneBoxProps} />
      </div>
    </div>
  );
};

export default App;
