import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { FC, useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface AlertsProps {
  title?: string;
  message: string | undefined;
  variant?: "default" | "destructive" | "success";
  Icon?: FC<{ className: string }>;
  onClose?: () => void;
}

export default function Alerts({
  title,
  message,
  variant = "default",
  Icon,
  onClose,
}: AlertsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [messageKey, setMessageKey] = useState(0);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  }, [onClose]);

  // Trigger alert visibility and key change when message changes (even if same content)
  useEffect(() => {
    if (message) {
      setIsVisible(true);
      setMessageKey((prev) => prev + 1); // Increment key to force re-render
    }
  }, [message]);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      handleClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, [messageKey, handleClose, message]); // Depend on messageKey to reset timer

  if (!isVisible || !message) return null;

  return (
    <Alert
      key={messageKey} // Force re-render using messageKey
      variant={variant}
      className={`w-64 absolute top-8 right-8 pr-8 ${
        isVisible ? "animate-slide-in-right" : "animate-fade-out"
      }`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 p-1 hover:bg-zinc-100 rounded-full dark:hover:bg-zinc-800"
      >
        <X className="h-4 w-4" />
      </button>
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
