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
      transition: state.isDragging ? 'none' : 'transform 1ms',
      zIndex: state.isDragging ? 2 : 1,
    }),
    [state.isDragging, state.translation],
  );

  const isContentDraggedOver_todoBox = () => {
    const thisContent = document.getElementById(
      `content-${id}-${index}`,
    ) as HTMLDivElement;
    const { top, bottom, left, right } = thisContent.getBoundingClientRect();
    const todoBox = document.getElementById('box-1') as HTMLDivElement;
    const {
      top: todoBoxTop,
      bottom: todoBoxBottom,
      left: todoBoxLeft,
      right: todoBoxRight,
    } = todoBox.getBoundingClientRect();
    if (
      ((top > todoBoxTop && bottom < todoBoxBottom) ||
        (top <= todoBoxTop && bottom < todoBoxBottom && bottom > todoBoxTop) ||
        (bottom >= todoBoxBottom && top < todoBoxBottom && top > todoBoxTop)) &&
      ((left > todoBoxLeft && right < todoBoxRight) ||
        (left <= todoBoxLeft && right < todoBoxRight && right > todoBoxLeft) ||
        (right >= todoBoxRight && left < todoBoxRight && left > todoBoxLeft))
    ) {
      return true;
    } else {
      return false;
    }
  };

  const isContentDraggedOver_onProgressBox = () => {
    const thisContent = document.getElementById(
      `content-${id}-${index}`,
    ) as HTMLDivElement;
    const { top, bottom, left, right } = thisContent.getBoundingClientRect();
    const onProgressBox = document.getElementById('box-2') as HTMLDivElement;
    const {
      top: onProgressBoxTop,
      bottom: onProgressBoxBottom,
      left: onProgressBoxLeft,
      right: onProgressBoxRight,
    } = onProgressBox.getBoundingClientRect();
    if (
      ((top > onProgressBoxTop && bottom < onProgressBoxBottom) ||
        (top <= onProgressBoxTop &&
          bottom < onProgressBoxBottom &&
          bottom > onProgressBoxTop) ||
        (bottom >= onProgressBoxBottom &&
          top < onProgressBoxBottom &&
          top > onProgressBoxTop)) &&
      ((left > onProgressBoxLeft && right < onProgressBoxRight) ||
        (left <= onProgressBoxLeft &&
          right < onProgressBoxRight &&
          right > onProgressBoxLeft) ||
        (right >= onProgressBoxRight &&
          left < onProgressBoxRight &&
          left > onProgressBoxLeft))
    ) {
      return true;
    } else {
      return false;
    }
  };

  const isContentDraggedOver_doneBox = () => {
    const thisContent = document.getElementById(
      `content-${id}-${index}`,
    ) as HTMLDivElement;
    const { top, bottom, left, right } = thisContent.getBoundingClientRect();
    const doneBox = document.getElementById('box-3') as HTMLDivElement;
    const {
      top: doneBoxTop,
      bottom: doneBoxBottom,
      left: doneBoxLeft,
      right: doneBoxRight,
    } = doneBox.getBoundingClientRect();
    if (
      ((top > doneBoxTop && bottom < doneBoxBottom) ||
        (top <= doneBoxTop && bottom < doneBoxBottom && bottom > doneBoxTop) ||
        (bottom >= doneBoxBottom && top < doneBoxBottom && top > doneBoxTop)) &&
      ((left > doneBoxLeft && right < doneBoxRight) ||
        (left <= doneBoxLeft && right < doneBoxRight && right > doneBoxLeft) ||
        (right >= doneBoxRight && left < doneBoxRight && left > doneBoxLeft))
    ) {
      return true;
    } else {
      return false;
    }
  };

  const highlightTheDraggedOverBox = () => {
    const todoBox = document.getElementById('box-1') as HTMLDivElement;
    todoBox.classList.remove('box-container-isDraggedOver');
    const onProgressBox = document.getElementById('box-2') as HTMLDivElement;
    onProgressBox.classList.remove('box-container-isDraggedOver');
    const doneBox = document.getElementById('box-3') as HTMLDivElement;
    doneBox.classList.remove('box-container-isDraggedOver');
    switch (id) {
      case 1:
        switch (true) {
          case isContentDraggedOver_todoBox():
            // if the content is still in its box, do nothing
            break;
          case isContentDraggedOver_onProgressBox():
            onProgressBox.classList.add('box-container-isDraggedOver');
            break;
          case isContentDraggedOver_doneBox():
            doneBox.classList.add('box-container-isDraggedOver');
            break;
          default:
            break;
        }
        break;
      case 2:
        switch (true) {
          case isContentDraggedOver_onProgressBox():
            // if the content is still in its box, do nothing
            break;
          case isContentDraggedOver_doneBox():
            doneBox.classList.add('box-container-isDraggedOver');
            break;
          case isContentDraggedOver_todoBox():
            todoBox.classList.add('box-container-isDraggedOver');
            break;
          default:
            break;
        }
        break;
      case 3:
        switch (true) {
          case isContentDraggedOver_doneBox():
            // if the content is still in its box, do nothing
            break;
          case isContentDraggedOver_onProgressBox():
            onProgressBox.classList.add('box-container-isDraggedOver');
            break;
          case isContentDraggedOver_todoBox():
            todoBox.classList.add('box-container-isDraggedOver');
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  };

  const moveContentIntoDraggedOverBox = () => {
    const todoBox = document.getElementById('box-1') as HTMLDivElement;
    todoBox.classList.remove('box-container-isDraggedOver');
    const onProgressBox = document.getElementById('box-2') as HTMLDivElement;
    onProgressBox.classList.remove('box-container-isDraggedOver');
    const doneBox = document.getElementById('box-3') as HTMLDivElement;
    doneBox.classList.remove('box-container-isDraggedOver');
    switch (id) {
      case 1:
        switch (true) {
          case isContentDraggedOver_todoBox():
            // if the content is still in its box, do nothing
            break;
          case isContentDraggedOver_onProgressBox():
            removeThisEntryFromList(index);
            const newOnProgress = {
              ...onProgress,
              list: [...onProgress.list, todo.list[index]],
            };
            setOnProgress(newOnProgress);
            localStorage.setItem('onProgress', JSON.stringify(newOnProgress));
            break;
          case isContentDraggedOver_doneBox():
            removeThisEntryFromList(index);
            const newDone = {
              ...done,
              list: [...done.list, todo.list[index]],
            };
            setDone(newDone);
            localStorage.setItem('done', JSON.stringify(newDone));
            break;
          default:
            break;
        }
        setState((state) => ({ ...state, translation: position }));
        break;
      case 2:
        switch (true) {
          case isContentDraggedOver_onProgressBox():
            // if the content is still in its box, do nothing
            break;
          case isContentDraggedOver_doneBox():
            removeThisEntryFromList(index);
            const newDone = {
              ...done,
              list: [...done.list, onProgress.list[index]],
            };
            setDone(newDone);
            localStorage.setItem('done', JSON.stringify(newDone));
            break;
          case isContentDraggedOver_todoBox():
            removeThisEntryFromList(index);
            const newTodo = {
              ...todo,
              list: [...todo.list, onProgress.list[index]],
            };
            setTodo(newTodo);
            localStorage.setItem('todo', JSON.stringify(newTodo));
            break;
          default:
            break;
        }
        setState((state) => ({ ...state, translation: position }));
        break;
      case 3:
        switch (true) {
          case isContentDraggedOver_doneBox():
            // if the content is still in its box, do nothing
            break;
          case isContentDraggedOver_onProgressBox():
            removeThisEntryFromList(index);
            const newOnProgress = {
              ...onProgress,
              list: [...onProgress.list, done.list[index]],
            };
            setOnProgress(newOnProgress);
            localStorage.setItem('onProgress', JSON.stringify(newOnProgress));
            break;
          case isContentDraggedOver_todoBox():
            removeThisEntryFromList(index);
            const newTodo = {
              ...todo,
              list: [...todo.list, done.list[index]],
            };
            setTodo(newTodo);
            localStorage.setItem('todo', JSON.stringify(newTodo));
            break;
          default:
            break;
        }
        setState((state) => ({ ...state, translation: position }));
        break;
      default:
        break;
    }
  };

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
      highlightTheDraggedOverBox();
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
      moveContentIntoDraggedOverBox();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
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
        localStorage.setItem('todo', JSON.stringify(newTodo));
        break;
      case 2:
        dummyList = onProgress.list;
        const newOnProgress = {
          ...onProgress,
          list: [...dummyList.slice(0, index), ...dummyList.slice(index + 1)],
        };
        setOnProgress(newOnProgress);
        localStorage.setItem('onProgress', JSON.stringify(newOnProgress));
        break;
      case 3:
        dummyList = done.list;
        const newDone = {
          ...done,
          list: [...dummyList.slice(0, index), ...dummyList.slice(index + 1)],
        };
        setDone(newDone);
        localStorage.setItem('done', JSON.stringify(newDone));
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
          localStorage.setItem('todo', JSON.stringify(newTodo));
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
          localStorage.setItem('onProgress', JSON.stringify(newOnProgress));
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
          localStorage.setItem('done', JSON.stringify(newDone));
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
    return <div className="listContent-title-text">{children}</div>;
  };

  return (
    <div
      id={`content-${id}-${index}`}
      className="listContent"
      style={styles}
      onMouseDown={handleMouseDown}
    >
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
            placeholder={`hit "enter" to save`}
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
          />
        </form>
      ) : (
        <div className="listContent-title">{checkIfStringContainsUrl()}</div>
      )}

      <div className="listContent-buttons">
        <button
          className="show-input"
          onClick={() => {
            if (enableEditList.id === id && enableEditList.index === index) {
              setEnableEditList({ id: 0, index: null });
            } else {
              setEnableEditBoardName(0);
              setShowInputBox(0);
              setEnableEditList({ id, index });
            }
          }}
        >
          /
        </button>
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
