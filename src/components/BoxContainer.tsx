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
  showInputBox: number;
  setShowInputBox: any;
};

const position = { x: 0, y: 0 };

const BoxContainer: React.FC<Props> = ({
  id,
  name,
  showInputBox,
  setShowInputBox,
}) => {
  const context = useContext(AppContext);
  const {
    todoList,
    setTodoList,
    onProgressList,
    setOnProgressList,
    doneList,
    setDoneList,
  } = context;

  const [newEntry, setNewEntry] = useState('');

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

  const addList = () => {
    if (newEntry !== '') {
      let newList;
      const inputElement = document.getElementById(
        `inputBox-${id}`,
      ) as HTMLInputElement;
      switch (id) {
        case 1:
          newList = [...todoList, newEntry];
          setTodoList(newList);
          setNewEntry('');
          inputElement.value = '';
          inputElement.focus();
          break;
        case 2:
          newList = [...onProgressList, newEntry];
          setOnProgressList(newList);
          setNewEntry('');
          inputElement.value = '';
          inputElement.focus();
          break;
        case 3:
          newList = [...doneList, newEntry];
          setDoneList(newList);
          setNewEntry('');
          inputElement.value = '';
          inputElement.focus();
          break;
        default:
          break;
      }
    }
  };

  const removeThisEntryFromList = (index: number) => {
    let dummyList;
    let newList;
    switch (id) {
      case 1:
        dummyList = todoList;
        newList = [...dummyList.slice(0, index), ...dummyList.slice(index + 1)];
        setTodoList(newList);
        break;
      case 2:
        dummyList = onProgressList;
        newList = [...dummyList.slice(0, index), ...dummyList.slice(index + 1)];
        setTodoList(newList);
        break;
      case 3:
        dummyList = doneList;
        newList = [...dummyList.slice(0, index), ...dummyList.slice(index + 1)];
        setTodoList(newList);
        break;
      default:
        break;
    }
  };

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
          return todoList.map((todo, index) => {
            return (
              <div className="listContent-Container">
                <div className="listContent-text">{todo}</div>
                <div>
                  <button
                    className="input-button"
                    onClick={() => removeThisEntryFromList(index)}
                  >
                    -
                  </button>
                </div>
              </div>
            );
          });
        } else {
          return null;
        }
      case 2:
        if (onProgressList.length > 0) {
          return onProgressList.map((onProgress, index) => {
            return (
              <div className="listContent-Container">
                <div className="listContent-text">{onProgress}</div>
                <div>
                  <button
                    className="input-button"
                    onClick={() => removeThisEntryFromList(index)}
                  >
                    -
                  </button>
                </div>
              </div>
            );
          });
        } else {
          return null;
        }
      case 3:
        if (doneList.length > 0) {
          return doneList.map((done, index) => {
            return (
              <div className="listContent-Container">
                <div className="listContent-text">{done}</div>
                <div>
                  <button
                    className="input-button"
                    onClick={() => removeThisEntryFromList(index)}
                  >
                    -
                  </button>
                </div>
              </div>
            );
          });
        } else {
          return null;
        }
      default:
        return null;
    }
  };

  return (
    <div className="box-container" style={styles} onMouseDown={handleMouseDown}>
      <div className="title-container">
        <div className="title-text">
          {name} ({renderListQty()})
        </div>
        <button className="input-button" onClick={() => setShowInputBox(id)}>
          +
        </button>
      </div>
      {showInputBox === id && (
        <div id={`inputBox-${id}`} className="inputBox-container">
          <input
            className="inputBox"
            value={newEntry}
            onChange={({ target }) => setNewEntry(target.value)}
          />
          <button className="input-button" onClick={addList}>
            v
          </button>
          <button className="input-button">x</button>
        </div>
      )}
      {renderList()}
    </div>
  );
};

export default BoxContainer;
