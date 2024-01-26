import { useEffect, useReducer, useState } from "react";
import { State, TodoActions, todoReducer } from "../../features/todo";
import AddIcon from "~icons/material-symbols-light/add";
import { Modal } from "../Modal";
import { TabBar } from "../TabBar";
import { Toast } from "../Toast";
import useToast from "../../hooks/useToast";
import { TaskForm, TaskFormData } from "./TaskForm";

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

  const { showToast, toastState } = useToast();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editTaskId, setEditTaskId] = useState("");

  enum Pages {
    TODO = "TODO",
    TRASH = "TRASH",
  }
  const [page, setPage] = useState(Pages.TODO);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  function getList() {
    switch (page) {
      case Pages.TODO: {
        return tasks.todo;
      }
      case Pages.TRASH: {
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
      showToast(`Task Updated: ${title}`);
    } else {
      dispatch({
        type: TodoActions.CREATE,
        payload: { title },
      });
      showToast(`Task Created: ${title}`);
    }
  }

  return (
    <div className="flex flex-col w-full max-h-full h-full relative">
      <div className="shrink-0">
        <TabBar
          options={[
            {
              label: "ToDo",
              value: Pages.TODO,
            },
            {
              label: "Trash",
              value: Pages.TRASH,
            },
          ]}
          name="page"
          value={page}
          onChange={(value) => {
            setPage(value as Pages);
          }}
        />
      </div>
      <div className="grow overflow-y-auto h-full max-h-full break-all flex flex-col gap-2 px-2 pt-2 pb-[5.5rem]">
        {getList().map((id) => {
          const { title, completed } = tasks.tasks[id];
          return (
            <div
              key={id}
              className="py-3 px-2 group/task rounded flex bg-neutral-600 bg-opacity-20 hover:bg-opacity-80 shadow-sm items-center max-w-5xl"
            >
              <input
                type="checkbox"
                checked={completed}
                className="accent-green-400 m-2 size-4 shrink-0"
                onChange={() => {
                  dispatch({
                    type: TodoActions.TOGGLE,
                    payload: id,
                  });
                }}
              />
              <span
                className={`px-1 font-bold truncate${
                  completed ? " text-green-500" : " text-sky-500"
                }`}
              >
                {title}
              </span>
              <div className="ml-auto hidden group-hover/task:inline-flex">
                <input
                  type="button"
                  className="px-2 cursor-pointer"
                  onClick={() => {
                    setEditTaskId(id);
                    setIsModalVisible(true);
                  }}
                  value="Edit"
                />
                <input
                  className="px-2 cursor-pointer"
                  value={tasks.deleted.includes(id) ? "Restore" : "Delete"}
                  type="button"
                  onClick={() => {
                    if (tasks.deleted.includes(id)) {
                      dispatch({
                        type: TodoActions.RESTORE,
                        payload: id,
                      });
                      showToast(`Task Restored: ${title}`);
                    } else {
                      dispatch({
                        type: TodoActions.DELETE,
                        payload: id,
                      });
                      showToast(`Task Deleted: ${title}`);
                    }
                  }}
                />
              </div>
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
              primaryLabel: "Save",
            }}
            onCancel={() => {
              setEditTaskId("");
              setIsModalVisible(false);
            }}
            onSubmit={handleSubmit}
          />
        )}
      </Modal>
      <Toast {...toastState} />
    </div>
  );
}

export { TodoList };
