import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { diffLines } from 'diff';
import useFileDiff from '../../hooks/useFileDiff';
import { FileDiffViewerProps } from '../../types/type';

const FileDiffViewer: React.FC<FileDiffViewerProps> = ({ fileName, version1, version2 }) => {
  const { diff, language } = useFileDiff(fileName, version1, version2);

  if (!diff) return <p className="text-white">Loading...</p>;

  return (
    <div className="bg-gray-900 text-white rounded-lg p-4">
      <h3 className="text-xl font-semibold mb-2">{fileName}</h3>
      <div className="overflow-x-auto whitespace-pre-wrap">
        {diff.map((part, index) => (
          <div
            key={index}
            className={`px-2 py-1 ${
              part.added ? 'bg-green-800' : part.removed ? 'bg-red-800' : ''
            }`}
          >
            <SyntaxHighlighter language={language} customStyle={{ background: 'transparent', margin: 0 }}>
              {part.value}
            </SyntaxHighlighter>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileDiffViewer;
