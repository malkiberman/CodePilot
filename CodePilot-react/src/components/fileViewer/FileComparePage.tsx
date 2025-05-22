import React from 'react';
import FileDiffViewer from './FileDiffViewer';
import useFileVersionParams from '../../hooks/useFileVersionParams';

const FileComparePage: React.FC = () => {
  const { fileName, version1, version2 } = useFileVersionParams();

  if (!fileName || !version1 || !version2) {
    return <p>Please select a file and two versions to compare.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">Compare Versions</h2>
      <FileDiffViewer fileName={fileName} version1={version1} version2={version2} />
    </div>
  );
};

export default FileComparePage;
