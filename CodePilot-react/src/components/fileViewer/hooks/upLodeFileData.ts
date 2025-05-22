// src/hooks/useFileData.ts
import { useState, useEffect } from "react";

// סוג הנתונים עבור fileData (התאם לפי המבנה האמיתי)
interface FileData {
  id: string;
  name: string;
  content: string;
  versions?: { id: string; createdAt: Date }[];
  // ... שדות נוספים
}

export const useFileData = (fileId: string) => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayedContent, setDisplayedContent] = useState<string>("");

  const fetchFileData = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      // כאן תהיה לוגיקה אמיתית לגשת לנתונים על סמך fileId
      // לדוגמה, קריאה ל-API
      console.log(`Fetching data for file ID: ${id}`);
      // הדמה של טעינה מוצלחת
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockFileData: FileData = {
        id: id,
        name: `example${id}.cs`,
        content: "// קוד לדוגמה",
        versions: [{ id: "v1", createdAt: new Date() }],
      };
      setFileData(mockFileData);
      setDisplayedContent(mockFileData.content);
    } catch (err: any) {
      setError(err.message || "אירעה שגיאה בטעינת נתוני הקובץ.");
      setFileData(null);
      setDisplayedContent("");
    } finally {
      setLoading(false);
    }
  };

  const fetchVersionContentByPath = async (versionId: string) => {
    // לוגיקה לטעינת תוכן של גרסה ספציפית (אם רלוונטי)
    console.log(`Fetching content for version: ${versionId}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return "// תוכן גרסה ספציפית";
  };

  useEffect(() => {
    if (fileId) {
      fetchFileData(fileId);
    }
  }, [fileId]);

  return {
    fileData,
    loading,
    error,
    displayedContent,
    fetchVersionContentByPath,
    setDisplayedContent,
  };
};