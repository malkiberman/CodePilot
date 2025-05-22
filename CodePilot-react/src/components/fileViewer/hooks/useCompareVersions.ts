import { useState } from "react";
import { diffLines } from "diff";

export const useCompareVersions = (
  fileData: any,
  displayedContent: string | null,
  fetchVersionContentByPath: (filePath: string) => Promise<string>
) => {
  const [isComparing, setIsComparing] = useState(false);
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);
  const [comparedContent, setComparedContent] = useState<string | null>(null);
  const [diff, setDiff] = useState<any[]>([]);

  const handleCompare = async (versionId: number | null = null) => {
    setIsComparing(true);
    setSelectedVersionId(versionId);
    setComparedContent(null);
    setDiff([]);

    if (!fileData || !displayedContent || versionId === null) return;

    const filePath = fileData.versions.find((v: any) => v.versionId === versionId)?.filePath;
    if (!filePath) return;

    const content = await fetchVersionContentByPath(filePath);
    setComparedContent(content);
    setDiff(diffLines(displayedContent, content));
  };

  return {
    isComparing,
    selectedVersionId,
    comparedContent,
    diff,
    handleCompare,
    handleStartCompare: () => setIsComparing(true),
    handleStopCompare: () => {
      setIsComparing(false);
      setSelectedVersionId(null);
      setComparedContent(null);
      setDiff([]);
    },
    setComparedContent,
  };
};
