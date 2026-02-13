export function resolveDocLink(href: string, docPath: string): string | null {
  if (!href.match(/\.mdx?(#.*)?$/i)) return null;
  if (/^https?:\/\//.test(href)) return null;

  const [filePart, anchor] = href.split("#");
  const docDir = docPath.includes("/") ? docPath.replace(/\/[^/]+$/, "") : "";
  const parts = (docDir ? `${docDir}/${filePart}` : filePart).split("/");

  const resolved: string[] = [];
  for (const part of parts) {
    if (part === "..") {
      if (resolved.length > 0) resolved.pop();
      else return null;
    } else if (part !== ".") {
      resolved.push(part);
    }
  }

  const slug = resolved
    .join("/")
    .replace(/\.mdx?$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9/.-]/g, "-");

  if (!slug) return null;

  return `#/doc/${slug}${anchor ? `#${anchor}` : ""}`;
}
