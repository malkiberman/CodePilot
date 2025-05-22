"use client"

// שיפור רכיב קבצי המשתמש עם עיצוב ואנימציות טובים יותר
import { useState, useRef, useEffect } from "react"
import { uploadFile, getUserFiles, uploadFileVersion } from "../services/codeFileService"
import {
  Button,
  Box,
  Typography,
  CircularProgress,
  useTheme,
  Paper,
  Grid,
  Chip,
  Tooltip,
  Zoom,
  Fade,
  Alert,
  Snackbar,
} from "@mui/material"
import { CloudUpload as UploadIcon, FileUpload, InsertDriveFile, Code as CodeIcon } from "@mui/icons-material"
import FileList from "./FileList"
import { motion } from "framer-motion"

const FloatingShape = ({ size, top, left, color }) => (
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
      filter: "blur(8px)",
    }}
  />
)

const UserFiles = () => {
  const [files, setFiles] = useState([])
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const fileInputRef = useRef(null)
  const theme = useTheme()

  useEffect(() => {
    loadUserFiles()
  }, [])

  const loadUserFiles = async () => {
    try {
      const data = await getUserFiles()
      setFiles(data)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load files.")
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files?.length) setFile(e.target.files[0])
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files?.length) setFile(e.dataTransfer.files[0])
  }

  const handleFileUpload = async () => {
    if (!file) {
      setSnackbarMessage("Please select a file first.")
      setSnackbarSeverity("error")
      setShowSnackbar(true)
      return
    }

    setLoading(true)
    try {
      const existingFile = files.find((f) => f.fileName === file.name)
      if (existingFile) {
        await uploadFileVersion(existingFile.id, file, file.name, file.type)
        setSnackbarMessage("File version added successfully!")
        setSnackbarSeverity("success")
      } else {
        await uploadFile(file, file.name, file.type)
        setSnackbarMessage("File uploaded successfully!")
        setSnackbarSeverity("success")
      }

      loadUserFiles()
      setFile(null)
      setShowSnackbar(true)
    } catch (error) {
      console.error("Failed to upload file", error)
      setSnackbarMessage("File upload failed.")
      setSnackbarSeverity("error")
      setShowSnackbar(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        position: "relative",
        maxWidth: 800,
        margin: "0 auto",
        padding: 4,
        [theme.breakpoints.down("md")]: { padding: 2 },
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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{
            color: theme.palette.text.primary,
            position: "relative",
            mb: 4,
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: "50%",
              transform: "translateX(-50%)",
              width: 60,
              height: 3,
              borderRadius: 1.5,
              bgcolor: "primary.main",
            },
          }}
        >
          Your Files
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        <Grid item xs={12}>
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
                padding: 3,
                borderRadius: 4,
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: theme.palette.background.paper,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&::before": isDragging
                  ? {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: theme.palette.primary.main,
                      opacity: 0.05,
                      zIndex: 0,
                    }
                  : {},
              }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Zoom in={true} style={{ transitionDelay: "100ms" }}>
                <Box
                  sx={{
                    bgcolor: "rgba(0, 230, 118, 0.1)",
                    p: 2,
                    borderRadius: "50%",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <UploadIcon
                    sx={{
                      fontSize: 60,
                      color: theme.palette.primary.main,
                      filter: `drop-shadow(0 0 8px ${theme.palette.primary.main}40)`,
                    }}
                  />
                </Box>
              </Zoom>
              <Typography variant="h6" color="textPrimary" gutterBottom>
                {isDragging ? "Drop your file here" : "Upload Your File"}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Drag & Drop your file here or{" "}
                <Typography component="span" color={theme.palette.primary.main} fontWeight="bold">
                  click to browse
                </Typography>
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Chip
                  label="Code Files"
                  icon={<CodeIcon />}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label="Version Control"
                  icon={<InsertDriveFile />}
                  color="secondary"
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        <Grid item xs={12}>
          <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />

          {file && (
            <Fade in={!!file}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <InsertDriveFile color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary }}>
                    Selected:{" "}
                    <Typography component="span" fontWeight="bold">
                      {file.name}
                    </Typography>
                  </Typography>
                </Box>
                <Tooltip title="Upload this file">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleFileUpload}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <FileUpload />}
                  >
                    Upload
                  </Button>
                </Tooltip>
              </Paper>
            </Fade>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleFileUpload}
            fullWidth
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: "1rem",
              display: file ? "none" : "flex",
            }}
            disabled={loading || !file}
            startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <FileUpload />}
          >
            {loading ? "Uploading..." : "Upload File"}
          </Button>
        </Grid>

        <Grid item xs={12}>
          <FileList files={files} setFiles={setFiles} />
        </Grid>
      </Grid>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default UserFiles
