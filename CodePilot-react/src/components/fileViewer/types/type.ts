export interface FileDiffViewerProps {
  fileName: string;
  version1: string;
  version2: string;
}

export interface FileDiffResult {
  diff: any[] | null;
  language: string;
}
