import type { ReactNode } from "react";
import type { Manifest } from "../../types/manifest";
import type { Theme } from "../../App";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  manifest: Manifest;
  theme: Theme;
  onToggleTheme: () => void;
  children: ReactNode;
}

export function Layout({ manifest, theme, onToggleTheme, children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <Header repoName={manifest.repoName} theme={theme} onToggleTheme={onToggleTheme} />
      <div className="flex">
        <Sidebar docs={manifest.docs} />
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-4xl p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
