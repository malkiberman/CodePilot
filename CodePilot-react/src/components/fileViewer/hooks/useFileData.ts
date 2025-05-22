import { useState, useEffect } from "react";
import { getFileById, getFileVersions } from "../services/codeFileService";
import { fetchFileContent } from "../services/codeFileService";

export const useFileData = (fileId: string | undefined) => {
  const [fileData, setFileData] = useState(null);
  const [displayedContent, setDisplayedContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVersionContentByPath = async (filePath: string): Promise<string> =>
    await fetchFileContent(filePath);

  useEffect(() => {
    const fetchData = async () => {
      if (!fileId) {
        setError("No file ID provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const id = Number(fileId);
        const file = await getFileById(id);
        const versions = await getFileVersions(id);
        const fileInfo = {
          id,
          name: file.fileName,
          filePath: file.filePath,
          versions: versions.map((v) => ({ versionId: v.versionId, filePath: v.filePath })),
        };
        setFileData(fileInfo);

        if (fileInfo.versions.length > 0) {
          const content = await fetchFileContent(fileInfo.versions[0].filePath);
          setDisplayedContent(content);
        } else {
          const content = await fetchFileContent(file.filePath);
          setDisplayedContent(content);
        }
      } catch (e: any) {
        setError("Failed to load file data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fileId]);

  return { fileData, displayedContent, fetchVersionContentByPath, setDisplayedContent, loading, error };
};
