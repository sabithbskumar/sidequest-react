import { FormEvent, useReducer, useState } from "react";
import "./App.css";

interface Task {
  title: string;
  id: string;
  completed?: boolean;
}

function createTask({ title, id, completed }: Task) {
  return { title, id, completed };
}

enum TodoActionType {
  CREATE = "CREATE",
  DELETE = "DELETE",
  TOGGLE = "TOGGLE",
}

interface TodoAction {
  type: TodoActionType;
  payload: string;
}

function todoReducer(state: Task[], action: TodoAction) {
  switch (action.type) {
    case TodoActionType.CREATE:
      return [
        ...state,
        createTask({ title: action.payload, id: Date.now().toString() }),
      ];
    case TodoActionType.DELETE:
      return state.filter((task) => task.id !== action.payload);
    case TodoActionType.TOGGLE:
      return state.map((task) => {
        if (task.id === action.payload)
          return { ...task, completed: !task.completed };
        return task;
      });
    default:
      return state;
  }
}
function App() {
  const [tasks, dispatch] = useReducer(todoReducer, []);

  const [taskName, setTaskName] = useState("");

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (taskName.trim() === "") return;
    dispatch({ type: TodoActionType.CREATE, payload: taskName });
    setTaskName("");
  }

  return (
    <div className="bg-neutral-800 text-neutral-50 flex flex-col h-full">
      <header className="bg-neutral-600 shrink-0">
        <div className="py-2">
          <span className="text-3xl px-6">SideQuest</span>
        </div>
      </header>
      <div className="grow overflow-hidden">
        <div className="h-full p-2 overflow-y-auto">
          <form onSubmit={handleAdd} className="flex p-2 max-w-lg m-auto">
            <input
              type="text"
              className="grow px-4 py-2 text-neutral-600 outline-none"
              placeholder="Task name"
              value={taskName}
              onChange={(e) => {
                setTaskName(e.target.value);
              }}
            />
            <input
              type="submit"
              value="Add"
              className="bg-neutral-500 px-4 py-2"
            />
          </form>
          <ul className="list-disc">
            {tasks.map(({ id, title, completed }) => (
              <div key={id} className="p-4">
                <input
                  id={id}
                  type="checkbox"
                  checked={completed}
                  onChange={() => {
                    dispatch({
                      type: TodoActionType.TOGGLE,
                      payload: id,
                    });
                  }}
                />
                <label
                  htmlFor={id}
                  className={`px-2 font-bold${
                    completed ? " text-green-500" : " text-orange-500"
                  }`}
                >
                  {title}
                </label>
                <button
                  className={`opacity-0 hover:opacity-100`}
                  onClick={() => {
                    dispatch({
                      type: TodoActionType.DELETE,
                      payload: id,
                    });
                  }}
                >
                  x
                </button>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
