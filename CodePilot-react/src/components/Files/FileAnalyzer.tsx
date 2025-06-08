"use client"

import { useState } from "react"
import { Button, Drawer, Typography, Box, Paper, Chip, Divider, Alert, useTheme } from "@mui/material"
import { Psychology as AIIcon, Close as CloseIcon, Lightbulb, BugReport, Speed, Security } from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"
import { analyzeCode } from "../../services/aiService"
import LoadingSpinner from "../UI/LoadingSpinner"

interface FileAnalyzerProps {
  content: string | null
}

const FileAnalyzer = ({ content }: FileAnalyzerProps) => {
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const theme = useTheme()

  const analyzeFile = async () => {
    if (!content) {
      setError("No content to analyze")
      return
    }

    setLoading(true)
    setSuggestions(null)
    setError(null)
    setOpen(true)

    try {
      const result = await analyzeCode(content)
      setSuggestions(result)
    } catch (error: any) {
      console.error("Error analyzing file:", error)
      setError("Failed to analyze code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const analysisCategories = [
    { icon: <Lightbulb />, label: "Improvements", color: "#FFA726" },
    { icon: <BugReport />, label: "Bug Fixes", color: "#EF5350" },
    { icon: <Speed />, label: "Performance", color: "#42A5F5" },
    { icon: <Security />, label: "Security", color: "#66BB6A" },
  ]

  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={analyzeFile}
          disabled={!content || loading}
          startIcon={<AIIcon />}
          sx={{
            borderRadius: 8,
            px: 3,
            py: 1.5,
            background: "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
            "&:hover": {
              background: "linear-gradient(45deg, #5a67d8 0%, #6b46c1 100%)",
              boxShadow: "0 12px 40px rgba(102, 126, 234, 0.6)",
              transform: "translateY(-2px)",
            },
            "&:disabled": {
              background: theme.palette.action.disabledBackground,
            },
          }}
        >
          AI Analysis
        </Button>
      </motion.div>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: 400 },
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          },
        }}
      >
        <Box sx={{ p: 3, height: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h5" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AIIcon color="primary" />
              AI Code Analysis
            </Typography>
            <Button onClick={() => setOpen(false)} sx={{ minWidth: "auto", p: 1 }}>
              <CloseIcon />
            </Button>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Analysis Categories
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {analysisCategories.map((category, index) => (
                <Chip
                  key={index}
                  icon={category.icon}
                  label={category.label}
                  size="small"
                  sx={{
                    bgcolor: `${category.color}15`,
                    color: category.color,
                    border: `1px solid ${category.color}30`,
                  }}
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <LoadingSpinner message="Analyzing your code..." />
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              </motion.div>
            ) : suggestions ? (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
                    border: `1px solid ${theme.palette.primary.main}20`,
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Lightbulb color="primary" />
                    AI Suggestions
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.6,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {suggestions}
                  </Typography>
                </Paper>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <AIIcon sx={{ fontSize: 64, color: theme.palette.text.secondary, opacity: 0.5, mb: 2 }} />
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    Click "AI Analysis" to get intelligent suggestions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Our AI will analyze your code for improvements, bugs, performance optimizations, and security
                    issues.
                  </Typography>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Drawer>
    </>
  )
}

export default FileAnalyzer
