import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "../ui/Button";
import {
  Sheet,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/Sheet";
import { ScrollArea } from "../ui/ScrollArea";
import { FileTree } from "../FileTree";
import type { DocFile } from "../../types/manifest";

interface MobileNavProps {
  docs: DocFile[];
}

export function MobileNav({ docs }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, [open]);

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        className="md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Sheet open={open} onClose={() => setOpen(false)}>
        <SheetOverlay />
        <SheetContent side="left" aria-label="Navigation menu">
          <SheetHeader>
            <SheetTitle>Documents</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1 px-3 pb-4">
            <FileTree docs={docs} />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
