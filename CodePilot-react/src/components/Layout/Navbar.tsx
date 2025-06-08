"use client"

import type React from "react"

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
  Menu,
  MenuItem,
  Fade,
} from "@mui/material"
import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import {
  Brightness4,
  Brightness7,
  Code,
  Home,
  Login,
  PersonAdd,
  Folder,
  AccountCircle,
  Logout,
} from "@mui/icons-material"
import { motion } from "framer-motion"

interface NavbarProps {
  isAuthenticated: boolean
  onLogout: () => void
  mode: "light" | "dark"
  setMode: (mode: "light" | "dark") => void
}

const Navbar = ({ isAuthenticated, onLogout, mode, setMode }: NavbarProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    onLogout()
    handleMenuClose()
    navigate("/login")
  }

  const isActive = (path: string) => location.pathname === path

  const NavButton = ({ to, icon, children, ...props }: any) => (
    <Tooltip title={children}>
      <Button
        component={Link}
        to={to}
        color="inherit"
        startIcon={icon}
        sx={{
          position: "relative",
          mx: 0.5,
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: isActive(to) ? "10%" : "50%",
            width: isActive(to) ? "80%" : "0%",
            height: "2px",
            bgcolor: "primary.main",
            transition: "all 0.3s ease",
          },
          "&:hover::after": {
            left: "10%",
            width: "80%",
          },
        }}
        {...props}
      >
        {!isMobile && children}
      </Button>
    </Tooltip>
  )

  return (
    <AppBar
      position="fixed"
      sx={{
        backdropFilter: "blur(20px)",
        backgroundColor: theme.palette.mode === "dark" ? "rgba(26, 26, 26, 0.9)" : "rgba(255, 255, 255, 0.9)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  mr: 2,
                  width: 40,
                  height: 40,
                  boxShadow: "0 0 20px rgba(0, 230, 118, 0.5)",
                }}
              >
                <Code />
              </Avatar>
            </motion.div>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                textDecoration: "none",
                color: "text.primary",
                fontWeight: 700,
                letterSpacing: "0.5px",
                background: "linear-gradient(90deg, #00E676 0%, #69F0AE 100%)",
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isAuthenticated ? (
              <>
                <NavButton to="/files" icon={<Folder />}>
                  Files
                </NavButton>
                <IconButton
                  onClick={handleProfileMenuOpen}
                  sx={{
                    ml: 1,
                    bgcolor: "background.paper",
                    "&:hover": {
                      bgcolor: "rgba(0, 230, 118, 0.1)",
                    },
                  }}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  TransitionComponent={Fade}
                  sx={{
                    "& .MuiPaper-root": {
                      borderRadius: 2,
                      mt: 1,
                      minWidth: 180,
                    },
                  }}
                >
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <NavButton to="/" icon={<Home />}>
                  Home
                </NavButton>
                <NavButton to="/login" icon={<Login />}>
                  Login
                </NavButton>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  color="primary"
                  startIcon={<PersonAdd />}
                  sx={{
                    ml: 1,
                    boxShadow: "0 4px 14px rgba(0, 230, 118, 0.4)",
                    "&:hover": {
                      boxShadow: "0 6px 20px rgba(0, 230, 118, 0.6)",
                    },
                  }}
                >
                  {!isMobile && "Register"}
                </Button>
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
                    transform: "rotate(180deg)",
                    bgcolor: mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
                  },
                }}
              >
                {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
          </Box>
        </motion.div>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
