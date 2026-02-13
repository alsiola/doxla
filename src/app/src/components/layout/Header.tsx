import { useState } from "react";
import { Search, BookOpen, Sun, Moon } from "lucide-react";
import type { Theme } from "../../App";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface HeaderProps {
  repoName: string;
  theme: Theme;
  onToggleTheme: () => void;
}

export function Header({ repoName, theme, onToggleTheme }: HeaderProps) {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      window.location.hash = `/search?q=${encodeURIComponent(searchInput.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border bg-background px-6">
      <a href="#/" className="flex items-center gap-2 font-semibold">
        <BookOpen className="h-5 w-5" />
        <span>{repoName}</span>
      </a>

      <form onSubmit={handleSearch} className="ml-auto flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search docs..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-64 pl-9"
          />
        </div>
        <Button type="submit" size="sm">
          Search
        </Button>
      </form>

      <Button
        size="sm"
        variant="ghost"
        onClick={onToggleTheme}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    </header>
  );
}
