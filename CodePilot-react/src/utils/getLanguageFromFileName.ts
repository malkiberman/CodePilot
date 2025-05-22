export const getLanguageFromFileName = (fileName?: string | null): string => {
  if (!fileName) return "csharp";
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "js": return "javascript";
    case "ts": return "typescript";
    case "py": return "python";
    case "java": return "java";
    case "cpp": return "cpp";
    case "cs": return "csharp";
    case "html": return "html";
    case "css": return "css";
    case "json": return "json";
    default: return "csharp";
  }
};
