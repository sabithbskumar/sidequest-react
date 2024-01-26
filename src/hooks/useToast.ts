import { useEffect, useState } from "react";

function useToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [timeoutId, setTimeoutId] = useState<number>();

  const showToast = (message: string, duration = 3000) => {
    setMessage(message);
    setIsVisible(true);

    if (timeoutId) clearTimeout(timeoutId);

    const id = setTimeout(() => {
      setIsVisible(false);
    }, duration);
    setTimeoutId(id);
  };

  const onClose = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  return { showToast, toastState: { isVisible, message, onClose } };
}

export default useToast;
