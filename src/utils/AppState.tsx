import React, { createContext, useReducer } from 'react';

export const initialValues = {
  returnValue: true,
  todoList: [],
  onProgressList: [],
  doneList: [],
  setTodoList: (payload: any) => {},
  setOnProgressList: (payload: any) => {},
  setDoneList: (payload: any) => {},
};

export const AppContext = createContext(initialValues);

type State = {
  returnValue: boolean;
  todoList: string[];
  onProgressList: string[];
  doneList: string[];
};

type Action = {
  type: string;
  payload: any;
};

function reducer(state: State, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case 'setTodoList':
      return { ...state, todoList: payload };
    case 'setOnProgressList':
      return { ...state, onProgressList: payload };
    case 'setDoneList':
      return { ...state, doneList: payload };
    default:
      return state;
  }
}

export const AppProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialValues);

  return (
    <AppContext.Provider
      value={{
        returnValue: state.returnValue,
        todoList: state.todoList,
        onProgressList: state.onProgressList,
        doneList: state.doneList,
        setTodoList: (payload) => dispatch({ type: 'setTodoList', payload }),
        setOnProgressList: (payload) =>
          dispatch({ type: 'setOnProgressList', payload }),
        setDoneList: (payload) => dispatch({ type: 'setDoneList', payload }),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
