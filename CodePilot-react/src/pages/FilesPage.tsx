"use client"

import { useState, useEffect } from "react"
import { Container, Typography, Box } from "@mui/material"
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
  

  const fetchFiles = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getUserFiles()
      setFiles(data)
    } catch (error) {
      console.error("Error fetching files:", error)
      setError("Failed to load files. Please try again.")
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

  if (loading) {
    return <LoadingSpinner message="Loading your files..." />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchFiles} />
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

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <FileUpload files={files} onFileUploaded={handleFileUploaded} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <FileList files={files} setFiles={setFiles} />
      </motion.div>
    </Container>
  )
}

export default FilesPage
