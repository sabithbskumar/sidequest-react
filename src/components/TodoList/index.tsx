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
import { TaskItem } from "./TaskItem";

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
    const { id, ...data } = taskData;
    if (id) {
      dispatch({
        type: TodoActions.UPDATE,
        payload: { id, ...data },
      });
      showToast(`Task Updated: ${data.title}`);
    } else {
      dispatch({
        type: TodoActions.CREATE,
        payload: { ...data },
      });
      showToast(`Task Created: ${data.title}`);
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
          const task = tasks.tasks[id];
          return (
            <TaskItem
              key={id}
              id={id}
              task={task}
              onToggle={() => {
                dispatch({
                  type: TodoActions.TOGGLE,
                  payload: id,
                });
              }}
              actions={[
                {
                  icon: <EditIcon className="size-14 p-3 shrink-0" />,
                  onClick: (id) => {
                    setEditTaskId(id);
                    setIsModalVisible(true);
                  },
                },

                tasks.deleted.includes(id)
                  ? {
                      icon: <RestoreIcon className="size-14 p-3 shrink-0" />,
                      onClick: (id) => {
                        dispatch({
                          type: TodoActions.RESTORE,
                          payload: id,
                        });
                        showToast(`Task Restored: ${task.title}`);
                      },
                    }
                  : {
                      icon: (
                        <DeleteIcon className="size-14 p-3 shrink-0 hover:text-red-500" />
                      ),
                      onClick: (id) => {
                        dispatch({
                          type: TodoActions.DELETE,
                          payload: id,
                        });
                        showToast(`Task Deleted: ${task.title}`);
                      },
                    },
              ]}
            />
          );
        })}
      </div>
      <button
        className="size-14 bg-blue-500 absolute rounded-2xl right-4 bottom-4"
        onClick={() => {
          setIsModalVisible(true);
        }}
      >
        <AddIcon className="w-auto h-full p-2 shrink-0" />
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
            taskData={{ id: editTaskId, ...tasks.tasks[editTaskId] }}
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
