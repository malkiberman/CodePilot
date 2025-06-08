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
  Alert,
} from "@mui/material"
import { Email, Lock, HelpOutline, Login as LoginIcon } from "@mui/icons-material"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { loginUser } from "../services/authService"

interface LoginPageProps {
  onLogin: (token: string) => void
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({ email: false, password: false })
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()

  const validateForm = () => {
    const newErrors = {
      email: !formData.email || !/\S+@\S+\.\S+/.test(formData.email),
      password: !formData.password || formData.password.length < 6,
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setMessage("")

    try {
      const token = await loginUser(formData.email, formData.password)
      onLogin(token)
      setMessage("Login successful! Redirecting...")
      setTimeout(() => navigate("/files"), 1000)
    } catch (error) {
      setMessage("Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }))
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Paper
          elevation={8}
          sx={{
            p: 5,
            borderRadius: 4,
            position: "relative",
            overflow: "hidden",
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "6px",
              background: "linear-gradient(90deg, #00C853 0%, #00E676 50%, #69F0AE 100%)",
            },
          }}
        >
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.4, delay: 0.2 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  background: "linear-gradient(90deg, #00E676 0%, #69F0AE 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                Welcome Back
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Sign in to continue your coding journey
              </Typography>
            </Box>
          </motion.div>

          {message && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Alert severity={message.includes("successful") ? "success" : "error"} sx={{ mb: 3, borderRadius: 2 }}>
                {message}
              </Alert>
            </motion.div>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                margin="normal"
                value={formData.email}
                onChange={handleInputChange("email")}
                error={errors.email}
                helperText={errors.email ? "Please enter a valid email address" : ""}
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                value={formData.password}
                onChange={handleInputChange("password")}
                error={errors.password}
                helperText={errors.password ? "Password must be at least 6 characters" : ""}
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                startIcon={isLoading ? null : <LoginIcon />}
                sx={{
                  mt: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: "1.1rem",
                  background: "linear-gradient(45deg, #00E676 0%, #69F0AE 100%)",
                  boxShadow: "0 8px 32px rgba(0, 230, 118, 0.4)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #00C853 0%, #00E676 100%)",
                    boxShadow: "0 12px 40px rgba(0, 230, 118, 0.6)",
                    transform: "translateY(-2px)",
                  },
                  "&:disabled": {
                    background: theme.palette.action.disabledBackground,
                  },
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
              </Button>
            </motion.div>
          </Box>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.6 }}>
            <Button
              fullWidth
              onClick={() => setMessage("Password recovery feature coming soon...")}
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
              <HelpOutline sx={{ mr: 1, fontSize: 18 }} />
              Forgot your password?
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Typography variant="body1" color="text.secondary" textAlign="center">
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: theme.palette.primary.main,
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Create one here
              </Link>
            </Typography>
          </motion.div>
        </Paper>
      </motion.div>
    </Container>
  )
}

export default LoginPage
