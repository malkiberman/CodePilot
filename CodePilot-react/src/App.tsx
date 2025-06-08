"use client"

import { BrowserRouter as Router } from "react-router-dom"
import { Routes, Route, Navigate } from "react-router-dom"
import { Box, CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import { useState } from "react"
import { getCustomTheme } from "./theme/customTheme"
import { useAuth } from "./hooks/useAuth"
import Navbar from "./components/Layout/Navbar"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import FilesPage from "./pages/FilesPage"
import FileViewerPage from "./pages/FileViewerPage"
import LoadingSpinner from "./components/UI/LoadingSpinner"

const App = () => {
  const [mode, setMode] = useState<"light" | "dark">("dark")
  const { isAuthenticated, loading, login, logout } = useAuth()
  const theme = getCustomTheme(mode)

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoadingSpinner message="Initializing CodePilot..." />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Navbar isAuthenticated={isAuthenticated} onLogout={logout} mode={mode} setMode={setMode} />

          <Box component="main" sx={{ flexGrow: 1, pt: 8 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/login"
                element={!isAuthenticated ? <LoginPage onLogin={login} /> : <Navigate to="/files" replace />}
              />
              <Route
                path="/register"
                element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/files" replace />}
              />
              <Route path="/files" element={isAuthenticated ? <FilesPage /> : <Navigate to="/login" replace />} />
              <Route
                path="/files/:fileId"
                element={isAuthenticated ? <FileViewerPage /> : <Navigate to="/login" replace />}
              />
              <Route path="*" element={<Navigate to={isAuthenticated ? "/files" : "/"} replace />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  )
}

export default App
