interface State {
  todo: string[];
  deleted: string[];
  tasks: Record<string, Task>;
}

interface Task {
  title: string;
  date_created: string;
  completed?: boolean;
}

function createTask({ date_created, title, completed = false }: Task) {
  return { date_created, title, completed };
}

enum TodoActions {
  CREATE = "CREATE",
  DELETE = "DELETE",
  TOGGLE = "TOGGLE",
  UPDATE = "UPDATE",
  LOAD = "LOAD",
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

type TodoActionType =
  | TodoCreate
  | TodoDelete
  | TodoToggle
  | TodoUpdate
  | TodoLoadData;

function todoReducer(state: State, action: TodoActionType) {
  switch (action.type) {
    case TodoActions.CREATE: {
      const id = Date.now().toString();
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [id]: createTask({ title: action.payload, date_created: id }),
        },
        todo: [...state.todo, id],
      };
    }
    case TodoActions.DELETE: {
      return {
        ...state,
        deleted: [...state.deleted, action.payload],
        todo: state.todo.filter((taskId) => taskId != action.payload),
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
    default:
      return state;
  }
}

export { todoReducer, TodoActions };
export type { TodoActionType, State };
