import { useState, useRef, useEffect, ChangeEvent, DragEvent } from "react";
import { uploadFile, getUserFiles } from "../services/codeFileService";
import { Button, Box, Typography, Grid, CircularProgress, Paper, List, ListItem, ListItemText } from "@mui/material";
import { CloudUpload as UploadIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const UserFiles = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate =useNavigate();
  useEffect(() => {
    loadUserFiles();
  }, []);

  const loadUserFiles = async () => {
    try {
      const data = await getUserFiles();
      setFiles(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load files.");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files?.length) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    setLoading(true);
    try {
      const data = await uploadFile(file, file.name, file.type);
      setMessage(`File uploaded successfully! ID: ${data.fileId}`);
      loadUserFiles();
    } catch (error) {
      setMessage("File upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Your Files
      </Typography>

      <Box
        sx={{
          border: "2px dashed #3f51b5",
          padding: 3,
          borderRadius: 2,
          textAlign: "center",
          cursor: "pointer",
          marginBottom: 3,
          backgroundColor: "#f5f5f5",
        }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <UploadIcon sx={{ fontSize: 50, color: "#3f51b5" }} />
        <Typography variant="body1" color="textSecondary">
          Drag & Drop your file here or click to browse
        </Typography>
      </Box>

      <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />

      {file && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Selected File: {file.name}
        </Typography>
      )}

      <Button variant="contained" color="primary" onClick={handleFileUpload} fullWidth sx={{ marginTop: 2 }} disabled={loading}>
        {loading ? <CircularProgress size={24} color="inherit" /> : "Upload File"}
      </Button>

      {message && (
        <Typography variant="body2" color={message.includes("failed") ? "error" : "success"} sx={{ marginTop: 2 }}>
          {message}
        </Typography>
      )}

      <Typography variant="h5" sx={{ mt: 4 }}>
        Uploaded Files
      </Typography>

      <List>
        {files.map((file) => (
          <ListItem
            key={file.id}
            sx={{
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              marginBottom: 1,
              cursor: "pointer",
              "&:hover": { backgroundColor: "#e0e0e0" },
            }}
            onClick={() => navigate(`/file/${file.id}`)}
          >
            <ListItemText primary={file.fileName} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UserFiles;
