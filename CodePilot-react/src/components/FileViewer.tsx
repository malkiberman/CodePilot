"use client";
import FileAnalyzer from "../components/FileAnalyzer";
import { useState, useEffect, useRef } from "react";
import { diffLines } from "diff";
import {
  Typography,
  Button,
  Select,
  Spin,
  message,
  Row,
  Col,
  Empty,
} from "antd";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight, oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getFileById, getFileVersions } from "../services/codeFileService";
import { useParams } from "react-router-dom";
import {
  Box,
  Paper,
  useTheme,
  Skeleton,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  CompareArrows,
  History,
  Code as CodeIcon,
  FilePresent,
  ArrowBack,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
// Removed: import "./FileViewer.css"; // קובץ CSS חיצוני הוסר

interface Version {
  versionId: number;
  filePath: string;
}

interface FileData {
  id: number;
  name: string;
  filePath: string;
  versions: Version[];
}

const FileViewer = () => {
  const { fileId } = useParams();
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);
  const [diff, setDiff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayedContent, setDisplayedContent] = useState<string | null>(null);
  const [comparedContent, setComparedContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const fileViewerRef = useRef<HTMLDivElement>(null);

  const fetchFileContent = async (url: string): Promise<string> => {
    console.log(`[fetchFileContent] מתחיל הורדת תוכן מקובץ: ${url}`); // מתחיל הורדת תוכן מקובץ
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`[fetchFileContent] שגיאה בהורדת תוכן קובץ, סטטוס: ${response.status}`); // שגיאה בהורדת תוכן קובץ
        message.error("Could not download file content");
        throw new Error("Could not download file content");
      }
      const text = await response.text();
      console.log(`[fetchFileContent] תוכן הקובץ הורד בהצלחה.`); // תוכן הקובץ הורד בהצלחה
      return text;
    } catch (error: any) {
      console.error(`[fetchFileContent] שגיאה בפעולת הורדת תוכן הקובץ: ${error.message}`); // שגיאה בפעולת הורדת תוכן הקובץ
      setError("Failed to load file content. Please try again.");
      return "";
    }
  };

  useEffect(() => {
    if (!fileId) {
      console.warn("[useEffect] לא סופק מזהה קובץ."); // לא סופק מזהה קובץ
      setError("No file ID provided");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      console.log(`[useEffect] מתחיל טעינת נתונים עבור מזהה קובץ: ${fileId}`); // מתחיל טעינת נתונים עבור מזהה קובץ

      try {
        const numericFileId = Number.parseInt(fileId, 10);
        if (isNaN(numericFileId)) {
          console.error(`[useEffect] מזהה הקובץ "${fileId}" אינו מספר תקין.`); // מזהה הקובץ אינו מספר תקין
          setError("Invalid file ID");
          return;
        }
        console.log(`[useEffect] קורא ל-getFileById עם מזהה: ${numericFileId}`); // קורא ל-getFileById
        const fileResponse = await getFileById(numericFileId);
        console.log(`[useEffect] תגובה מ-getFileById:`, fileResponse); // תגובה מ-getFileById

        if (!fileResponse) {
          console.error("[useEffect] נתיב הקובץ לא נמצא בתגובה מ-getFileById."); // נתיב הקובץ לא נמצא
          setError("File path not found");
          return;
        }

        console.log(`[useEffect] קורא ל-getFileVersions עם מזהה: ${numericFileId}`); // קורא ל-getFileVersions
        const versionsResponse = await getFileVersions(numericFileId);
        console.log(`[useEffect] תגובה מ-getFileVersions:`, versionsResponse); // תגובה מ-getFileVersions

        const versions =
          versionsResponse?.map((version: any) => ({
            versionId: version.versionId,
            filePath: version.filePath,
          })) || [];
        console.log(`[useEffect] גרסאות קובץ מעובדות:`, versions); // גרסאות קובץ מעובדות

        const newFileData: FileData = {
          id: numericFileId,
          name: fileResponse.fileName,
          filePath: fileResponse.filePath,
          versions: versions,
        };
        console.log(`[useEffect] נתוני קובץ חדשים:`, newFileData); // נתוני קובץ חדשים
        setFileData(newFileData);

        if (versions.length > 0) {
          console.log(`[useEffect] טוען תוכן עבור גרסה ראשונה: ${versions[0].filePath}`); // טוען תוכן עבור גרסה ראשונה
          fetchVersionContentByPath(versions[0].filePath)
            .then((content) => {
              setDisplayedContent(content);
              console.log(`[useEffect] תוכן גרסה ראשונה נטען בהצלחה.`); // תוכן גרסה ראשונה נטען בהצלחה
            })
            .catch((err) => {
              console.error("[useEffect] שגיאה בטעינת תוכן גרסה ראשונה:", err); // שגיאה בטעינת תוכן גרסה ראשונה
              setError("Failed to load version content");
            });
        } else {
          console.log(`[useEffect] אין גרסאות, טוען תוכן קובץ ראשי: ${fileResponse.filePath}`); // אין גרסאות, טוען תוכן קובץ ראשי
          const initialContent = await fetchFileContent(fileResponse);
          setDisplayedContent(initialContent);
          console.log(`[useEffect] תוכן קובץ ראשי נטען בהצלחה.`); // תוכן קובץ ראשי נטען בהצלחה
        }
      } catch (error: any) {
        console.error("[useEffect] שגיאה כללית בטעינת נתונים:", error); // שגיאה כללית בטעינת נתונים
        setError("Failed to load file data. Please try again.");
      } finally {
        setLoading(false);
        console.log("[useEffect] טעינת נתונים הסתיימה."); // טעינת נתונים הסתיימה
      }
    };

    fetchData();
  }, [fileId]);

  const fetchVersionContentByPath = async (filePath: string): Promise<string> => {
    console.log(`[fetchVersionContentByPath] מתחיל הורדת תוכן גרסה: ${filePath}`); // מתחיל הורדת תוכן גרסה
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        console.error(`[fetchVersionContentByPath] שגיאה בהורדת תוכן גרסה, סטטוס: ${response.status}`); // שגיאה בהורדת תוכן גרסה
        message.error("Could not download version content");
        throw new Error("Could not download version content");
      }
      const text = await response.text();
      console.log(`[fetchVersionContentByPath] תוכן הגרסה הורד בהצלחה.`); // תוכן הגרסה הורד בהצלחה
      return text;
    } catch (error: any) {
      console.error(`[fetchVersionContentByPath] שגיאה בפעולת הורדת תוכן גרסה: ${error.message}`); // שגיאה בפעולת הורדת תוכן גרסה
      throw error;
    }
  };

  const handleCompare = async (versionId: number | null = null) => {
    console.log("[handleCompare] מתחיל השוואת גרסאות."); // מתחיל השוואת גרסאות
    if (!fileData || !displayedContent) {
      console.warn("[handleCompare] אין מספיק נתונים להשוואה."); // אין מספיק נתונים להשוואה
      setDiff([]);
      setComparedContent(null);
      return;
    }

    setIsComparing(true);
    setSelectedVersionId(versionId);
    setComparedContent(null);
    setDiff([]);

    if (versionId === null) {
      console.log("[handleCompare] השוואה בוטלה, מוצג הקובץ הנוכחי בלבד."); // השוואה בוטלה
      return;
    }

    try {
      const comparedContent =
        versionId === 0
          ? displayedContent
          : fileData.versions.find((v) => v.versionId === versionId)?.filePath
          ? await fetchVersionContentByPath(
              fileData.versions.find((v) => v.versionId === versionId)!.filePath
            )
          : "";

      setComparedContent(comparedContent);
      const diffResult = diffLines(displayedContent, comparedContent);
      setDiff(diffResult);
      console.log("[handleCompare] השוואת גרסאות הסתיימה.", diffResult); // השוואת גרסאות הסתיימה
    } catch (error: any) {
      console.error("[handleCompare] שגיאה בהשוואת גרסאות:", error); // שגיאה בהשוואת גרסאות
      message.error("Failed to compare versions");
      setComparedContent(null);
      setDiff([]);
    }
  };

  const handleStartCompare = () => {
    console.log("[handleStartCompare] מתחיל מצב השוואה."); // מתחיל מצב השוואה
    setIsComparing(true);
    // Reset selected version when starting compare mode to force selection
    setSelectedVersionId(null);
    setComparedContent(null);
    setDiff([]);
  };

  const handleStopCompare = () => {
    console.log("[handleStopCompare] יוצא ממצב השוואה."); // יוצא ממצב השוואה
    setIsComparing(false);
    setSelectedVersionId(null);
    setComparedContent(null);
    setDiff([]);
  };

  const getLanguageFromFileName = (fileName: string | undefined | null): string => {
    if (!fileName) {
      console.warn("[getLanguageFromFileName] שם הקובץ לא מוגדר, מחזיר שפת ברירת מחדל."); // שם הקובץ לא מוגדר
      return "csharp"; // Fallback language
    }
    const extension = fileName.split(".").pop()?.toLowerCase() || "";
    console.log(`[getLanguageFromFileName] שם קובץ: ${fileName}, סיומת: ${extension}`); // שם קובץ וסיומת
    switch (extension) {
      case "js":
        return "javascript";
      case "jsx":
        return "jsx";
      case "ts":
        return "typescript";
      case "tsx":
        return "tsx";
      case "py":
        return "python";
      case "java":
        return "java";
      case "c":
        return "c";
      case "cpp":
        return "cpp";
      case "cs":
        return "csharp";
      case "html":
        return "html";
      case "css":
        return "css";
      case "json":
        return "json";
      case "md":
        return "markdown";
      default:
        console.log(`[getLanguageFromFileName] סיומת "${extension}" לא מזוהה, מחזיר שפת ברירת מחדל.`); // סיומת לא מזוהה
        return "csharp";
    }
  };

  const language = fileData?.name ? getLanguageFromFileName(fileData.name) : "csharp";
  console.log(`[render] שפה מזוהה: ${language}`); // שפה מזוהה

  if (loading) {
    console.log("[render] מצב טעינה."); // מצב טעינה
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mt: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 2,
          }}
        >
          <Spin size="large" />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading file...
          </Typography>
          <Box sx={{ width: "100%", mt: 4 }}>
            <Skeleton variant="rectangular" height={400} />
            <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="rectangular" width={120} height={36} />
            </Box>
          </Box>
        </Paper>
      </motion.div>
    );
  }

  if (error || !fileData) {
    console.log(`[render] מצב שגיאה או אין נתוני קובץ. שגיאה: ${error}`); // מצב שגיאה או אין נתוני קובץ
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mt: 4,
            borderRadius: 2,
            bgcolor: "error.main",
            color: "white",
          }}
        >
          <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <span role="img" aria-label="error">
              ❌
            </span>{" "}
            Error
          </Typography>
          <Typography sx={{ mt: 1 }}>{error || "Failed to load file. Please try again."}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
            sx={{ mt: 2, bgcolor: "white", color: "error.main" }}
          >
            Retry
          </Button>
        </Paper>
      </motion.div>
    );
  }

  console.log("[render] מרנדר את מציג הקבצים."); // מרנדר את מציג הקבצים
  return (
    <Box
      ref={fileViewerRef}
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        overflow: "hidden",
        minHeight: "80vh",
        gap: theme.spacing(2), // Gap between the two panes
      }}
    >
      <motion.div
        className="file-content-pane"
        style={{
          flexShrink: 0,
          width: isComparing ? "50%" : "100%",
          transition: "width 0.5s ease-in-out",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 0,
            mt: 4,
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
            height: "calc(100% - 32px)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "5px",
              height: "100%",
              background: "linear-gradient(to bottom, #00C853, #69F0AE)",
              zIndex: 1,
            },
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FilePresent color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {fileData.name}
              </Typography>
              <Chip
                label={language}
                size="small"
                color="primary"
                variant="outlined"
                icon={<CodeIcon sx={{ fontSize: 16 }} />}
                sx={{ ml: 1 }}
              />
            </Box>
            <Box>
              <Tooltip title={isComparing ? "Stop Comparing" : "Compare Versions"}>
                <Button
                  type="default"
                  onClick={isComparing ? handleStopCompare : handleStartCompare}
                  style={{
                    marginTop: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    backgroundColor: isComparing ? theme.palette.secondary.main : theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    borderRadius: '8px',
                    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
                    padding: '6px 12px',
                    minWidth: '150px',
                    justifyContent: 'center',
                  }}
                  icon={<CompareArrows />}
                  disabled={fileData.versions.length === 0}
                >
                  {isComparing ? "Stop Compare" : "Compare Versions"}
                </Button>
              </Tooltip>
            </Box>
          </Box>

          <Box sx={{ maxHeight: "70vh", overflow: "auto" }}>
            <SyntaxHighlighter
              language={language}
              style={isDarkMode ? oneDark : oneLight}
              showLineNumbers
              customStyle={{
                margin: 0,
                borderRadius: 0,
                fontSize: "14px",
                padding: "20px",
              }}
            >
              {displayedContent || "// No content to display"}
            </SyntaxHighlighter>
          </Box>

          {fileData.versions.length > 0 && (
            <Box
              sx={{
                p: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <History color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2" color="textSecondary">
                {fileData.versions.length} version{fileData.versions.length !== 1 ? "s" : ""} available
              </Typography>
            </Box>
          )}
        </Paper>
      </motion.div>

      <AnimatePresence>
        {isComparing && (
          <motion.div
            className="compare-pane"
            style={{
              flexShrink: 0,
              width: "50%", // Always 50% when visible
              padding: theme.spacing(2),
              backgroundColor: theme.palette.background.paper,
              borderLeft: `1px solid ${theme.palette.divider}`,
              borderRadius: theme.shape.borderRadius,
              marginTop: theme.spacing(4), // Align with the top of the main Paper
              height: "calc(100% - 32px)", // Match height of main Paper
              overflowY: "auto", // Enable scrolling for the whole pane
            }}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: "0%" }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Tooltip title="Back to single view">
                <Button onClick={handleStopCompare} icon={<ArrowBack />} sx={{ mr: 2 }}>
                  Back
                </Button>
              </Tooltip>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Compare With
              </Typography>
            </Box>

            {fileData.versions.length > 0 ? (
              <Select
                className="version-select"
                onChange={(value) => {
                  console.log(`[ComparePane] Selected version to compare: ${value}`); // גרסה להשוואה נבחרה
                  handleCompare(value);
                }}
                placeholder="Select version to compare"
                style={{ width: "100%", marginBottom: 16 }}
              >
                <Select.Option key={0} value={0}>
                  Current File
                </Select.Option>
                {fileData.versions.map((version, index) => (
                  <Select.Option key={version.versionId} value={version.versionId}>
                    Version {index + 1}
                  </Select.Option>
                ))}
              </Select>
            ) : (
              <Empty description="No versions available to compare" />
            )}

            {comparedContent !== null && (
              <Paper elevation={2} sx={{ mt: 2, p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                  {selectedVersionId === 0
                    ? "Current File"
                    : fileData.versions.find((v) => v.versionId === selectedVersionId)
                    ? `Version ${fileData.versions.findIndex((v) => v.versionId === selectedVersionId) + 1}`
                    : "Selected Version"}
                </Typography>
                <div
                  className="diff-content"
                  style={{
                    maxHeight: "60vh",
                    overflowY: "auto",
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {diff.length > 0 ? (
                    diff.map((part, index) => (
                      <pre
                        key={`diff-${index}`}
                        className={`diff-line ${part.added ? "added" : part.removed ? "removed" : ""}`}
                        style={{
                          backgroundColor: part.added
                            ? "rgba(0, 230, 118, 0.1)" // ירוק בהיר
                            : part.removed
                            ? "rgba(255, 82, 82, 0.1)" // אדום בהיר
                            : "transparent",
                          padding: "2px 4px",
                          margin: 0,
                          borderRadius: 4,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all',
                        }}
                      >
                        {part.value}
                      </pre>
                    ))
                  ) : (
                    <Empty description={selectedVersionId !== null ? "No differences found" : "Select a version to compare"} />
                  )}
                </div>
              </Paper>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default FileViewer;