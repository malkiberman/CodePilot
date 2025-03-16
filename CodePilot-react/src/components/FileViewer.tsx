import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFileById } from "../services/codeFileService";
import { Box, Typography, Button } from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";

const FileViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  useEffect(() => {
    const fetchFile = async () => {
      console.log("Fetching file");
  
      try {
        const fileData = await getFileById(Number(id));
        console.log("File data:", fileData);
  
        setFileName(fileData.fileName);
  
        // שליפת תוכן הקובץ מהכתובת ב-S3
        const response = await fetch(fileData);
        console.log(response);
        
        const content = await response.text(); // קריאת תוכן הקובץ
        setFileContent(content);
  
      } catch (error) {
        console.error("Error fetching file:", error);
      }
    };
  
    fetchFile();
  }, [id]);
  
  return (
    <Box sx={{ maxWidth: "80%", margin: "0 auto", padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        {fileName}
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/")}>
        Back to Files
      </Button>
      {fileContent ? (
        <SyntaxHighlighter language="csharp" style={darcula} showLineNumbers>
          {fileContent}
        </SyntaxHighlighter>
      ) : (
        <Typography>Loading file...</Typography>
      )}
    </Box>
  );
};

export default FileViewer;
