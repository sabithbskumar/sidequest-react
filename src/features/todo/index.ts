interface Task {
  id: string;
  title: string;
  completed?: boolean;
  deleted?: boolean;
}

function createTask({ id, title, completed = false }: Task) {
  return { id, title, completed, deleted: false };
}

enum TodoActions {
  CREATE = "CREATE",
  DELETE = "DELETE",
  TOGGLE = "TOGGLE",
  UPDATE = "UPDATE",
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

type TodoActionType = TodoCreate | TodoDelete | TodoToggle | TodoUpdate;

function todoReducer(state: Record<string, Task>, action: TodoActionType) {
  switch (action.type) {
    case TodoActions.CREATE: {
      const id = Date.now().toString();
      return {
        ...state,
        [id]: createTask({ id, title: action.payload }),
      };
    }
    case TodoActions.DELETE: {
      const next = { ...state };
      next[action.payload].deleted = true;
      return next;
    }
    case TodoActions.TOGGLE: {
      const next = { ...state };
      next[action.payload] = {
        ...next[action.payload],
        completed: !next[action.payload].completed,
      };
      return next;
    }
    case TodoActions.UPDATE: {
      const next = { ...state };
      next[action.payload.id].title = action.payload.title;
      return next;
    }
    default:
      return state;
  }
}

export { todoReducer, TodoActions };
export type { TodoActionType };
