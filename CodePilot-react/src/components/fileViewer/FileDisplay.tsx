// src/components/FileDisplay.tsx
import React from "react";
import { Paper } from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { light } from "react-syntax-highlighter/dist/esm/styles/prism";

interface FileDisplayProps {
  fileData: { name: string; content: string; versions?: { id: string; createdAt: Date }[] };
  displayedContent: string;
  comparedContent: string;
  diff: any; // התאם לסוג ה-diff
  isDarkMode: boolean;
  language: string;
  isComparing: boolean;
  selectedVersionId: string | null;
  onCompare: (versionId: string) => void;
  onStartCompare: () => void;
  onStopCompare: () => void;
}

export const FileDisplay: React.FC<FileDisplayProps> = ({
  fileData,
  displayedContent,
  comparedContent,
  diff,
  isDarkMode,
  language,
  isComparing,
  selectedVersionId,
  onCompare,
  onStartCompare,
  onStopCompare,
}) => {
  const syntaxHighlighterStyle = isDarkMode ? dracula : light;

  return (
    <Paper elevation={3} className="file-display">
      <h3>{fileData.name}</h3>
      {fileData.versions && fileData.versions.length > 0 && !isComparing && (
        <button onClick={onStartCompare}>השווה גרסאות</button>
      )}

      {isComparing && fileData.versions && (
        <div>
          <select
            value={selectedVersionId || ""}
            onChange={(e) => onCompare(e.target.value)}
          >
            <option value="">בחר גרסה להשוואה</option>
            {fileData.versions.map((version) => (
              <option key={version.id} value={version.id}>
                {version.id} ({version.createdAt.toLocaleDateString()})
              </option>
            ))}
          </select>
          <button onClick={onStopCompare}>סיים השוואה</button>
        </div>
      )}

      <div className="code-container">
        <SyntaxHighlighter language={language} style={syntaxHighlighterStyle}>
          {displayedContent}
        </SyntaxHighlighter>
        {isComparing && comparedContent && (
          <div className="compared-code">
            <SyntaxHighlighter language={language} style={syntaxHighlighterStyle}>
              {comparedContent}
            </SyntaxHighlighter>
          </div>
        )}
        {diff && (
          <div className="diff-view">
            {/* הצגת ההבדלים כאן */}
            <pre>{JSON.stringify(diff, null, 2)}</pre>
          </div>
        )}
      </div>
    </Paper>
  );
};