"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Code as CodeIcon,
  Language as LanguageIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"
import { deleteFile, renameFile } from "../../services/fileService"
import { getLanguageFromFileName, formatDate } from "../../utils"
import type { CodeFile } from "../../types"
import LoadingSpinner from "../UI/LoadingSpinner"

interface FileListProps {
  files: CodeFile[]
  setFiles: React.Dispatch<React.SetStateAction<CodeFile[]>>
  loading?: boolean
}

const FileList = ({ files, setFiles, loading = false }: FileListProps) => {
  const [renameDialog, setRenameDialog] = useState({ open: false, file: null as CodeFile | null })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, fileId: null as number | null })
  const [newFileName, setNewFileName] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [menuAnchor, setMenuAnchor] = useState<{ element: HTMLElement; fileId: number } | null>(null)
  const navigate = useNavigate()
  const theme = useTheme()

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      javascript: "#F7DF1E",
      typescript: "#3178C6",
      python: "#3776AB",
      java: "#ED8B00",
      csharp: "#239120",
      cpp: "#00599C",
      html: "#E34F26",
      css: "#1572B6",
      json: "#000000",
      php: "#777BB4",
      ruby: "#CC342D",
      go: "#00ADD8",
      rust: "#000000",
      kotlin: "#7F52FF",
      swift: "#FA7343",
    }
    return colors[language.toLowerCase()] 
  }

  const handleFileClick = (fileId: number) => {
    navigate(`/files/${fileId}`)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, fileId: number) => {
    event.stopPropagation()
    setMenuAnchor({ element: event.currentTarget, fileId })
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const openRenameDialog = (file: CodeFile) => {
    setRenameDialog({ open: true, file })
    setNewFileName(file.fileName)
    setErrorMessage("")
    handleMenuClose()
  }

  const openDeleteDialog = (fileId: number) => {
    setDeleteDialog({ open: true, fileId })
    handleMenuClose()
  }

  const handleRename = async () => {
    if (!renameDialog.file || !newFileName.trim()) {
      setErrorMessage("File name cannot be empty")
      return
    }

    try {
      await renameFile(renameDialog.file.id, newFileName)
      setFiles((prevFiles) =>
        prevFiles.map((file) => (file.id === renameDialog.file!.id ? { ...file, fileName: newFileName } : file)),
      )
      setRenameDialog({ open: false, file: null })
      setErrorMessage("")
    } catch (error) {
      console.error("Error renaming file:", error)
      setErrorMessage("Failed to rename file. Please try again.")
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.fileId) return

    try {
      await deleteFile(deleteDialog.fileId)
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== deleteDialog.fileId))
      setDeleteDialog({ open: false, fileId: null })
    } catch (error) {
      console.error("Error deleting file:", error)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading your files..." />
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
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
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <CodeIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
          <Typography variant="h5" fontWeight={700} sx={{ flex: 1 }}>
            Your Files
          </Typography>
          <Chip label={`${files.length} files`} color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
        </Box>

        <Divider sx={{ mb: 3 }} />

        <AnimatePresence>
          {files.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Box
                sx={{
                  p: 6,
                  textAlign: "center",
                  border: `2px dashed ${theme.palette.divider}`,
                  borderRadius: 3,
                  bgcolor: theme.palette.background.default,
                }}
              >
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
                  <CodeIcon sx={{ fontSize: 64, color: theme.palette.text.secondary, opacity: 0.5, mb: 2 }} />
                </motion.div>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No files uploaded yet
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Upload your first file to get started with version control
                </Typography>
              </Box>
            </motion.div>
          ) : (
            files.map((file, index) => {
              const language = getLanguageFromFileName(file.fileName)
              const languageColor = getLanguageColor(language)

              return (
                <motion.div
                  key={file.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      transition: "all 0.3s ease",
                      background: `linear-gradient(90deg, ${languageColor}08, transparent)`,
                      "&:hover": {
                        boxShadow: `0 8px 25px ${languageColor}20`,
                        borderColor: languageColor,
                      },
                    }}
                    onClick={() => handleFileClick(file.id)}
                  >
                    <Avatar
                      sx={{
                        bgcolor: `${languageColor}15`,
                        color: languageColor,
                        mr: 3,
                        width: 56,
                        height: 56,
                      }}
                    >
                      <CodeIcon sx={{ fontSize: 28 }} />
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          mb: 0.5,
                        }}
                      >
                        {file.fileName}
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LanguageIcon sx={{ fontSize: 16, color: languageColor, mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            {language.charAt(0).toUpperCase() + language.slice(1)}
                          </Typography>
                        </Box>

                        <Typography variant="caption" color="text.secondary">
                          {formatDate(file.updatedAt)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Tooltip title="View File">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation()
                            handleFileClick(file.id)
                          }}
                          sx={{
                            color: theme.palette.primary.main,
                            bgcolor: `${theme.palette.primary.main}10`,
                            "&:hover": { bgcolor: `${theme.palette.primary.main}20` },
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>

                      <IconButton
                        onClick={(e) => handleMenuOpen(e, file.id)}
                        sx={{
                          color: theme.palette.text.secondary,
                          "&:hover": { bgcolor: theme.palette.action.hover },
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </Paper>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor?.element}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 2,
            minWidth: 180,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            const file = files.find((f) => f.id === menuAnchor?.fileId)
            if (file) openRenameDialog(file)
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => menuAnchor && openDeleteDialog(menuAnchor.fileId)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: "error.main" }}>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Rename Dialog */}
      <Dialog
        open={renameDialog.open}
        onClose={() => setRenameDialog({ open: false, file: null })}
        maxWidth="sm"
        fullWidth
      >
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
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialog({ open: false, file: null })}>Cancel</Button>
          <Button onClick={handleRename} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, fileId: null })}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this file? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, fileId: null })}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  )
}

export default FileList
