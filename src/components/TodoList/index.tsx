import { FormEvent, useEffect, useReducer, useState } from "react";
import { State, TodoActions, todoReducer } from "../../features/todo";
import AddIcon from "~icons/material-symbols-light/add";

function TodoList() {
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
    setIsModalVisible(false);
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

  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <div className="flex flex-col w-full max-h-full h-full relative">
      <div className="shrink-0">
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
      </div>
      <div className="grow overflow-y-auto h-full max-h-full break-all">
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
              {tasks.deleted.includes(id) ? (
                <button
                  className={`opacity-0 group-hover/task:opacity-100 px-2`}
                  onClick={() => {
                    dispatch({
                      type: TodoActions.RESTORE,
                      payload: id,
                    });
                  }}
                >
                  Restore
                </button>
              ) : (
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
              )}
            </div>
          );
        })}
      </div>
      <button
        className="w-14 h-14 transition-[width] hover:w-48 bg-blue-500 absolute rounded-2xl right-4 bottom-4 group/add flex items-center justify-start"
        onClick={() => {
          setIsModalVisible(true);
        }}
      >
        <AddIcon className="w-auto h-full p-2 shrink-0" />
        <span className="hidden group-hover/add:block whitespace-nowrap text-clip overflow-hidden">
          Add Task
        </span>
      </button>
      {isModalVisible ? (
        <div className="bg-neutral-900/50 absolute flex inset-0 backdrop-blur-sm shadow-md">
          <div className="grow max-w-2xl max-h-full mx-auto p-5">
            <div className="w-full h-full bg-neutral-500/50 py-4 rounded-lg flex flex-col">
              <h2 className="text-center pt-2 pb-6 text-2xl">New Task</h2>
              <form
                onSubmit={handleAdd}
                className="m-auto px-4 w-full grow flex flex-col justify-between"
              >
                <input
                  type="text"
                  className="w-full p-4 rounded text-neutral-600 outline-none"
                  placeholder="Task name"
                  value={taskName}
                  onChange={(e) => {
                    setTaskName(e.target.value);
                  }}
                  autoFocus={true}
                />
                <div className="flex gap-4">
                  <input
                    type="button"
                    value="Cancel"
                    className="bg-neutral-500 px-4 w-full p-4 rounded cursor-pointer"
                    onClick={() => {
                      setIsModalVisible(false);
                    }}
                  />
                  <input
                    type="submit"
                    value="Add"
                    className="bg-blue-500 px-4 w-full p-4 rounded cursor-pointer"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { TodoList };
