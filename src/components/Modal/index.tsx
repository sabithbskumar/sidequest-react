import { ReactNode } from "react";

interface ModalProps {
  children?: ReactNode;
  isVisible: boolean;
}

function Modal({ children, isVisible }: ModalProps) {
  if (!isVisible) return <></>;
  return (
    <div className="bg-neutral-900/50 absolute flex inset-0 backdrop-blur-sm shadow-md">
      <div className="grow max-w-2xl max-h-full mx-auto p-5">
        <div className="w-full h-full bg-neutral-500/50 py-4 rounded-lg flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}

export { Modal };
