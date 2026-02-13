import { useState, useEffect, useCallback } from "react";
import manifest from "./manifest.json";
import type { Manifest } from "./types/manifest";
import { Layout } from "./components/layout/Layout";
import { IndexPage } from "./components/IndexPage";
import { DocPage } from "./components/DocPage";
import { SearchResults } from "./components/SearchResults";

const data = manifest as Manifest;

type Route =
  | { type: "index" }
  | { type: "doc"; slug: string }
  | { type: "search"; query: string };

function parseHash(): Route {
  const hash = window.location.hash.slice(1) || "/";

  if (hash === "/" || hash === "") {
    return { type: "index" };
  }

  if (hash.startsWith("/doc/")) {
    return { type: "doc", slug: hash.slice(5) };
  }

  if (hash.startsWith("/search")) {
    const params = new URLSearchParams(hash.split("?")[1] || "");
    return { type: "search", query: params.get("q") || "" };
  }

  return { type: "index" };
}

export default function App() {
  const [route, setRoute] = useState<Route>(parseHash);

  const handleHashChange = useCallback(() => {
    setRoute(parseHash());
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [handleHashChange]);

  const renderContent = () => {
    switch (route.type) {
      case "index":
        return <IndexPage docs={data.docs} />;
      case "doc": {
        const doc = data.docs.find((d) => d.slug === route.slug);
        if (!doc) {
          return (
            <div className="p-8">
              <h1 className="text-2xl font-bold">Document not found</h1>
              <p className="mt-2 text-muted-foreground">
                The document &quot;{route.slug}&quot; could not be found.
              </p>
              <a href="#/" className="mt-4 inline-block text-primary underline">
                Back to index
              </a>
            </div>
          );
        }
        return <DocPage doc={doc} />;
      }
      case "search":
        return <SearchResults docs={data.docs} query={route.query} />;
    }
  };

  return (
    <Layout manifest={data}>{renderContent()}</Layout>
  );
}
