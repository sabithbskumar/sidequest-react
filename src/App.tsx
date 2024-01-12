import { FormEvent, useEffect, useReducer, useState } from "react";
import "./App.css";
import { State, TodoActions, todoReducer } from "./features/todo";

function App() {
  const defaultState = {
    todo: [],
    deleted: [],
    tasks: {},
  };

  const storedTasks = localStorage.getItem("tasks");
  const initialState = storedTasks
    ? (JSON.parse(storedTasks) as State)
    : defaultState;

  const [tasks, dispatch] = useReducer(todoReducer, initialState);
  const [taskName, setTaskName] = useState("");

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (taskName.trim() === "") return;
    dispatch({ type: TodoActions.CREATE, payload: taskName });
    setTaskName("");
  }

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  enum Filters {
    TODO = "TODO",
    TRASH = "TRASH",
  }
  const [filter, setFilter] = useState(Filters.TODO);

  function getList() {
    switch (filter) {
      case Filters.TODO: {
        return tasks.todo;
      }
      case Filters.TRASH: {
        return tasks.deleted;
      }
    }
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
          <div className="flex gap-2 px-4">
            <label>
              <input
                type="radio"
                name="filter"
                value={Filters.TODO}
                checked={filter === Filters.TODO}
                onChange={(e) => {
                  setFilter(e.target.value as Filters);
                }}
              />
              <span className="p-2">ToDo</span>
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="filter"
                value={Filters.TRASH}
                checked={filter === Filters.TRASH}
                onChange={(e) => {
                  setFilter(e.target.value as Filters);
                }}
              />
              <span className="p-2">Trash</span>
            </label>
            <br />
          </div>
          <ul className="list-disc">
            {getList().map((id) => {
              const { title, completed } = tasks.tasks[id];
              return (
                <div key={id} className="px-4 py-2 group/task">
                  <input
                    id={id}
                    type="checkbox"
                    checked={completed}
                    onChange={() => {
                      dispatch({
                        type: TodoActions.TOGGLE,
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
                    className={`opacity-0 group-hover/task:opacity-100 px-2`}
                    onClick={() => {
                      const newTitle = prompt("Task name", title);
                      if (newTitle)
                        dispatch({
                          type: TodoActions.UPDATE,
                          payload: {
                            id,
                            title: newTitle,
                          },
                        });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className={`opacity-0 group-hover/task:opacity-100 px-2`}
                    onClick={() => {
                      dispatch({
                        type: TodoActions.DELETE,
                        payload: id,
                      });
                    }}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
