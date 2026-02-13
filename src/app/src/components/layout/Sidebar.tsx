import { ScrollArea } from "../ui/ScrollArea";
import { FileTree } from "../FileTree";
import type { DocFile } from "../../types/manifest";

interface SidebarProps {
  docs: DocFile[];
}

export function Sidebar({ docs }: SidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border md:block">
      <ScrollArea className="h-[calc(100vh-3.5rem)] py-4">
        <div className="px-3">
          <h2 className="mb-2 px-2 text-sm font-semibold text-muted-foreground">
            Documents
          </h2>
          <FileTree docs={docs} />
        </div>
      </ScrollArea>
    </aside>
  );
}
