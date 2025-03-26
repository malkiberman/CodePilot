import React, { useState, useEffect } from "react";
import { diffLines } from "diff";
import { Card, Typography, Button, Select, Spin, message, Modal, Row, Col } from "antd";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getFileById, getFileVersions } from "../services/codeFileService";
import { useParams } from "react-router-dom";
import "./FileViewer.css";



interface Version {
  versionId: number;
  filePath: string;
}

interface FileData {
  id: number;
  name: string;
  filePath: string; // הנתיב של הגרסה הנוכחית
  versions: Version[];
}

const FileViewer: React.FC = () => {
    const { fileId } = useParams<{ fileId: string }>();
    const [fileData, setFileData] = useState<FileData | null>(null);
    const [isCompareModalVisible, setIsCompareModalVisible] = useState<boolean>(false);
    const [selectedVersion1Id, setSelectedVersion1Id] = useState<number | null>(0);
    const [selectedVersion2Id, setSelectedVersion2Id] = useState<number | null>(null);
    const [diff, setDiff] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [displayedContent, setDisplayedContent] = useState<string | null>(null); // State לתוכן המוצג

    console.log("FileViewer רכיב נטען");

    const fetchFileContent = async (url: string) => {
        console.log("fetchFileContent: מתחיל הורדה מ:", url);
        const response = await fetch(url);
        console.log("fetchFileContent: סטטוס תגובה:", response.status);
        if (!response.ok) {
            message.error("לא ניתן להוריד את תוכן הקובץ");
            console.error("fetchFileContent: שגיאה בהורדת הקובץ", response.status);
            throw new Error("לא ניתן להוריד את תוכן הקובץ");
        }
        const text = await response.text();
        console.log("fetchFileContent: תוכן הקובץ הוטען (חלקית):", text.substring(0, 100) + "...");
        return text;
    };

    useEffect(() => {
        if (!fileId) {
            console.log("useEffect: fileId לא קיים, יוצא.");
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const numericFileId = parseInt(fileId, 10);
                console.log("useEffect/fetchData: fileId כערך מספרי:", numericFileId);
                if (isNaN(numericFileId)) {
                    console.error("useEffect/fetchData: fileId אינו מספר תקין.");
                    return;
                }

                const fileResponse = await getFileById(numericFileId);
                console.log("useEffect/fetchData: תגובה מ-getFileById:", fileResponse);

                console.log("useEffect/fetchData: קורא ל-getFileVersions עם id:", numericFileId);
                const versionsResponse = await getFileVersions(numericFileId);
                console.log("useEffect/fetchData: תגובה מ-getFileVersions:", versionsResponse);

                console.log("useEffect/fetchData: קורא ל-fetchFileContent עם הנתיב:", fileResponse?.filePath);
                const initialContent = await fetchFileContent(fileResponse);

               
                const versions = versionsResponse?.map((version: any) => {
                  console.log("useEffect/fetchData/map: מעבד גרסה:", version);
                  return {
                      versionId: version.versionId,
                      filePath: version.filePath,
                  };
              }) || [];
              console.log("useEffect/fetchData: גרסאות מעובדות:", versions);
      
              const newFileData = {
                  id: numericFileId,
                  name: fileResponse.fileName,
                  filePath: fileResponse.filePath, // שמירת הנתיב של הגרסה הנוכחית
                  versions: versions,
              };
              console.log("useEffect/fetchData: מעדכן fileData:", newFileData);
              setFileData(newFileData);
      
              // טעינת התוכן של הגרסה האחרונה לתצוגה ראשונית
              if (versions.length > 0) {
                  fetchVersionContentByPath(versions[0].filePath)
                      .then(content => setDisplayedContent(content))
                      .catch(error => console.error("שגיאה בטעינת תוכן הגרסה האחרונה:", error));
              } else {
                  fetchFileContent(fileResponse) // טעינת התוכן הנוכחי אם אין גרסאות
                      .then(content => setDisplayedContent(content))
                      .catch(error => console.error("שגיאה בטעינת תוכן הקובץ הנוכחי:", error));
              }

                // הצגת הגרסה האחרונה אם קיימות גרסאות
                if (versions.length > 0) {
                    setDisplayedContent(versions[versions.length - 1].content);
                } else {
                    setDisplayedContent(initialContent); // אם אין גרסאות, הצג את התוכן הראשוני
                }

            } catch (error) {
                message.error("שגיאה בטעינת הנתונים");
                console.error("useEffect/fetchData: שגיאה בטעינת הנתונים:", error);
            } finally {
                setLoading(false);
                console.log("useEffect/fetchData: טעינת הנתונים הסתיימה.");
            }
        };

        fetchData();
    }, [fileId]);


    const fetchVersionContentByPath = async (filePath: string): Promise<string> => {
      console.log("fetchVersionContentByPath: מתחיל הורדה מ:", filePath);
      const response = await fetch(filePath);
      console.log("fetchVersionContentByPath: סטטוס תגובה:", response.status);
      if (!response.ok) {
          message.error("לא ניתן להוריד את תוכן הגרסה");
          console.error("fetchVersionContentByPath: שגיאה בהורדת הגרסה", response.status);
          throw new Error("לא ניתן להוריד את תוכן הגרסה");
      }
      const text = await response.text();
      console.log("fetchVersionContentByPath: תוכן הגרסה הוטען (חלקית):", text.substring(0, 100) + "...");
      return text;
  };
  const handleCompare = async () => {
    console.log("handleCompare: התחיל השוואה. גרסה 1:", selectedVersion1Id, "גרסה 2:", selectedVersion2Id);
    if (!fileData || selectedVersion1Id === null || selectedVersion2Id === null) {
        console.warn("handleCompare: fileData או אחת מהגרסאות הנבחרות היא null.");
        setDiff([]);
        return;
    }

    const content1Promise = selectedVersion1Id === 0
        ? fetchFileContent(fileData.filePath)
        : fileData.versions.find(v => v.versionId === selectedVersion1Id)?.filePath
            ? fetchVersionContentByPath(fileData.versions.find(v => v.versionId === selectedVersion1Id)!.filePath)
            : Promise.resolve("");

    const content2Promise = fileData.versions.find(v => v.versionId === selectedVersion2Id)?.filePath
        ? fetchVersionContentByPath(fileData.versions.find(v => v.versionId === selectedVersion2Id)!.filePath)
        : Promise.resolve("");

    const [content1, content2] = await Promise.all([content1Promise, content2Promise]);

    console.log("handleCompare: תוכן גרסה 1:", content1 ? content1.substring(0, 100) + "..." : null);
    console.log("handleCompare: תוכן גרסה 2:", content2 ? content2.substring(0, 100) + "..." : null);

    if (!content1 || !content2) {
        console.warn("handleCompare: אחד התכנים להשוואה הוא ריק.");
        setDiff([]);
        return;
    }

    const diffResult = diffLines(content1, content2);
    console.log("handleCompare: תוצאת diffLines:", diffResult);
    setDiff(diffResult);
};

    const showCompareModal = () => {
        setIsCompareModalVisible(true);
        setDiff([]);
        setSelectedVersion2Id(null);

        if (fileData && fileData.versions && fileData.versions.length > 0) {
            const lastVersionId = fileData.versions[fileData.versions.length - 1].versionId;
            setSelectedVersion1Id(lastVersionId);
        } else {
            setSelectedVersion1Id(0);
        }
    };

    const handleCompareModalCancel = () => {
        setIsCompareModalVisible(false);
        setDiff([]);
    };

    useEffect(() => {
        if (isCompareModalVisible && selectedVersion1Id !== null && selectedVersion2Id !== null) {
            handleCompare();
        }
    }, [isCompareModalVisible, selectedVersion1Id, selectedVersion2Id]);

    if (loading) {
        console.log("רכיב במצב טעינה.");
        return (
            <div className="loading-container">
                <Spin size="large" />
                <Typography>⏳ טוען קובץ...</Typography>
            </div>
        );
    }

    if (!fileData) {
        console.log("fileData הוא null, הצגת הודעת שגיאה.");
        return (
            <Typography className="error-message">
                ❌ שגיאה בטעינת הקובץ. אנא נסה שוב.
            </Typography>
        );
    }

    console.log("רכיב מוכן לרנדור עם fileData:", fileData);
    return (
      <div className="file-viewer-container">
          <Card title={`קובץ: ${fileData.name}`} className="file-content-card">
              <SyntaxHighlighter language="csharp" style={oneLight} showLineNumbers>
                  {displayedContent || "// אין תוכן להצגה"}
              </SyntaxHighlighter>
              <Button type="primary" onClick={showCompareModal} style={{ marginTop: 16 }}>
                  🔄 השווה גרסאות
              </Button>
          </Card>

          <Modal
              title={`השוואת גרסאות - ${fileData.name}`}
              open={isCompareModalVisible}
              onCancel={handleCompareModalCancel}
              footer={[
                  <Button key="cancel" onClick={handleCompareModalCancel}>
                      סגור
                  </Button>,
              ]}
              width={1200}
              style={{ maxWidth: '90vw' }}
          >
              <Row gutter={16}>
                  <Col span={12}>
                      <Typography>גרסה 1</Typography>
                      <Select
                          className="version-select"
                          onChange={(value) => setSelectedVersion1Id(value)}
                          placeholder="בחר גרסה"
                          defaultValue={fileData?.versions?.length > 0 ? fileData.versions[fileData.versions.length - 1].versionId : 0}
                      >
                          <Select.Option key={0} value={0}>
                              קובץ נוכחי
                          </Select.Option>
                          {fileData?.versions?.map((version, index) => (
                              <Select.Option key={version.versionId} value={version.versionId}>
                                  גרסה {index + 1}
                              </Select.Option>
                          ))}
                      </Select>
                      <Card title={selectedVersion1Id === 0 ? "גרסה נוכחית" : `גרסה ${fileData?.versions?.findIndex(v => v.versionId === selectedVersion1Id) + 1}`} style={{ marginTop: 16 }}>
                          <div className="diff-content">
                              {diff.map((part, index) => (
                                  !part.removed && (
                                      <pre
                                          key={`v1-${index}`}
                                          className={`diff-line ${part.added ? 'added' : ''}`}
                                      >
                                          {part.value}
                                      </pre>
                                  )
                              ))}
                          </div>
                      </Card>
                  </Col>
                  <Col span={12}>
                      <Typography>גרסה 2</Typography>
                      <Select
                          className="version-select"
                          onChange={(value) => setSelectedVersion2Id(value)}
                          placeholder="בחר גרסה"
                      >
                          <Select.Option key={null} value={null}>
                              בחר גרסה להשוואה
                          </Select.Option>
                          {fileData?.versions?.map((version, index) => (
                              <Select.Option key={version.versionId} value={version.versionId}>
                                  גרסה {index + 1}
                              </Select.Option>
                          ))}
                      </Select>
                      <Card title={`גרסה ${selectedVersion2Id !== null ? fileData?.versions?.findIndex(v => v.versionId === selectedVersion2Id) + 1 : ""}`} style={{ marginTop: 16 }}>
                          <div className="diff-content">
                              {diff.map((part, index) => (
                                  !part.added && (
                                      <pre
                                          key={`v2-${index}`}
                                          className={`diff-line ${part.removed ? 'removed' : ''}`}
                                      >
                                          {part.value}
                                      </pre>
                                  )
                              ))}
                          </div>
                      </Card>
                  </Col>
              </Row>
          </Modal>
      </div>
  );
};

export default FileViewer;
