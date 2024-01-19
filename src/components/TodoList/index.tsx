import { ChangeEvent, FormEvent, useEffect, useReducer, useState } from "react";
import { State, TodoActions, todoReducer } from "../../features/todo";
import AddIcon from "~icons/material-symbols-light/add";
import { Modal } from "../Modal";

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

  function handleSubmit(taskData: TaskFormData) {
    const { id, title } = taskData;
    if (id) {
      dispatch({
        type: TodoActions.UPDATE,
        payload: { id, title },
      });
    } else {
      dispatch({
        type: TodoActions.CREATE,
        payload: { title },
      });
    }
  }

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editTaskId, setEditTaskId] = useState("");

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
                  setEditTaskId(id);
                  setIsModalVisible(true);
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
      <Modal isVisible={isModalVisible}>
        {editTaskId === "" ? (
          <TaskForm
            taskData={{ title: "" }}
            formOptions={{
              heading: "New Task",
              primaryLabel: "Add",
            }}
            onCancel={() => {
              setIsModalVisible(false);
            }}
            onSubmit={handleSubmit}
          />
        ) : (
          <TaskForm
            taskData={{ id: editTaskId, title: tasks.tasks[editTaskId].title }}
            formOptions={{
              heading: "Edit Task",
              primaryLabel: "Edit",
            }}
            onCancel={() => {
              setEditTaskId("");
              setIsModalVisible(false);
            }}
            onSubmit={handleSubmit}
          />
        )}
      </Modal>
    </div>
  );
}

interface TaskFormData {
  id?: string;
  title: string;
}

interface TaskFormProps {
  formOptions: {
    heading: string;
    primaryLabel: string;
  };
  taskData: TaskFormData;
  onCancel: () => void;
  onSubmit: (_: TaskFormData) => void;
}

function TaskForm({
  formOptions,
  taskData,
  onCancel,
  onSubmit,
}: TaskFormProps) {
  const initialValues = { ...taskData };
  const [formValues, setFormValues] = useState(initialValues);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormValues((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(formValues);
    setFormValues(initialValues);
    onCancel();
  }

  return (
    <>
      <h2 className="text-center pt-2 pb-6 text-2xl">{formOptions.heading}</h2>
      <form
        onSubmit={handleSubmit}
        className="m-auto px-4 w-full grow flex flex-col justify-between"
      >
        <input
          type="text"
          className="w-full p-4 rounded text-neutral-600 outline-none"
          placeholder="Task name"
          name="title"
          value={formValues.title}
          onChange={handleChange}
          required={true}
          autoFocus={true}
        />
        <div className="flex gap-4">
          <input
            type="button"
            value="Cancel"
            className="bg-neutral-500 px-4 w-full p-4 rounded cursor-pointer"
            onClick={onCancel}
          />
          <input
            type="submit"
            value={formOptions.primaryLabel}
            className="bg-blue-500 px-4 w-full p-4 rounded cursor-pointer"
          />
        </div>
      </form>
    </>
  );
}

export { TodoList };
