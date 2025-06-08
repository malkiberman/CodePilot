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
import { Email, Lock, Person, HowToReg } from "@mui/icons-material"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "../services/authService"

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  })
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const theme = useTheme()
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {
      username: !formData.username || formData.username.length < 3,
      email: !formData.email || !/\S+@\S+\.\S+/.test(formData.email),
      password: !formData.password || formData.password.length < 6,
      confirmPassword: formData.password !== formData.confirmPassword,
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setMessage("")

    try {
      await registerUser(formData.username, formData.email, formData.password)
      setMessage("Registration successful! Redirecting to login...")
      setTimeout(() => navigate("/login"), 2000)
    } catch (error) {
      setMessage("Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }))
    }
  }

  const inputFields = [
    {
      name: "username",
      label: "Username",
      type: "text",
      icon: <Person color="primary" />,
      helperText: "Username must be at least 3 characters",
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      icon: <Email color="primary" />,
      helperText: "Please enter a valid email address",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      icon: <Lock color="primary" />,
      helperText: "Password must be at least 6 characters",
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      icon: <Lock color="primary" />,
      helperText: "Passwords do not match",
    },
  ]

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
                Join CodePilot
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Create your account and start managing code versions
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
            {inputFields.map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <TextField
                  fullWidth
                  label={field.label}
                  type={field.type}
                  margin="normal"
                  value={formData[field.name]}
                  onChange={handleInputChange(field.name)}
                  error={errors[field.name]}
                  helperText={errors[field.name] ? field.helperText : ""}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">{field.icon}</InputAdornment>,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting}
                startIcon={isSubmitting ? null : <HowToReg />}
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
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
              </Button>
            </motion.div>
          </Box>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.8 }}>
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Typography variant="body1" color="text.secondary" textAlign="center">
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: theme.palette.primary.main,
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Sign in here
              </Link>
            </Typography>
          </motion.div>
        </Paper>
      </motion.div>
    </Container>
  )
}

export default RegisterPage
