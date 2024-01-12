interface State {
  todo: string[];
  deleted: string[];
  tasks: Record<string, Task>;
}

interface Task {
  title: string;
  dateCreated: string;
  completed?: boolean;
}

function createTask({ dateCreated, title, completed = false }: Task) {
  return { dateCreated, title, completed };
}

enum TodoActions {
  CREATE = "CREATE",
  DELETE = "DELETE",
  TOGGLE = "TOGGLE",
  UPDATE = "UPDATE",
  LOAD = "LOAD",
  RESTORE = "RESTORE",
}

interface TodoCreate {
  type: TodoActions.CREATE;
  payload: string;
}
interface TodoDelete {
  type: TodoActions.DELETE;
  payload: string;
}
interface TodoToggle {
  type: TodoActions.TOGGLE;
  payload: string;
}
interface TodoUpdate {
  type: TodoActions.UPDATE;
  payload: { id: string; title: string };
}
interface TodoLoadData {
  type: TodoActions.LOAD;
  payload: State;
}
interface TodoRestore {
  type: TodoActions.RESTORE;
  payload: string;
}

type TodoActionType =
  | TodoCreate
  | TodoDelete
  | TodoToggle
  | TodoUpdate
  | TodoLoadData
  | TodoRestore;

function todoReducer(state: State, action: TodoActionType) {
  switch (action.type) {
    case TodoActions.CREATE: {
      const id = Date.now().toString();
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [id]: createTask({ title: action.payload, dateCreated: id }),
        },
        todo: [...state.todo, id],
      };
    }
    case TodoActions.DELETE: {
      if (state.deleted.includes(action.payload)) return state;
      return {
        ...state,
        deleted: [...state.deleted, action.payload],
        todo: state.todo.filter((taskId) => taskId !== action.payload),
      };
    }
    case TodoActions.TOGGLE: {
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload]: {
            ...state.tasks[action.payload],
            completed: !state.tasks[action.payload].completed,
          },
        },
      };
    }
    case TodoActions.UPDATE: {
      const { id, title } = action.payload;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [id]: {
            ...state.tasks[id],
            title: title,
          },
        },
      };
    }
    case TodoActions.LOAD: {
      return action.payload;
    }
    case TodoActions.RESTORE: {
      if (state.todo.includes(action.payload)) return state;
      return {
        ...state,
        todo: [...state.todo, action.payload],
        deleted: state.deleted.filter((taskId) => taskId !== action.payload),
      };
    }
    default:
      return state;
  }
}

export { todoReducer, TodoActions };
export type { TodoActionType, State };
