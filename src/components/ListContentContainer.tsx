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

  const checkIfStringContainsUrl = () => {
    let children;
    children = title;
    const geturl = new RegExp(
      '(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))',
      'g',
    );
    let urlInTheStringArray = title.match(geturl);
    if (urlInTheStringArray) {
      // remove blank space in front of the url
      const urlInTheStringArrayLength = urlInTheStringArray.length;
      const newUrlInTheStringArray = [];
      for (let i = 0; i < urlInTheStringArrayLength; i++) {
        if (urlInTheStringArray[i].charAt(0) === ' ') {
          newUrlInTheStringArray.push(urlInTheStringArray[i].slice(1));
        } else {
          newUrlInTheStringArray.push(urlInTheStringArray[i]);
        }
      }

      // add "|||||" in front and behind the url for slice separator
      let stringToBeSplit = title;
      let urlFromPrevIteration: any;
      for (let i = 0; i < urlInTheStringArrayLength; i++) {
        const url = newUrlInTheStringArray[i];
        // this if mechanism is to solve problem by duplicate url
        if (urlFromPrevIteration === url) {
          continue;
        }
        stringToBeSplit = stringToBeSplit.replace(
          new RegExp(url, 'g'),
          `|||||${url}|||||`,
        );
        urlFromPrevIteration = url;
      }

      // set new children for the html
      const newChildren: any[] = [];
      const stringSplittedArray = stringToBeSplit.split('|||||');
      const stringSplittedArrayLength = stringSplittedArray.length;
      for (let i = 0; i < stringSplittedArrayLength; i++) {
        if (newUrlInTheStringArray.includes(stringSplittedArray[i])) {
          // if the element is one of the url
          // display it with anchor tag
          newChildren.push(
            <a key={i.toString()} href={stringSplittedArray[i]}>
              {stringSplittedArray[i]}
            </a>,
          );
        } else {
          newChildren.push(stringSplittedArray[i]);
        }
      }
      children = newChildren;
    }
    return (
      <div
        className="listContent-title-text"
        onClick={() => {
          setEnableEditBoardName(0);
          setShowInputBox(0);
          setEnableEditList({ id, index });
        }}
      >
        {children}
      </div>
    );
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
        <div className="listContent-title">{checkIfStringContainsUrl()}</div>
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
