import React, { createContext, useReducer } from 'react';

type Payload = {
  name: string;
  list: any;
};

export const initialValues = {
  todo: {
    name: 'Todo',
    list: [],
  },
  onProgress: {
    name: 'On Progress',
    list: [],
  },
  done: {
    name: 'Done',
    list: [],
  },
  setTodo: (payload: Payload) => {},
  setOnProgress: (payload: Payload) => {},
  setDone: (payload: Payload) => {},
};

export const AppContext = createContext(initialValues);

type State = {
  todo: Payload;
  onProgress: Payload;
  done: Payload;
};

type Action = {
  type: string;
  payload: Payload;
};

function reducer(state: State, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case 'setTodo':
      return { ...state, todo: payload };
    case 'setOnProgress':
      return { ...state, onProgress: payload };
    case 'setDone':
      return { ...state, done: payload };
    default:
      return state;
  }
}

export const AppProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialValues);

  return (
    <AppContext.Provider
      value={{
        todo: state.todo,
        onProgress: state.onProgress,
        done: state.done,
        setTodo: (payload) => dispatch({ type: 'setTodo', payload }),
        setOnProgress: (payload) =>
          dispatch({ type: 'setOnProgress', payload }),
        setDone: (payload) => dispatch({ type: 'setDone', payload }),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
