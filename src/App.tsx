import React, { useEffect, useState, useContext } from 'react';
import './css/styles.css';

import { AppContext } from './utils/AppState';
import BoxContainer from './components/BoxContainer';
import ProgressBar from './components/ProgressBar';

const App = () => {
  const context = useContext(AppContext);
  const { setTodo, setOnProgress, setDone } = context;

  const [enableEditBoardName, setEnableEditBoardName] = useState(0);
  const [showInputBox, setShowInputBox] = useState(0);
  const [enableEditList, setEnableEditList] = useState({ id: 0, index: null });

  useEffect(() => {
    const stringifiedTodo = localStorage.getItem('todo');
    if (stringifiedTodo) {
      const todo = JSON.parse(stringifiedTodo);
      setTodo(todo);
    }
    const stringifiedOnProgress = localStorage.getItem('onProgress');
    if (stringifiedOnProgress) {
      const onProgress = JSON.parse(stringifiedOnProgress);
      setOnProgress(onProgress);
    }
    const stringifiedDone = localStorage.getItem('done');
    if (stringifiedDone) {
      const done = JSON.parse(stringifiedDone);
      setDone(done);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <ProgressBar />
    </div>
  );
};

export default App;
