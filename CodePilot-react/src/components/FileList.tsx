"use client"

import { useNavigate } from "react-router-dom"
import { getUserFiles, deleteFile, renameFile } from "../services/codeFileService"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Code } from "lucide-react"
import {
  Skeleton,
  useTheme,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Paper,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from "@mui/material"
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Code as CodeIcon,
  Language as LanguageIcon,
} from "@mui/icons-material"

interface File {
  id: number
  fileName: string
  language: string
}

const FileList = ({ files, setFiles }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [fileToUpdate, setFileToUpdate] = useState(null)
  const [newFileName, setNewFileName] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState(null)
  const navigate = useNavigate()
  const theme = useTheme()

  const fetchFiles = async () => {
    try {
      setIsLoading(true)
      const data = await getUserFiles()
      setFiles(data)
    } catch (error) {
      console.error("Error fetching files:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const handleFileClick = (fileId:number) => {
    navigate(`/files/${fileId}`)
  }

  const handleDeleteFile = async (fileId:number) => {
    try {
      setIsLoading(true)
      await deleteFile(fileId)
      setFiles((prevFiles:File[]) => prevFiles.filter((file) => file.id !== fileId))
      setDeleteConfirmOpen(false)
    } catch (error) {
      console.error("Error deleting file:", error)
      setErrorMessage("Failed to delete file. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateFileName = async () => {
    if (!fileToUpdate || !newFileName.trim()) {
      setErrorMessage("File name cannot be empty")
      return
    }

    try {
      setIsLoading(true)
      await renameFile(fileToUpdate.id, newFileName)
      setFiles((prevFiles:File[]) =>
        prevFiles.map((file:File) => (file.id === fileToUpdate.id ? { ...file, fileName: newFileName } : file)),
      )
      setIsRenameDialogOpen(false)
      setErrorMessage("")
    } catch (error) {
      console.error("Error updating file name:", error)
      setErrorMessage("Failed to update file name. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const openRenameDialog = (e:any, file:any) => {
    e.stopPropagation()
    setFileToUpdate(file)
    setNewFileName(file.fileName)
    setErrorMessage("")
    setIsRenameDialogOpen(true)
  }

  const openDeleteConfirm = (e:any, fileId:any) => {
    e.stopPropagation()
    setFileToDelete(fileId)
    setDeleteConfirmOpen(true)
  }

  const getLanguageColor = (language:string) => {
    if (language?.toLowerCase() === "javascript") return theme.palette.primary.main
    if (language?.toLowerCase() === "typescript") return theme.palette.primary.dark
    if (language?.toLowerCase() === "python") return theme.palette.secondary.main
    if (language?.toLowerCase() === "java") return theme.palette.error.main
    if (language?.toLowerCase() === "csharp") return theme.palette.success.main
    return theme.palette.info.main
  }

  if (isLoading) {
    return (
      <Paper elevation={2} sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.secondary }}>
          File List
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="p-3 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="40%" height={20} />
            </Box>
            <Skeleton variant="rectangular" width={100} height={36} />
          </motion.div>
        ))}
      </Paper>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mt: 3,
          borderRadius: 2,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "5px",
            height: "100%",
            background: "linear-gradient(to bottom, #00C853, #69F0AE)",
          },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            color: theme.palette.text.primary,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CodeIcon color="primary" />
          Your Files
          <Chip label={`${files.length} files`} size="small" color="primary" variant="outlined" sx={{ ml: 2 }} />
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {files.map((file:File) => (
          <motion.div
            key={file.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{
              backgroundColor: theme.palette.action.hover,
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 2,
                mb: 2,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
              onClick={() => handleFileClick(file.id)}
            >
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: `${getLanguageColor(file.language)}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                <Code className="w-6 h-6" color={getLanguageColor(file.language)} />
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {file.fileName}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                  <LanguageIcon sx={{ fontSize: 14, color: theme.palette.text.secondary, mr: 0.5 }} />
                  <Typography variant="caption" color={theme.palette.text.secondary}>
                    {file.language || "Unknown"}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Tooltip title="View File">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFileClick(file.id)
                    }}
                    size="small"
                    sx={{
                      color: theme.palette.primary.main,
                      bgcolor: `${theme.palette.primary.main}10`,
                      "&:hover": {
                        bgcolor: `${theme.palette.primary.main}20`,
                      },
                    }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Rename File">
                  <IconButton
                    onClick={(e) => openRenameDialog(e, { id: file.id, fileName: file.fileName })}
                    size="small"
                    sx={{
                      color: theme.palette.secondary.main,
                      bgcolor: `${theme.palette.secondary.main}10`,
                      "&:hover": {
                        bgcolor: `${theme.palette.secondary.main}20`,
                      },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete File">
                  <IconButton
                    onClick={(e) => openDeleteConfirm(e, file.id)}
                    size="small"
                    sx={{
                      color: theme.palette.error.main,
                      bgcolor: `${theme.palette.error.main}10`,
                      "&:hover": {
                        bgcolor: `${theme.palette.error.main}20`,
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
          </motion.div>
        ))}

        {files.length === 0 && (
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              border: `1px dashed ${theme.palette.divider}`,
              borderRadius: 2,
              bgcolor: theme.palette.background.default,
            }}
          >
            <CodeIcon sx={{ fontSize: 40, color: theme.palette.text.secondary, opacity: 0.5, mb: 1 }} />
            <Typography variant="body1" color="textSecondary">
              No files uploaded yet.
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Upload your first file to get started.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onClose={() => setIsRenameDialogOpen(false)}>
        <DialogTitle>Rename File</DialogTitle>
        <DialogContent>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="New File Name"
            fullWidth
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRenameDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleUpdateFileName} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this file? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => fileToDelete !== null && handleDeleteFile(fileToDelete)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  )
}

export default FileList
