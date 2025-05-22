"use client"

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  Tooltip,
  Avatar,
} from "@mui/material"
import type { FC } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Brightness4, Brightness7, Code, Home, Login, PersonAdd, Folder } from "@mui/icons-material"

interface ToolbarProps {
  isAuthenticated: boolean
  setIsAuthenticated: (auth: boolean) => void
  mode: "light" | "dark"
  setMode: (mode: "light" | "dark") => void
}

const CustomToolbar: FC<ToolbarProps> = ({ isAuthenticated, setIsAuthenticated, mode, setMode }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const handleLogout = () => {
    sessionStorage.removeItem("token")
    setIsAuthenticated(false)
    navigate("/login")
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              mr: 2,
              width: 40,
              height: 40,
              boxShadow: "0 0 10px rgba(0, 230, 118, 0.5)",
              animation: "glow 1.5s infinite alternate",
            }}
          >
            <Code />
          </Avatar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "text.primary",
              fontWeight: 700,
              letterSpacing: "0.5px",
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(90deg, #00E676 0%, #69F0AE 100%)"
                  : "linear-gradient(90deg, #00C853 0%, #00E676 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              "&:hover": {
                transform: "scale(1.05)",
                transition: "transform 0.3s ease",
              },
            }}
          >
            CodePilot
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isAuthenticated ? (
            <>
              {!isMobile && (
                <Tooltip title="Files">
                  <Button
                    color="inherit"
                    component={Link}
                    to="/files"
                    startIcon={<Folder />}
                    sx={{
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: isActive("/files") ? "10%" : "50%",
                        width: isActive("/files") ? "80%" : "0%",
                        height: "2px",
                        bgcolor: "primary.main",
                        transition: "all 0.3s ease",
                      },
                      "&:hover::after": {
                        left: "10%",
                        width: "80%",
                      },
                    }}
                  >
                    Files
                  </Button>
                </Tooltip>
              )}
              <Button
                color="inherit"
                onClick={handleLogout}
                variant="outlined"
                sx={{
                  borderColor: "primary.main",
                  "&:hover": {
                    borderColor: "primary.light",
                    bgcolor: "rgba(0, 230, 118, 0.1)",
                  },
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              {!isMobile && (
                <Tooltip title="Home">
                  <Button
                    color="inherit"
                    component={Link}
                    to="/"
                    startIcon={<Home />}
                    sx={{
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: isActive("/") ? "10%" : "50%",
                        width: isActive("/") ? "80%" : "0%",
                        height: "2px",
                        bgcolor: "primary.main",
                        transition: "all 0.3s ease",
                      },
                      "&:hover::after": {
                        left: "10%",
                        width: "80%",
                      },
                    }}
                  >
                    Home
                  </Button>
                </Tooltip>
              )}
              <Tooltip title="Login">
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  startIcon={<Login />}
                  sx={{
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: isActive("/login") ? "10%" : "50%",
                      width: isActive("/login") ? "80%" : "0%",
                      height: "2px",
                      bgcolor: "primary.main",
                      transition: "all 0.3s ease",
                    },
                    "&:hover::after": {
                      left: "10%",
                      width: "80%",
                    },
                  }}
                >
                  Login
                </Button>
              </Tooltip>
              <Tooltip title="Register">
                <Button
                  color="primary"
                  component={Link}
                  to="/register"
                  startIcon={<PersonAdd />}
                  variant="contained"
                  sx={{
                    boxShadow: "0 4px 14px rgba(0, 230, 118, 0.4)",
                  }}
                >
                  Register
                </Button>
              </Tooltip>
            </>
          )}
          <Tooltip title={mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton
              onClick={() => setMode(mode === "dark" ? "light" : "dark")}
              sx={{
                ml: 1,
                bgcolor: "background.paper",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "rotate(30deg)",
                  bgcolor: mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
                },
              }}
            >
              {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default CustomToolbar
