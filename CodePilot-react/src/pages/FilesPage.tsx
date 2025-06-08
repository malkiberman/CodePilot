"use client"

import { useState, useEffect } from "react"
import { Container, Typography, Box, useTheme } from "@mui/material"
import { motion } from "framer-motion"
import { getUserFiles } from "../services/fileService"
import FileUpload from "../components/Files/FileUpload"
import FileList from "../components/Files/FileList"
import LoadingSpinner from "../components/UI/LoadingSpinner"
import ErrorMessage from "../components/UI/ErrorMessage"
import type { CodeFile } from "../types"

const FilesPage = () => {
  const [files, setFiles] = useState<CodeFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasInitialLoad, setHasInitialLoad] = useState(false)
  const theme = useTheme()

  const fetchFiles = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getUserFiles()

      // Handle different response formats
      const filesArray = Array.isArray(data) ? data : []
      setFiles(filesArray)
      setHasInitialLoad(true)
    } catch (error: any) {
      console.error("Error fetching files:", error)

      // Don't show error for new users - just set empty array
      if (error?.response?.status === 404 || error?.response?.status === 204) {
        // No files found - this is normal for new users
        setFiles([])
        setHasInitialLoad(true)
        setError(null)
      } else {
        // Only show error for actual server problems
        setError("Failed to load files. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const handleFileUploaded = () => {
    fetchFiles()
  }

  // Show loading only on initial load
  if (loading && !hasInitialLoad) {
    return <LoadingSpinner message="Loading your files..." />
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 800,
              background: "linear-gradient(90deg, #00E676 0%, #69F0AE 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
            }}
          >
            Your Code Repository
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
            Upload, manage, and track versions of your code files with intelligent analysis and comparison tools.
          </Typography>
        </Box>
      </motion.div>

      {/* Always show file upload - this is critical for new users! */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <FileUpload files={files} onFileUploaded={handleFileUploaded} />
      </motion.div>

      {/* Show error only if it's a real server error AND we have initial load */}
      {error && hasInitialLoad && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <ErrorMessage message={error} onRetry={fetchFiles} />
        </motion.div>
      )}

      {/* Show file list - it handles empty state gracefully */}
      {hasInitialLoad && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <FileList files={files} setFiles={setFiles} loading={loading && hasInitialLoad} />
        </motion.div>
      )}
    </Container>
  )
}

export default FilesPage
