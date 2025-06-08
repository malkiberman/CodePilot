"use client"

import { useParams } from "react-router-dom"
import {
  Box,
  Paper,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  useTheme,
  IconButton,
  Tooltip,
  Container,
  Alert,
  CircularProgress,
} from "@mui/material"
import { CompareArrows, History, Code as CodeIcon, FilePresent, Download, Share, Close } from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneLight, oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useFileData } from "../hooks/useFileData"
import { useFileComparison } from "../hooks/useFileComparison"
import { getLanguageFromFileName, formatDate } from "../utils"
import LoadingSpinner from "../components/UI/LoadingSpinner"
import ErrorMessage from "../components/UI/ErrorMessage"
import FileAnalyzer from "../components/Files/FileAnalyzer"

const FileViewerPage = () => {
  const { fileId } = useParams<{ fileId: string }>()
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === "dark"

  // Use cleaned hooks
  const { fileData, displayedContent, loading, error, fetchFileContent } = useFileData(fileId)

  const {
    isComparing,
    selectedVersionId,
    comparedContent,
    diff,
    isLoading: compareLoading,
    error: compareError,
    handleCompare,
    startCompare,
    stopCompare,
  } = useFileComparison(fileData, displayedContent, fetchFileContent)

  // Loading state
  if (loading) {
    return (
      <Box sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner message="Loading file..." />
      </Box>
    )
  }

  // Error state
  if (error || !fileData) {
    return (
      <Box sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ErrorMessage message={error || "File not found"} />
      </Box>
    )
  }

  const language = getLanguageFromFileName(fileData.name)

  // Custom scrollbar styles
  const scrollbarStyles = {
    overflowX: "hidden",
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      background: theme.palette.primary.main,
      borderRadius: "3px",
      "&:hover": {
        background: theme.palette.primary.dark,
      },
    },
    scrollbarWidth: "thin",
    scrollbarColor: `${theme.palette.primary.main} transparent`,
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        pt: 8,
        pb: 2,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          height: "calc(100vh - 80px)",
          display: "flex",
          flexDirection: "column",
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* File Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Paper
            elevation={3}
            sx={{
              px: 3,
              py: 2,
              mb: 2,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
              border: `1px solid ${theme.palette.divider}`,
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "3px",
                background: "linear-gradient(90deg, #00C853, #69F0AE)",
              },
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
              {/* File Info */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
                <FilePresent color="primary" sx={{ fontSize: 28 }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h6" fontWeight={700} noWrap>
                    {fileData.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <Chip
                      label={language.charAt(0).toUpperCase() + language.slice(1)}
                      size="small"
                      color="primary"
                      variant="outlined"
                      icon={<CodeIcon sx={{ fontSize: 14 }} />}
                    />
                    {fileData.versions.length > 0 && (
                      <Chip
                        label={`${fileData.versions.length} version${fileData.versions.length !== 1 ? "s" : ""}`}
                        size="small"
                        color="secondary"
                        variant="outlined"
                        icon={<History sx={{ fontSize: 14 }} />}
                      />
                    )}
                  </Box>
                </Box>
              </Box>

              {/* Controls */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
                {isComparing && (
                  <FormControl size="small" sx={{ minWidth: 220 }}>
                    <InputLabel>Compare Version</InputLabel>
                    <Select
                      value={selectedVersionId || ""}
                      onChange={(e) => handleCompare(Number(e.target.value))}
                      label="Compare Version"
                      disabled={compareLoading}
                    >
                      <MenuItem value={0}>Current File</MenuItem>
                      {fileData.versions.map((version, index) => (
                        <MenuItem key={version.versionId} value={version.versionId}>
                          Version {index + 1} - {formatDate(version.createdAt)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                <Tooltip title="Download File">
                  <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
                    <Download />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Share File">
                  <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
                    <Share />
                  </IconButton>
                </Tooltip>

                <Button
                  variant={isComparing ? "outlined" : "contained"}
                  onClick={isComparing ? stopCompare : startCompare}
                  startIcon={
                    compareLoading ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : isComparing ? (
                      <Close />
                    ) : (
                      <CompareArrows />
                    )
                  }
                  disabled={fileData.versions.length === 0 || compareLoading}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    fontWeight: 600,
                  }}
                >
                  {isComparing ? "Stop Compare" : "Compare Versions"}
                </Button>
              </Box>
            </Box>
          </Paper>
        </motion.div>

        {/* No Versions Alert */}
        {fileData.versions.length === 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
              This file has no versions yet. Upload a new version to enable comparison features.
            </Alert>
          </motion.div>
        )}

        {/* Compare Error Alert */}
        {compareError && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {compareError}
            </Alert>
          </motion.div>
        )}

        {/* Main Content Area */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Paper
            elevation={4}
            sx={{
              flex: 1,
              borderRadius: 3,
              overflow: "hidden",
              display: "flex",
              border: `1px solid ${theme.palette.divider}`,
              minHeight: 0, // Important for flex children
            }}
          >
            {/* Original File Panel */}
            <Box
              sx={{
                width: isComparing ? "50%" : "100%",
                height: "100%",
                transition: "width 0.3s ease-in-out",
                borderRight: isComparing ? `1px solid ${theme.palette.divider}` : "none",
                display: "flex",
                flexDirection: "column",
                minWidth: 0, // Important for flex children
              }}
            >
              {/* Original File Header */}
              <Box
                sx={{
                  px: 3,
                  py: 1.5,
                  bgcolor: theme.palette.primary.main,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  minHeight: 48,
                  flexShrink: 0,
                }}
              >
                <CodeIcon sx={{ fontSize: 20 }} />
                <Typography variant="subtitle1" fontWeight={600}>
                  Original File
                </Typography>
              </Box>

              {/* Original File Content */}
              <Box
                sx={{
                  flex: 1,
                  ...scrollbarStyles,
                  "& pre": {
                    margin: "0 !important",
                    height: "100% !important",
                  },
                }}
              >
                {displayedContent ? (
                  <SyntaxHighlighter
                    language={language}
                    style={isDarkMode ? oneDark : oneLight}
                    showLineNumbers
                    wrapLines={true}
                    wrapLongLines={true}
                    customStyle={{
                      margin: 0,
                      padding: "20px",
                      height: "100%",
                      background: "transparent",
                      fontSize: "14px",
                      lineHeight: "1.5",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      overflowX: "hidden",
                    }}
                    lineNumberStyle={{
                      minWidth: "3em",
                      paddingRight: "1em",
                      textAlign: "right",
                      userSelect: "none",
                      fontSize: "13px",
                    }}
                  >
                    {displayedContent}
                  </SyntaxHighlighter>
                ) : (
                  <Box
                    sx={{
                      p: 4,
                      textAlign: "center",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      bgcolor: theme.palette.background.default,
                    }}
                  >
                    <CodeIcon sx={{ fontSize: 64, color: theme.palette.text.secondary, opacity: 0.5, mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Content Available
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Unable to load file content
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Comparison Panel */}
            <AnimatePresence>
              {isComparing && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "50%", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{
                    height: "100%",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                  }}
                >
                  {/* Comparison Header */}
                  <Box
                    sx={{
                      px: 3,
                      py: 1.5,
                      bgcolor: theme.palette.secondary.main,
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      minHeight: 48,
                      flexShrink: 0,
                    }}
                  >
                    <CompareArrows sx={{ fontSize: 20 }} />
                    <Typography variant="subtitle1" fontWeight={600} noWrap>
                      {selectedVersionId === 0
                        ? "Current File"
                        : selectedVersionId
                          ? `Version ${fileData.versions.findIndex((v) => v.versionId === selectedVersionId) + 1}`
                          : "Select Version"}
                    </Typography>
                  </Box>

                  {/* Comparison Content */}
                  <Box
                    sx={{
                      flex: 1,
                      ...scrollbarStyles,
                      "& pre": {
                        margin: "0 !important",
                        height: "100% !important",
                      },
                    }}
                  >
                    {compareLoading ? (
                      <Box
                        sx={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CircularProgress size={40} />
                      </Box>
                    ) : comparedContent !== null ? (
                      diff.length > 0 ? (
                        // Diff view with changes highlighted
                        <Box sx={{ height: "100%" }}>
                          {diff.map((part, index) => (
                            <Box
                              key={index}
                              sx={{
                                backgroundColor: part.added
                                  ? "rgba(0, 230, 118, 0.1)"
                                  : part.removed
                                    ? "rgba(255, 82, 82, 0.1)"
                                    : "transparent",
                                borderLeft: part.added
                                  ? `3px solid ${theme.palette.success.main}`
                                  : part.removed
                                    ? `3px solid ${theme.palette.error.main}`
                                    : "3px solid transparent",
                                position: "relative",
                              }}
                            >
                              <SyntaxHighlighter
                                language={language}
                                style={isDarkMode ? oneDark : oneLight}
                                showLineNumbers
                                wrapLines={true}
                                wrapLongLines={true}
                                customStyle={{
                                  margin: 0,
                                  padding: "20px",
                                  background: "transparent",
                                  fontSize: "14px",
                                  lineHeight: "1.5",
                                  whiteSpace: "pre-wrap",
                                  wordBreak: "break-word",
                                  overflowX: "hidden",
                                }}
                                lineNumberStyle={{
                                  minWidth: "3em",
                                  paddingRight: "1em",
                                  textAlign: "right",
                                  userSelect: "none",
                                  fontSize: "13px",
                                }}
                              >
                                {part.value}
                              </SyntaxHighlighter>
                              {(part.added || part.removed) && (
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    bgcolor: part.added ? theme.palette.success.main : theme.palette.error.main,
                                    color: "white",
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    fontSize: "11px",
                                    fontWeight: 600,
                                  }}
                                >
                                  {part.added ? "ADDED" : "REMOVED"}
                                </Box>
                              )}
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        // Full file view (no differences)
                        <SyntaxHighlighter
                          language={language}
                          style={isDarkMode ? oneDark : oneLight}
                          showLineNumbers
                          wrapLines={true}
                          wrapLongLines={true}
                          customStyle={{
                            margin: 0,
                            padding: "20px",
                            height: "100%",
                            background: "transparent",
                            fontSize: "14px",
                            lineHeight: "1.5",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            overflowX: "hidden",
                          }}
                          lineNumberStyle={{
                            minWidth: "3em",
                            paddingRight: "1em",
                            textAlign: "right",
                            userSelect: "none",
                            fontSize: "13px",
                          }}
                        >
                          {comparedContent}
                        </SyntaxHighlighter>
                      )
                    ) : (
                      // No version selected
                      <Box
                        sx={{
                          p: 4,
                          textAlign: "center",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          bgcolor: theme.palette.background.default,
                        }}
                      >
                        <CompareArrows
                          sx={{ fontSize: 64, color: theme.palette.text.secondary, opacity: 0.5, mb: 2 }}
                        />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          Select Version to Compare
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Choose a version from the dropdown above to see the differences
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Paper>
        </motion.div>

        {/* Diff Summary */}
        <AnimatePresence>
          {isComparing && comparedContent !== null && diff.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Paper
                elevation={2}
                sx={{
                  mt: 2,
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${theme.palette.warning.main}08 0%, ${theme.palette.info.main}08 100%)`,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Comparison Summary:
                  </Typography>
                  <Chip
                    label={`${diff.filter((d) => d.added).length} additions`}
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`${diff.filter((d) => d.removed).length} deletions`}
                    color="error"
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`${diff.filter((d) => !d.added && !d.removed).length} unchanged`}
                    color="default"
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      {/* AI Analyzer */}
      {displayedContent && <FileAnalyzer content={displayedContent} />}
    </Box>
  )
}

export default FileViewerPage
