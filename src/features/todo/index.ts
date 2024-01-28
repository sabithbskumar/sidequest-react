interface State {
  todo: string[];
  deleted: string[];
  tasks: Record<string, Task>;
}

interface TaskData {
  title: string;
  description?: string;
  completed?: boolean;
}

interface Task extends TaskData {
  dateCreated: string;
}

function createTask({ completed = false, ...data }: Task) {
  return { completed, ...data };
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
  payload: TaskData;
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
  payload: { id: string } & TaskData;
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
          [id]: createTask({ ...action.payload, dateCreated: id }),
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
      const { id, ...data } = action.payload;
      return {
        ...state,
        tasks: { ...state.tasks, [id]: { ...state.tasks[id], ...data } },
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
export type { TodoActionType, State, Task };
