"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  Button,
  Box,
  Typography,
  Paper,
  Chip,
  Tooltip,
  Zoom,
  Alert,
  Snackbar,
  useTheme,
  LinearProgress,
} from "@mui/material"
import {
  CloudUpload as UploadIcon,
  FileUpload,
  InsertDriveFile,
  Code as CodeIcon,
  CheckCircle,
} from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"
import { uploadFile, uploadFileVersion } from "../../services/fileService"
import type { CodeFile } from "../../types"

interface FileUploadProps {
  files: CodeFile[]
  onFileUploaded: () => void
}

const FileUploadComponent = ({ files, onFileUploaded }: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const theme = useTheme()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files?.length) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  const simulateProgress = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return prev
        }
        return prev + Math.random() * 15
      })
    }, 200)
    return interval
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setSnackbar({ open: true, message: "Please select a file first.", severity: "error" })
      return
    }

    setUploading(true)
    const progressInterval = simulateProgress()

    try {
      const existingFile = files.find((f) => f.fileName === selectedFile.name)

      if (existingFile) {
        await uploadFileVersion(existingFile.id, selectedFile, selectedFile.name, selectedFile.type)
        setSnackbar({ open: true, message: "File version uploaded successfully!", severity: "success" })
      } else {
        await uploadFile(selectedFile, selectedFile.name, selectedFile.type)
        setSnackbar({ open: true, message: "File uploaded successfully!", severity: "success" })
      }

      setUploadProgress(100)
      setTimeout(() => {
        onFileUploaded()
        setSelectedFile(null)
        setUploadProgress(0)
      }, 500)
    } catch (error) {
      console.error("Upload failed:", error)
      setSnackbar({ open: true, message: "Upload failed. Please try again.", severity: "error" })
      setUploadProgress(0)
    } finally {
      clearInterval(progressInterval)
      setUploading(false)
    }
  }

  return (
    <Box sx={{ mb: 4 }}>
      <motion.div
        whileHover={{ scale: isDragging ? 1 : 1.02 }}
        animate={{
          scale: isDragging ? 1.05 : 1,
          borderColor: isDragging ? theme.palette.primary.main : theme.palette.divider,
        }}
        transition={{ duration: 0.2 }}
      >
        <Paper
          elevation={3}
          sx={{
            border: `2px dashed ${isDragging ? theme.palette.primary.main : theme.palette.divider}`,
            padding: 4,
            borderRadius: 4,
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: isDragging ? `${theme.palette.primary.main}08` : theme.palette.background.paper,
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s ease",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: isDragging
                ? `linear-gradient(45deg, ${theme.palette.primary.main}10, ${theme.palette.primary.main}05)`
                : "transparent",
              zIndex: 0,
            },
          }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Zoom in={true} style={{ transitionDelay: "100ms" }}>
              <Box
                sx={{
                  bgcolor: "rgba(0, 230, 118, 0.1)",
                  p: 3,
                  borderRadius: "50%",
                  mb: 3,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <motion.div
                  animate={isDragging ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.6, repeat: isDragging ? Number.POSITIVE_INFINITY : 0 }}
                >
                  <UploadIcon
                    sx={{
                      fontSize: 60,
                      color: theme.palette.primary.main,
                      filter: `drop-shadow(0 0 8px ${theme.palette.primary.main}40)`,
                    }}
                  />
                </motion.div>
              </Box>
            </Zoom>

            <Typography variant="h5" color="textPrimary" gutterBottom fontWeight={600}>
              {isDragging ? "Drop your file here" : "Upload Your Code"}
            </Typography>

            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
              Drag & Drop your file here or{" "}
              <Typography component="span" color="primary.main" fontWeight="bold">
                click to browse
              </Typography>
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
              <Chip label="JavaScript" icon={<CodeIcon />} color="primary" variant="outlined" size="small" />
              <Chip label="TypeScript" icon={<CodeIcon />} color="primary" variant="outlined" size="small" />
              <Chip label="Python" icon={<CodeIcon />} color="primary" variant="outlined" size="small" />
              <Chip label="And More..." icon={<InsertDriveFile />} color="secondary" variant="outlined" size="small" />
            </Box>
          </Box>
        </Paper>
      </motion.div>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.html,.css,.json,.md,.php,.rb,.go,.rs,.kt,.swift"
      />

      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Paper
              elevation={2}
              sx={{
                p: 3,
                mt: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderLeft: `4px solid ${theme.palette.primary.main}`,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}08, transparent)`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
                  <InsertDriveFile color="primary" sx={{ mr: 2, fontSize: 28 }} />
                </motion.div>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {selectedFile.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </Typography>
                </Box>
              </Box>

              <Tooltip title="Upload this file">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpload}
                  disabled={uploading}
                  startIcon={uploading ? null : uploadProgress === 100 ? <CheckCircle /> : <FileUpload />}
                  sx={{
                    minWidth: 120,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {uploading ? "Uploading..." : uploadProgress === 100 ? "Done!" : "Upload"}
                </Button>
              </Tooltip>
            </Paper>

            {uploading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: `${theme.palette.primary.main}20`,
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 4,
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                    {Math.round(uploadProgress)}% uploaded
                  </Typography>
                </Box>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default FileUploadComponent
