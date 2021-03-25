import React, {
  useState,
  useContext,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import { AppContext } from '../utils/AppState';

type Props = {
  id: number;
  index: number;
  title: string;
  removeParentComponentDragging: any;
  enableEditList: { id: number; index: any };
  setEnableEditList: any;
  setEnableEditBoardName: any;
  setShowInputBox: any;
};

const position = { x: 0, y: 0 };

const ListContentContainer: React.FC<Props> = ({
  id,
  index,
  title,
  removeParentComponentDragging,
  enableEditList,
  setEnableEditList,
  setEnableEditBoardName,
  setShowInputBox,
}) => {
  const context = useContext(AppContext);
  const { todo, setTodo, onProgress, setOnProgress, done, setDone } = context;

  const [newTitle, setNewTitle] = useState('');
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
    removeParentComponentDragging();
    setState((state) => ({
      ...state,
      isDragging: true,
      origin: { x: clientX, y: clientY },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseMove = useCallback(
    ({ clientX, clientY }) => {
      removeParentComponentDragging();
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
      setState((state) => ({ ...state, translation: position }));
      //   const lastTranslation = {
      //     x: state.translation.x,
      //     y: state.translation.y,
      //   };
      //   setState((state) => ({
      //     ...state,
      //     lastTranslation,
      //   }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isDragging, handleMouseMove, handleMouseUp]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const closeEditList = () => {
    setEnableEditList({ id: 0, index: null });
  };

  const closeEditListWithESCbutton = (
    e: any,
    closeEditListFunction: any,
    removeEventListener: any,
  ) => {
    const keys: any = {
      27: () => {
        e.preventDefault();
        closeEditListFunction();
        removeEventListener();
      },
    };
    if (keys[e.keyCode]) {
      keys[e.keyCode]();
    }
  };

  const closeEditListWithESCbuttonHandler = useCallback(
    (e) => {
      closeEditListWithESCbutton(e, closeEditList, () =>
        window.removeEventListener(
          'keyup',
          closeEditListWithESCbuttonHandler,
          false,
        ),
      );
    },
    [closeEditList],
  );

  useEffect(() => {
    window.addEventListener('keyup', closeEditListWithESCbuttonHandler, false);
    return () => {
      window.removeEventListener(
        'keyup',
        closeEditListWithESCbuttonHandler,
        false,
      );
    };
  }, [closeEditListWithESCbuttonHandler]);

  const removeThisEntryFromList = (index: number) => {
    let dummyList;
    switch (id) {
      case 1:
        dummyList = todo.list;
        const newTodo = {
          ...todo,
          list: [...dummyList.slice(0, index), ...dummyList.slice(index + 1)],
        };
        setTodo(newTodo);
        break;
      case 2:
        dummyList = onProgress.list;
        const newOnProgress = {
          ...onProgress,
          list: [...dummyList.slice(0, index), ...dummyList.slice(index + 1)],
        };
        setOnProgress(newOnProgress);
        break;
      case 3:
        dummyList = done.list;
        const newDone = {
          ...done,
          list: [...dummyList.slice(0, index), ...dummyList.slice(index + 1)],
        };
        setDone(newDone);
        break;
      default:
        break;
    }
  };

  const editThisEntryInTheList = (index: number) => {
    const inputBoxElement = document.getElementById(
      `inputBox-boardName-${id}-${index}`,
    ) as HTMLInputElement;
    let dummyList;
    if (newTitle !== '') {
      switch (id) {
        case 1:
          dummyList = todo.list;
          const newTodo = {
            ...todo,
            list: [
              ...dummyList.slice(0, index),
              newTitle,
              ...dummyList.slice(index + 1),
            ],
          };
          setTodo(newTodo);
          inputBoxElement.value = '';
          setNewTitle('');
          setEnableEditList({ id: 0, index: null });
          break;
        case 2:
          dummyList = onProgress.list;
          const newOnProgress = {
            ...onProgress,
            list: [
              ...dummyList.slice(0, index),
              newTitle,
              ...dummyList.slice(index + 1),
            ],
          };
          setOnProgress(newOnProgress);
          inputBoxElement.value = '';
          setNewTitle('');
          setEnableEditList({ id: 0, index: null });
          break;
        case 3:
          dummyList = done.list;
          const newDone = {
            ...done,
            list: [
              ...dummyList.slice(0, index),
              newTitle,
              ...dummyList.slice(index + 1),
            ],
          };
          setDone(newDone);
          inputBoxElement.value = '';
          setNewTitle('');
          setEnableEditList({ id: 0, index: null });
          break;
        default:
          break;
      }
    } else {
      setEnableEditList({ id: 0, index: null });
    }
  };

  return (
    <div className="listContent" style={styles} onMouseDown={handleMouseDown}>
      {enableEditList.id === id && enableEditList.index === index ? (
        <form
          className="listContent-title"
          onSubmit={(e) => {
            e.preventDefault();
            editThisEntryInTheList(index);
          }}
        >
          <input
            id={`inputBox-boardName-${id}-${index}`}
            autoFocus
            placeholder={title}
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
          />
        </form>
      ) : (
        <div className="listContent-title">
          <div
            className="listContent-title-text"
            onClick={() => {
              setEnableEditBoardName(0);
              setShowInputBox(0);
              setEnableEditList({ id, index });
            }}
          >
            {title}
          </div>
        </div>
      )}

      <div>
        <button
          className="delete"
          onClick={() => removeThisEntryFromList(index)}
        >
          -
        </button>
      </div>
    </div>
  );
};

export default ListContentContainer;
