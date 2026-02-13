import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface CalloutProps {
  type?: "info" | "warning" | "danger";
  children: ReactNode;
}

const styles = {
  info: "border-blue-500/40 bg-blue-50 text-blue-900 dark:bg-blue-950/30 dark:text-blue-200",
  warning: "border-yellow-500/40 bg-yellow-50 text-yellow-900 dark:bg-yellow-950/30 dark:text-yellow-200",
  danger: "border-red-500/40 bg-red-50 text-red-900 dark:bg-red-950/30 dark:text-red-200",
};

const labels: Record<string, string> = {
  info: "Info",
  warning: "Warning",
  danger: "Danger",
};

export function Callout({ type = "info", children }: CalloutProps) {
  return (
    <div className={cn("my-4 rounded-md border-l-4 p-4", styles[type])}>
      <p className="mb-1 text-sm font-semibold">{labels[type]}</p>
      <div className="text-sm [&>p]:m-0">{children}</div>
    </div>
  );
}
