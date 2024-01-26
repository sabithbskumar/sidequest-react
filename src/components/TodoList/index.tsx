import { useEffect, useReducer, useState } from "react";
import { State, TodoActions, todoReducer } from "../../features/todo";
import AddIcon from "~icons/material-symbols-light/add";
import { Modal } from "../Modal";
import { TabBar } from "../TabBar";
import { Toast } from "../Toast";
import useToast from "../../hooks/useToast";
import { TaskForm, TaskFormData } from "./TaskForm";
import EditIcon from "~icons/material-symbols-light/edit-rounded";
import DeleteIcon from "~icons/material-symbols-light/delete-rounded";
import RestoreIcon from "~icons/material-symbols-light/restore-from-trash-rounded";

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
              className="group/task rounded flex justify-between bg-neutral-600 bg-opacity-20 hover:bg-opacity-80 shadow-sm max-w-5xl h-14 overflow-clip"
            >
              <div className="grow p-2 h-full inline-flex items-center gap-2 overflow-hidden">
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
                  className={`font-bold truncate ${
                    completed ? "text-green-500" : "text-sky-500"
                  }`}
                >
                  {title}
                </span>
              </div>
              <div className="shrink-0 max-w-0 group-hover/task:max-w-28 group-hover/task:w-28 group-focus-within/task:max-w-28 group-focus-within/task:w-28 transition-[max-width]">
                <div className="ml-auto h-full inline-flex">
                  <button
                    type="button"
                    className="outline-none text-neutral-400 hover:text-white focus:ring-inset focus:ring rounded"
                    onClick={() => {
                      setEditTaskId(id);
                      setIsModalVisible(true);
                    }}
                  >
                    <EditIcon className="size-14 p-3 shrink-0" />
                  </button>
                  {tasks.deleted.includes(id) ? (
                    <button
                      className="outline-none text-neutral-400 hover:text-white focus:ring-inset focus:ring rounded"
                      type="button"
                      onClick={() => {
                        dispatch({
                          type: TodoActions.RESTORE,
                          payload: id,
                        });
                        showToast(`Task Restored: ${title}`);
                      }}
                    >
                      <RestoreIcon className="size-14 p-3 shrink-0" />
                    </button>
                  ) : (
                    <button
                      className="outline-none text-neutral-400 hover:text-red-500 focus:ring-inset focus:ring rounded"
                      type="button"
                      onClick={() => {
                        dispatch({
                          type: TodoActions.DELETE,
                          payload: id,
                        });
                        showToast(`Task Deleted: ${title}`);
                      }}
                    >
                      <DeleteIcon className="size-14 p-3 shrink-0" />
                    </button>
                  )}
                </div>
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
