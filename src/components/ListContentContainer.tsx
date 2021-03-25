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
};

const position = { x: 0, y: 0 };

const ListContentContainer: React.FC<Props> = ({
  id,
  index,
  title,
  removeParentComponentDragging,
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
        setOnProgressList(newList);
        break;
      case 3:
        dummyList = doneList;
        newList = [...dummyList.slice(0, index), ...dummyList.slice(index + 1)];
        setDoneList(newList);
        break;
      default:
        break;
    }
  };

  return (
    <div className="listContent" style={styles} onMouseDown={handleMouseDown}>
      <div className="listContent-title">{title}</div>
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
