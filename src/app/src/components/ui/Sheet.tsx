import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface SheetContextValue {
  open: boolean;
  onClose: () => void;
}

const SheetContext = createContext<SheetContextValue>({
  open: false,
  onClose: () => {},
});

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Sheet({ open, onClose, children }: SheetProps) {
  return (
    <SheetContext.Provider value={{ open, onClose }}>
      {children}
    </SheetContext.Provider>
  );
}

export function SheetOverlay() {
  const { open, onClose } = useContext(SheetContext);
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-40 bg-black/60"
      onClick={onClose}
      aria-hidden="true"
    />,
    document.body
  );
}

interface SheetContentProps {
  side?: "left" | "right";
  className?: string;
  "aria-label"?: string;
  children: ReactNode;
}

export function SheetContent({
  side = "left",
  className,
  "aria-label": ariaLabel,
  children,
}: SheetContentProps) {
  const { open, onClose } = useContext(SheetContext);

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className={cn(
        "fixed top-0 z-50 flex h-full w-72 flex-col border-r border-border bg-background shadow-lg",
        side === "left" ? "left-0" : "right-0",
        className
      )}
    >
      <button
        onClick={onClose}
        className="absolute right-3 top-3 rounded-sm p-1 text-muted-foreground hover:text-foreground"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
      {children}
    </div>,
    document.body
  );
}

export function SheetHeader({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("px-4 pt-4 pb-2", className)}>{children}</div>
  );
}

export function SheetTitle({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <h2 className={cn("text-sm font-semibold text-muted-foreground", className)}>
      {children}
    </h2>
  );
}
