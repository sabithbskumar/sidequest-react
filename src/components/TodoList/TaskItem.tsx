import { ReactNode, useState } from "react";
import type { Task } from "../../features/todo";
import CheckedIcon from "~icons/material-symbols-light/check-box-rounded";
import UnCheckedIcon from "~icons/material-symbols-light/check-box-outline-blank";
import ArrowUpIcon from "~icons/material-symbols-light/arrow-drop-up-rounded";

interface ActionButton {
  icon: ReactNode;
  onClick: (id: string) => void;
}

interface TaskItemProps {
  id: string;
  task: Task;
  onToggle: (id: string) => void;
  actions: ActionButton[];
}

function TaskItem({ id, task, onToggle, actions }: TaskItemProps) {
  const { title, description, completed, dateCreated } = task;

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded bg-neutral-500 bg-opacity-20 flex flex-col group/task overflow-clip shrink-0 max-w-5xl">
      <div className="h-14 flex justify-between">
        <div className="size-14 shrink-0">
          <button
            className="h-full w-auto p-4 outline-none focus:ring-inset focus-visible:ring rounded"
            onClick={() => {
              onToggle(id);
            }}
          >
            {completed ? (
              <CheckedIcon className="w-full h-full text-green-400" />
            ) : (
              <UnCheckedIcon className="w-full h-full text-neutral-400" />
            )}
          </button>
        </div>
        <div className="h-full grow overflow-hidden">
          {isExpanded ? (
            <button
              className="h-full w-full text-neutral-500 hover:text-white focus-visible:ring focus:ring-inset rounded"
              onClick={() => {
                setIsExpanded(false);
              }}
            >
              <ArrowUpIcon className="h-full w-auto mx-auto" />
            </button>
          ) : (
            <button
              onClick={() => {
                setIsExpanded(true);
              }}
              className={`h-full w-full font-bold py-2 pr-3 truncate ${
                completed ? "text-green-500" : "text-sky-500"
              } text-left outline-none focus-visible:ring focus:ring-inset rounded`}
            >
              {title}
            </button>
          )}
        </div>
        <div
          className={`h-full w-auto shrink-0 group-hover/task:max-w-28 group-focus-within/task:max-w-28 transition-[max-width] ${
            isExpanded ? "max-w-none" : "max-w-0"
          }`}
        >
          <div className="ml-auto h-full inline-flex">
            {actions.map((action, key) => {
              return (
                <button
                  key={key}
                  type="button"
                  className="outline-none text-neutral-400 hover:text-white focus:ring-inset focus-visible:ring rounded"
                  onClick={() => {
                    action.onClick(id);
                  }}
                >
                  {action.icon}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {isExpanded ? (
        <div className="grow break-normal [overflow-wrap:anywhere]">
          <span
            className={`h-auto inline-block p-4 font-bold ${
              completed ? "text-green-500" : "text-sky-500"
            }`}
          >
            {title}
          </span>
          {description && description !== "" ? (
            <p className="px-4 py-2">{description}</p>
          ) : null}
          <span className="block text-right p-3 font-semibold opacity-50">
            Created on {new Date(parseInt(dateCreated)).toLocaleDateString()}
          </span>
        </div>
      ) : null}
    </div>
  );
}

export { TaskItem };
