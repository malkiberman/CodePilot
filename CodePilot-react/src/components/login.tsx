"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  InputAdornment,
  Paper,
  useTheme,
  Divider,
  CircularProgress,
} from "@mui/material"
import { Email, Lock, HelpOutline, Login as LoginIcon } from "@mui/icons-material"
import { useNavigate, Link } from "react-router-dom"
import { loginUser } from "../services/authService"
import { motion } from "framer-motion"

interface LoginProps {
  setIsAuthenticated: (auth: boolean) => void
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()

  const validateForm = () => {
    setEmailError(false)
    setPasswordError(false)
    let valid = true

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true)
      valid = false
    }

    if (!password || password.length < 6) {
      setPasswordError(true)
      valid = false
    }

    return valid
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const data = await loginUser(email, password)
      sessionStorage.setItem("token", data)
      setIsAuthenticated(true)
      setMessage(`Login successful! Welcome ${data.username}`)

      setTimeout(() => navigate("/files"), 100)
    } catch (error) {
      setMessage("Login failed. Check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxWidth="xs">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              width: "100%",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "5px",
                background: "linear-gradient(90deg, #00C853 0%, #00E676 50%, #69F0AE 100%)",
              },
            }}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(90deg, #00E676 0%, #69F0AE 100%)"
                      : "linear-gradient(90deg, #00C853 0%, #00E676 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Welcome Back
              </Typography>
            </motion.div>

            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Sign in to continue to CodePilot
            </Typography>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Typography
                  color={message.includes("successful") ? "success.main" : "error.main"}
                  sx={{
                    mb: 2,
                    p: 1,
                    borderRadius: 1,
                    bgcolor: message.includes("successful") ? "rgba(105, 240, 174, 0.1)" : "rgba(255, 82, 82, 0.1)",
                  }}
                >
                  {message}
                </Typography>
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                helperText={emailError ? "Please enter a valid email" : ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                helperText={passwordError ? "Password must be at least 6 characters" : ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.5,
                  position: "relative",
                  overflow: "hidden",
                }}
                disabled={isLoading}
                startIcon={isLoading ? null : <LoginIcon />}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : "Login"}
              </Button>
            </form>

            <Button
              onClick={() => setMessage("Redirecting to password recovery...")}
              sx={{
                mt: 2,
                textTransform: "none",
                color: "text.secondary",
                "&:hover": {
                  color: "primary.main",
                  bgcolor: "transparent",
                },
              }}
            >
              <HelpOutline sx={{ mr: 1, fontSize: 16 }} />
              Forgot Password?
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: theme.palette.primary.main,
                  textDecoration: "none",
                  fontWeight: 600,
                  position: "relative",
                }}
              >
                Sign up
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -2,
                    left: 0,
                    width: "100%",
                    height: "2px",
                    bgcolor: "primary.main",
                    transition: "transform 0.3s ease",
                    transform: "scaleX(0)",
                    transformOrigin: "left",
                    "&:hover": {
                      transform: "scaleX(1)",
                    },
                  }}
                />
              </Link>
            </Typography>
          </Paper>
        </Box>
      </motion.div>
    </Container>
  )
}

export default Login
