import CloseIcon from "~icons/material-symbols-light/close-small-rounded";
import styles from "./styles.module.css";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}
function Toast({ message, isVisible, onClose }: ToastProps) {
  if (isVisible)
    return (
      <div
        className={`fixed left-0 bottom-0 md:left-auto right-0 h-14 m-4 ${styles["fade-up"]}`}
      >
        <div className="bg-black max-w-full md:max-w-lg min-w-full md:min-w-[24em] w-min h-full overflow-clip mx-auto rounded-md flex items-center gap-1 justify-between">
          <span
            className="pl-5 font-semibold truncate text-current"
            title={message}
          >
            {message}
          </span>
          <button className="p-2 shrink-0 size-14" onClick={onClose}>
            <CloseIcon className="w-full h-full transition-colors text-neutral-800 hover:text-neutral-300 focus:text-neutral-300" />
          </button>
        </div>
      </div>
    );
}

export { Toast };
