import { ReactNode } from "react";
import type { Task } from "../../features/todo";

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
  const { title, completed } = task;
  return (
    <div className="group/task rounded flex justify-between bg-neutral-600 bg-opacity-20 hover:bg-opacity-80 shadow-sm max-w-5xl h-14 overflow-clip">
      <div className="grow p-2 h-full inline-flex items-center gap-2 overflow-hidden">
        <input
          type="checkbox"
          checked={completed}
          className="accent-green-400 m-2 size-4 shrink-0"
          onChange={() => {
            onToggle(id);
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
      <div className="shrink-0 max-w-0 group-hover/task:max-w-28 group-focus-within/task:max-w-28 transition-[max-width]">
        <div className="ml-auto h-full inline-flex">
          {actions.map((action, key) => {
            return (
              <button
                key={key}
                type="button"
                className="outline-none text-neutral-400 hover:text-white focus:ring-inset focus:ring rounded"
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
  );
}

export { TaskItem };
