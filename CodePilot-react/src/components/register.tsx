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
import { Email, Lock, Person, AssignmentInd, HowToReg } from "@mui/icons-material"
import { registerUser } from "../services/authService"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

const Register = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [role, setRole] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const theme = useTheme()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")

    if (!email || !password || !username || !role) {
      setMessage("Please fill in all fields.")
      setIsSubmitting(false)
      return
    }

    try {
      const data = await registerUser(username, email, password, role)
      localStorage.setItem("token", data.token)
      setMessage(`Registration successful! Welcome ${data.username}`)
    } catch (error) {
      setMessage("Registration failed. Check your credentials.")
    }

    setIsSubmitting(false)
  }

  const inputFields = [
    {
      label: "Username",
      value: username,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value),
      icon: <Person color="primary" />,
      type: "text",
    },
    {
      label: "Email",
      value: email,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
      icon: <Email color="primary" />,
      type: "email",
    },
    {
      label: "Password",
      value: password,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
      icon: <Lock color="primary" />,
      type: "password",
    },
  ]

  return (
    <Container component="main" maxWidth="xs">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 8,
            marginBottom: 4,
          }}
        >
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
                Create Account
              </Typography>
            </motion.div>

            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Join CodePilot to manage your code versions
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

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
              {inputFields.map((field, index) => (
                <motion.div
                  key={field.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <TextField
                    label={field.label}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={field.value}
                    onChange={field.onChange}
                    type={field.type}
                    required
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

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  marginTop: 3,
                  py: 1.5,
                  position: "relative",
                  overflow: "hidden",
                }}
                disabled={isSubmitting}
                startIcon={isSubmitting ? null : <HowToReg />}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Register"}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: theme.palette.primary.main,
                  textDecoration: "none",
                  fontWeight: 600,
                  position: "relative",
                }}
              >
                Sign in
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

export default Register
