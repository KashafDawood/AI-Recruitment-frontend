import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { FC } from "react";

interface AlertsProps {
  title?: string;
  message: string | undefined;
  variant?: "default" | "destructive" | "success";
  Icon?: FC<{ className: string }>;
}

export default function Alerts({
  title,
  message,
  variant = "default",
  Icon,
}: AlertsProps) {
  return (
    <Alert
      variant={variant}
      className="w-64 animate-slide-in-right absolute top-8 right-8"
    >
      {Icon && <Icon className="h-4 w-4" />}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
