export interface DocFile {
  slug: string;
  path: string;
  title: string;
  content: string;
}

export interface Manifest {
  repoName: string;
  generatedAt: string;
  totalDocs: number;
  docs: DocFile[];
}
