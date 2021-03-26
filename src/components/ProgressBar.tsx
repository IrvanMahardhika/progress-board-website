import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../utils/AppState';

const ProgressBar: React.FC = () => {
  const context = useContext(AppContext);
  const { todo, onProgress, done } = context;

  const [completedBarWidth, setCompletedBarWidth] = useState('0%');

  useEffect(() => {
    const todoItem = todo.list.length;
    const onProgressItem = onProgress.list.length;
    const doneItem = done.list.length;
    const totalItem = todoItem + onProgressItem + doneItem;
    const progress = (doneItem / totalItem) * 100;
    setCompletedBarWidth(`${progress}%`);
  }, [todo, onProgress, done]);

  return (
    <div id="myProgress">
      <div id="barContainer">
        <div id="completedBar" style={{ width: completedBarWidth }}></div>
      </div>
    </div>
  );
};

export default ProgressBar;
