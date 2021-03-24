import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useContext,
} from 'react';
import { AppContext } from '../utils/AppState';

type Props = {
  id: number;
  name: string;
  boxRef: any;
  showInputBox: number;
  setShowInputBox: any;
};

const position = { x: 0, y: 0 };

const BoxContainer: React.FC<Props> = ({
  id,
  name,
  boxRef,
  showInputBox,
  setShowInputBox,
}) => {
  const context = useContext(AppContext);
  const { todoList, onProgressList, doneList } = context;
  const [state, setState] = useState({
    isDragging: false,
    origin: position,
    translation: position,
    lastTranslation: position,
  });

  const styles = useMemo(
    () => ({
      cursor: state.isDragging ? '-webkit-grabbing' : '-webkit-grab',
      transform: `translate(${state.translation.x}px, ${state.translation.y}px)`,
      transition: state.isDragging ? 'none' : 'transform 500ms',
      zIndex: state.isDragging ? 2 : 1,
    }),
    [state.isDragging, state.translation],
  );

  const handleMouseDown = useCallback(({ clientX, clientY }) => {
    setState((state) => ({
      ...state,
      isDragging: true,
      origin: { x: clientX, y: clientY },
    }));
  }, []);

  const handleMouseMove = useCallback(
    ({ clientX, clientY }) => {
      const translation = {
        x: clientX - state.origin.x + state.lastTranslation.x,
        y: clientY - state.origin.y + state.lastTranslation.y,
      };
      setState((state) => ({ ...state, translation }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.origin],
  );

  const handleMouseUp = useCallback(() => {
    setState((state) => ({
      ...state,
      isDragging: false,
    }));
  }, []);

  useEffect(() => {
    if (state.isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      // setState below will return the modal back to center if dragging is stoped
      // setState(state => ({ ...state, translation: position }));
      const lastTranslation = {
        x: state.translation.x,
        y: state.translation.y,
      };
      setState((state) => ({
        ...state,
        lastTranslation,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isDragging, handleMouseMove, handleMouseUp]);

  const renderListQty = () => {
    switch (id) {
      case 1:
        return todoList.length;
      case 2:
        return onProgressList.length;
      case 3:
        return doneList.length;
      default:
        return null;
    }
  };

  const renderList = () => {
    switch (id) {
      case 1:
        if (todoList.length > 0) {
          return todoList.map((todo) => {
            return <div>{todo}</div>;
          });
        } else {
          return null;
        }
      case 2:
        if (onProgressList.length > 0) {
          return onProgressList.map((onProgress) => {
            return <div>{onProgress}</div>;
          });
        } else {
          return null;
        }
      case 3:
        if (doneList.length > 0) {
          return doneList.map((done) => {
            return <div>{done}</div>;
          });
        } else {
          return null;
        }
      default:
        return null;
    }
  };

  return (
    <div
      className="box-container"
      ref={boxRef}
      style={styles}
      onMouseDown={handleMouseDown}
    >
      <div className="title-container">
        <div className="title-text">
          {name} ({renderListQty()})
        </div>
        <button className="input-button" onClick={() => setShowInputBox(id)}>
          +
        </button>
      </div>
      {showInputBox === id && (
        <div className="inputBox-container">
          <input className="inputBox" />
          <button className="input-button">v</button>
          <button className="input-button">x</button>
        </div>
      )}
      {renderList()}
    </div>
  );
};

export default BoxContainer;
