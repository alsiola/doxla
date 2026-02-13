import { useState } from "react";
import { ChevronRight, ChevronDown, FileText, Folder } from "lucide-react";
import type { DocFile } from "../types/manifest";
import { cn } from "../lib/utils";

interface TreeNode {
  name: string;
  path: string;
  doc?: DocFile;
  children: Map<string, TreeNode>;
}

function buildTree(docs: DocFile[]): TreeNode {
  const root: TreeNode = { name: "", path: "", children: new Map() };

  for (const doc of docs) {
    const parts = doc.path.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!current.children.has(part)) {
        current.children.set(part, {
          name: part,
          path: parts.slice(0, i + 1).join("/"),
          children: new Map(),
        });
      }
      current = current.children.get(part)!;
    }

    current.doc = doc;
  }

  return root;
}

function TreeItem({
  node,
  depth,
}: {
  node: TreeNode;
  depth: number;
}) {
  const [expanded, setExpanded] = useState(depth < 2);
  const isFolder = node.children.size > 0 && !node.doc;
  const sortedChildren = Array.from(node.children.values()).sort((a, b) => {
    // Folders first, then files
    const aIsFolder = a.children.size > 0 && !a.doc;
    const bIsFolder = b.children.size > 0 && !b.doc;
    if (aIsFolder && !bIsFolder) return -1;
    if (!aIsFolder && bIsFolder) return 1;
    return a.name.localeCompare(b.name);
  });

  if (isFolder) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "flex w-full items-center gap-1 rounded-md px-2 py-1 text-sm hover:bg-accent",
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{node.name}</span>
        </button>
        {expanded && (
          <div>
            {sortedChildren.map((child) => (
              <TreeItem key={child.path} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (node.doc) {
    return (
      <a
        href={`#/doc/${node.doc.slug}`}
        className={cn(
          "flex items-center gap-1 rounded-md px-2 py-1 text-sm hover:bg-accent",
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="truncate">{node.name}</span>
      </a>
    );
  }

  return null;
}

export function FileTree({ docs }: { docs: DocFile[] }) {
  const tree = buildTree(docs);

  const sortedRoots = Array.from(tree.children.values()).sort((a, b) => {
    const aIsFolder = a.children.size > 0 && !a.doc;
    const bIsFolder = b.children.size > 0 && !b.doc;
    if (aIsFolder && !bIsFolder) return -1;
    if (!aIsFolder && bIsFolder) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <nav className="space-y-0.5">
      {sortedRoots.map((node) => (
        <TreeItem key={node.path} node={node} depth={0} />
      ))}
    </nav>
  );
}
