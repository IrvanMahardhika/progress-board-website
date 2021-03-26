import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useContext,
} from 'react';
import { AppContext } from '../utils/AppState';
import ListContentContainer from './ListContentContainer';

type Props = {
  id: number;
  enableEditBoardName: number;
  setEnableEditBoardName: any;
  showInputBox: number;
  setShowInputBox: any;
  enableEditList: { id: number; index: any };
  setEnableEditList: any;
};

const position = { x: 0, y: 0 };

const BoxContainer: React.FC<Props> = ({
  id,
  enableEditBoardName,
  setEnableEditBoardName,
  showInputBox,
  setShowInputBox,
  enableEditList,
  setEnableEditList,
}) => {
  const context = useContext(AppContext);
  const { todo, setTodo, onProgress, setOnProgress, done, setDone } = context;

  const [newBoardName, setNewBoardName] = useState('');
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
      // setState below will return the item back to center if dragging is stoped
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const closeEditBoardName = () => {
    setEnableEditBoardName(0);
  };

  const closeEditBoardNameWithESCbutton = (
    e: any,
    closeEditBoardNameFunction: any,
    removeEventListener: any,
  ) => {
    const keys: any = {
      27: () => {
        e.preventDefault();
        closeEditBoardNameFunction();
        removeEventListener();
      },
    };
    if (keys[e.keyCode]) {
      keys[e.keyCode]();
    }
  };

  const closeEditBoarNameWithESCbuttonHandler = useCallback(
    (e) => {
      closeEditBoardNameWithESCbutton(e, closeEditBoardName, () =>
        window.removeEventListener(
          'keyup',
          closeEditBoarNameWithESCbuttonHandler,
          false,
        ),
      );
    },
    [closeEditBoardName],
  );

  useEffect(() => {
    window.addEventListener(
      'keyup',
      closeEditBoarNameWithESCbuttonHandler,
      false,
    );
    return () => {
      window.removeEventListener(
        'keyup',
        closeEditBoarNameWithESCbuttonHandler,
        false,
      );
    };
  }, [closeEditBoarNameWithESCbuttonHandler]);

  const editBoardName = () => {
    const inputBoxElement = document.getElementById(
      `inputBox-boardName-${id}`,
    ) as HTMLInputElement;
    if (newBoardName !== '') {
      switch (id) {
        case 1:
          const newTodo = {
            ...todo,
            name: newBoardName,
          };
          setTodo(newTodo);
          setNewBoardName('');
          inputBoxElement.value = '';
          setEnableEditBoardName(0);
          break;
        case 2:
          const newOnProgress = {
            ...onProgress,
            name: newBoardName,
          };
          setOnProgress(newOnProgress);
          setNewBoardName('');
          inputBoxElement.value = '';
          setEnableEditBoardName(0);
          break;
        case 3:
          const newDone = {
            ...done,
            name: newBoardName,
          };
          setDone(newDone);
          setNewBoardName('');
          inputBoxElement.value = '';
          setEnableEditBoardName(0);
          break;
        default:
          break;
      }
    } else {
      setEnableEditBoardName(0);
    }
  };

  const addNewEntryIntoList = () => {
    const inputBoxElement = document.getElementById(
      `inputBox-${id}`,
    ) as HTMLInputElement;
    if (newEntry !== '') {
      switch (id) {
        case 1:
          const newTodo = {
            ...todo,
            list: [...todo.list, newEntry],
          };
          setTodo(newTodo);
          setNewEntry('');
          inputBoxElement.value = '';
          inputBoxElement.focus();
          break;
        case 2:
          const newOnProgress = {
            ...onProgress,
            list: [...onProgress.list, newEntry],
          };
          setOnProgress(newOnProgress);
          setNewEntry('');
          inputBoxElement.value = '';
          inputBoxElement.focus();
          break;
        case 3:
          const newDone = {
            ...done,
            list: [...done.list, newEntry],
          };
          setDone(newDone);
          setNewEntry('');
          inputBoxElement.value = '';
          inputBoxElement.focus();
          break;
        default:
          break;
      }
    } else {
      inputBoxElement.focus();
    }
  };

  const removeParentComponentDragging = () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const rendername = () => {
    if (enableEditBoardName === id) {
      switch (id) {
        case 1:
          return (
            <input
              id={`inputBox-boardName-${id}`}
              autoFocus
              className="inputBox-boardName"
              placeholder={`hit "enter" to save`}
              value={newBoardName}
              onChange={({ target }) => setNewBoardName(target.value)}
            />
          );
        case 2:
          return (
            <input
              id={`inputBox-boardName-${id}`}
              autoFocus
              className="inputBox-boardName"
              placeholder={`hit "enter" to save`}
              value={newBoardName}
              onChange={({ target }) => setNewBoardName(target.value)}
            />
          );
        case 3:
          return (
            <input
              id={`inputBox-boardName-${id}`}
              autoFocus
              className="inputBox-boardName"
              placeholder={`hit "enter" to save`}
              value={newBoardName}
              onChange={({ target }) => setNewBoardName(target.value)}
            />
          );
        default:
          return null;
      }
    } else {
      switch (id) {
        case 1:
          return todo.name;
        case 2:
          return onProgress.name;
        case 3:
          return done.name;
        default:
          return null;
      }
    }
  };

  const renderListQty = () => {
    switch (id) {
      case 1:
        return todo.list.length;
      case 2:
        return onProgress.list.length;
      case 3:
        return done.list.length;
      default:
        return null;
    }
  };

  const renderList = () => {
    let props = {
      id,
      index: 0,
      title: '',
      removeParentComponentDragging,
      enableEditList,
      setEnableEditList,
      setEnableEditBoardName,
      setShowInputBox,
    };
    switch (id) {
      case 1:
        if (todo.list.length > 0) {
          return todo.list.map((todo, index) => {
            props = { ...props, index, title: todo };
            return <ListContentContainer key={index.toString()} {...props} />;
          });
        } else {
          return null;
        }
      case 2:
        if (onProgress.list.length > 0) {
          return onProgress.list.map((onProgress, index) => {
            props = { ...props, index, title: onProgress };
            return <ListContentContainer key={index.toString()} {...props} />;
          });
        } else {
          return null;
        }
      case 3:
        if (done.list.length > 0) {
          return done.list.map((done, index) => {
            props = { ...props, index, title: done };
            return <ListContentContainer key={index.toString()} {...props} />;
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
      id={`box-${id}`}
      className="box-container"
      style={styles}
      onMouseDown={handleMouseDown}
    >
      <div className="title">
        <form
          className="title-text"
          onSubmit={(e) => {
            e.preventDefault();
            editBoardName();
          }}
        >
          {rendername()} ({renderListQty()})
        </form>
        <button
          className="show-input"
          onClick={() => {
            if (enableEditBoardName === id) {
              setEnableEditBoardName(0);
            } else {
              setEnableEditList({ id: 0, index: null });
              setShowInputBox(0);
              setEnableEditBoardName(id);
            }
          }}
        >
          /
        </button>
        <button
          className="show-input"
          onClick={() => {
            setEnableEditBoardName(0);
            setEnableEditList({ id: 0, index: null });
            setShowInputBox(id);
          }}
        >
          +
        </button>
      </div>
      {showInputBox === id && (
        <div className="input">
          <input
            id={`inputBox-${id}`}
            autoFocus
            className="inputBox"
            value={newEntry}
            onChange={({ target }) => setNewEntry(target.value)}
          />
          <button className="add" onClick={addNewEntryIntoList}>
            v
          </button>
          <button className="cancel" onClick={() => setShowInputBox(0)}>
            x
          </button>
        </div>
      )}
      {renderList()}
    </div>
  );
};

export default BoxContainer;
