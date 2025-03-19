import React, { useState, useEffect, JSX } from "react";
import { diffLines } from "diff";
import { Card, Typography, Button, Select, Spin } from "antd";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getFileById, getFileVersions } from "../services/codeFileService";
import { useParams } from "react-router-dom";

const { Title } = Typography;

interface Version {
  versionId: number;
  content: string;
  filePath: string; 
}

interface FileData {
  id: number;
  name: string;
  content: string;
  versions: Version[];
}

const FileViewer: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);
  const [diffResult, setDiffResult] = useState<JSX.Element | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // פונקציה לשליפת תוכן קובץ מ-S3
  const fetchFileContent = async (url: string) => {
    console.log(`🔍 שולח בקשה ל-${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      console.error("❌ לא ניתן להוריד את התוכן של הקובץ", response);
      throw new Error("לא ניתן להוריד את התוכן של הקובץ");
    }
    const text = await response.text();
    console.log("✅ תוכן הקובץ הורד בהצלחה");
    return text;
  };
  

  useEffect(() => {
    if (!fileId) {
      console.warn("❌ fileId אינו קיים!");
      return;
    }

    console.log("✅ useEffect הופעל עם fileId:", fileId);

    const fetchData = async () => {
      console.log("📡 התחלת שליפת הנתונים עבור fileId:", fileId);
      setLoading(true);

      try {
        const numericFileId = parseInt(fileId, 10);
        if (isNaN(numericFileId)) {
          console.error("❌ fileId אינו מספר תקין!", fileId);
          return;
        }

        console.log("🔍 שולח בקשה ל-getFileById...");
        const fileResponse = await getFileById(numericFileId);
        console.log("✅ קיבלנו תשובה מ-getFileById:", fileResponse);

        console.log("🔍 שולח בקשה ל-getFileVersions...");
        const versionsResponse = await getFileVersions(numericFileId);
        console.log("✅ קיבלנו תשובה מ-getFileVersions:", versionsResponse);

        if (!fileResponse ) {
          console.error("❌ fileResponse חסר נתונים!", fileResponse);
          return;
        }

        // הורדת תוכן הקובץ מ-S3
        const content = await fetchFileContent(fileResponse);

        const versions = versionsResponse?.map((version: any) => ({
          versionId: version.versionId,
          content: version.fileContent || "",
          filePath: version.filePath,  // ��ו��פת ��כו��ת ��ו���� המתאי��ה ל��ר��ה
        })) || [];

        setFileData({
          id: numericFileId,
          name: fileResponse.fileName,
          content: content,
          versions: versions,
        });

        console.log("✅ הנתונים נשמרו ב-state!");
      } catch (error) {
        console.error("❌ שגיאה במהלך שליפת הנתונים:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fileId]);


      
      
      
             
  const fetchVersionContent = async (versionId: number) => {
    console.log(`🔍 שולח בקשה ל-S3 להורדת תוכן גרסה עם id: ${versionId}`);
    console.log("file data: " + fileData?.versions);
    
const url = fileData?.versions[versionId-1].filePath;
console.log("url "+url);

    const response = await fetch(url||"");
    if (!response.ok) {
      console.error("❌ לא ניתן להוריד את התוכן של הגרסה", response);
      throw new Error("לא ניתן להוריד את התוכן של הגרסה");
    }
    const text = await response.text();
    console.log("✅ תוכן הגרסה הורד בהצלחה");
    return text;
  };
  const handleCompare = async () => {
    if (!fileData || selectedVersionId === null) {
      console.warn("⚠️ לא ניתן לבצע השוואה - הנתונים חסרים!");
      return;
    }
  
    const versionContent = await fetchVersionContent(selectedVersionId);
    
    if (!versionContent) {
      console.warn("⚠️ לא נמצאה גרסה מתאימה להשוואה!");
      return;
    }
  
    const diff = diffLines(fileData.content, versionContent);
    const diffDisplay = (
      <pre>
        {diff.map((part, index) => (
          <span
            key={index}
            style={{
              color: part.added ? "green" : part.removed ? "red" : "black",
              backgroundColor: part.added ? "#d4f8d4" : part.removed ? "#f8d4d4" : "transparent",
            }}
          >
            {part.value}
          </span>
        ))}
      </pre>
    );
    setDiffResult(diffDisplay);
  };
  
  

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Spin size="large" />
        <Typography>⏳ טוען קובץ...</Typography>
      </div>
    );
  }

  if (!fileData) {
    return (
      <Typography style={{ color: "red", textAlign: "center" }}>
        ❌ שגיאה בטעינת הקובץ. אנא נסה שוב.
      </Typography>
    );
  }

  return (
    <Card style={{ maxWidth: "90%", margin: "2rem auto", padding: "2rem" }} hoverable>
      <Title level={4} style={{ textAlign: "center" }}>{fileData.name}</Title>

      {/* בחירת גרסה להשוואה */}
      <Select
        style={{ width: '100%', marginBottom: '16px' }}
        onChange={(value) => {
          console.log("📌 נבחרה גרסה:", value);
          setSelectedVersionId(value);
        }}
        placeholder="בחר גרסה להשוואה"
      >
        {fileData.versions.map((version, index) => (
          <Select.Option key={version.versionId} value={version.versionId}>
            גרסה {index + 1}
          </Select.Option>
        ))}
      </Select>

      {/* הצגת תוכן הקובץ הנוכחי */}
      <div>
        <Title level={5}>קובץ נוכחי</Title>
        <SyntaxHighlighter language="csharp" style={oneLight} showLineNumbers>
          {fileData.content || "// אין תוכן להצגה"}
        </SyntaxHighlighter>
      </div>

      {/* הצגת תוכן הגרסה הנבחרת */}
      {selectedVersionId && (
        <div>
          <Title level={5}>גרסה נבחרת</Title>
          <SyntaxHighlighter language="csharp" style={oneLight} showLineNumbers>
            {fileData.versions.find(v => v.versionId === selectedVersionId)?.content || "// אין תוכן לגרסה"}
          </SyntaxHighlighter>
        </div>
      )}

      <Button type="primary" onClick={handleCompare} style={{ marginTop: '16px' }}>
        🔍 השווה גרסאות
      </Button>

      <div style={{ marginTop: '16px' }}>
        <h4>🔍 השוואת שינויים:</h4>
        {diffResult || <Typography>אין שינויים להצגה</Typography>}
      </div>
    </Card>
  );
};

export default FileViewer;
