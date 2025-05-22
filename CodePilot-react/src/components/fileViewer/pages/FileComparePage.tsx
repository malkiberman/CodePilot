import { useFileVersionParams } from '../hooks/useFileVersionParams';
import { useFileDiff } from '../hooks/useFileDiff';
import FileDiffViewer from '../components/fileViewer/FileDiffViewer';

export default function FileComparePage() {
  const { fileId, versionId } = useFileVersionParams();
  const { diff } = useFileDiff(fileId, versionId);

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">השוואת גרסאות</h1>
      <FileDiffViewer diff={diff} />
    </div>
  );
}
