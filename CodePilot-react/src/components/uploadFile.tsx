import { useState, useRef, useEffect, ChangeEvent, DragEvent } from "react";
import { uploadFile, getUserFiles, uploadFileVersion } from "../services/codeFileService";
import {
  Button,
  Box,
  Typography,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { CloudUpload as UploadIcon } from "@mui/icons-material";
import FileList from "./FileList";
import { motion } from "framer-motion";

interface FloatingShapeProps {
  size: number;
  top: string;
  left: string;
  color: string;
}

const FloatingShape: React.FC<FloatingShapeProps> = ({ size, top, left, color }) => (
  <Box
    sx={{
      position: "absolute",
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      backgroundColor: color,
      opacity: 0.2,
      top,
      left,
      zIndex: -1,
      filter: 'blur(8px)',
    }}
  />
);

const UserFiles = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

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
    if (e.target.files?.length) setFile(e.target.files[0]);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files?.length) setFile(e.dataTransfer.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    setLoading(true);
    try {
      const existingFile = files.find((f) => f.fileName === file.name);
      if (existingFile) {
        await uploadFileVersion(existingFile.id, file, file.name, file.type);
        setMessage("File version added successfully!");
      } else {
        await uploadFile(file, file.name, file.type);
        setMessage("File uploaded successfully!");
      }

      loadUserFiles();
      setFile(null);
    } catch (error) {
      console.error("Failed to upload file", error);
      setMessage("File upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        maxWidth: 800,
        margin: "0 auto",
        padding: 4,
        [theme.breakpoints.down('md')]: { padding: 2 },
      }}
    >
      {/* Static Background Shapes */}
      {[...Array(5)].map((_, i) => (
        <FloatingShape
          key={`primary-${i}`}
          size={40 + i * 10}
          top={`${10 + i * 15}%`}
          left={`${20 + i * 12}%`}
          color={theme.palette.primary.light}
        />
      ))}
      {[...Array(3)].map((_, i) => (
        <FloatingShape
          key={`secondary-${i}`}
          size={30 + i * 5}
          top={`${5 + i * 25}%`}
          left={`${50 + i * 10}%`}
          color={theme.palette.secondary.light}
        />
      ))}

      <Typography variant="h4" gutterBottom align="center" sx={{ color: theme.palette.text.primary }}>
        Your Files
      </Typography>

      <motion.Box
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
        sx={{
          border: `2px dashed ${theme.palette.primary.main}`,
          padding: 3,
          borderRadius: 4,
          textAlign: "center",
          cursor: "pointer",
          marginBottom: 3,
          backgroundColor: theme.palette.background.paper,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <UploadIcon sx={{ fontSize: 60, color: theme.palette.primary.main, marginBottom: 1 }} />
        <Typography variant="body1" color="textSecondary">
          Drag & Drop your file here or <Typography component="span" color={theme.palette.primary.main} fontWeight="bold">click to browse</Typography>
        </Typography>
      </motion.Box>

      <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />

      {file && (
        <Typography variant="subtitle2" sx={{ mt: 1, color: theme.palette.text.secondary }}>
          Selected File: <Typography component="span" fontWeight="bold">{file.name}</Typography>
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleFileUpload}
        fullWidth
        sx={{ mt: 2, py: 1.5, fontSize: '1rem' }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Upload File"}
      </Button>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ marginTop: 16 }}
        >
          <Typography variant="body2" color={message.includes("failed") ? "error" : "success"} align="center">
            {message}
          </Typography>
        </motion.div>
      )}

      <Typography variant="h6" sx={{ mt: 4, color: theme.palette.text.primary }}>
        Uploaded Files
      </Typography>

      <FileList files={files} setFiles={setFiles} />
    </Box>
  );
};

export default UserFiles;
