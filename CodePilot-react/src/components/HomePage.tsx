"use client"

import { useEffect, useState } from "react"
import { Box, Typography, useTheme, Button, Container, Grid, Paper } from "@mui/material"
import { motion } from "framer-motion"
import { Code, CloudUpload, CompareArrows, GitHub } from "@mui/icons-material"
import { Link } from "react-router-dom"

const codeSnippets = [
  "git commit -m 'Initial commit'",
  "npm install @mui/material",
  "docker build -t myapp .",
  "yarn start",
  "npx eslint . --fix",
]

const AnimatedShapes = () => {
  const theme = useTheme()

  const shapes = [
    { top: "10%", left: "15%", size: 240, delay: 0 },
    { top: "25%", left: "70%", size: 300, delay: 2 },
    { top: "55%", left: "40%", size: 280, delay: 4 },
    { top: "75%", left: "10%", size: 200, delay: 6 },
  ]

  return (
    <>
      {shapes.map((shape, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            top: shape.top,
            left: shape.left,
            width: shape.size,
            height: shape.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.palette.primary.main}20 0%, ${theme.palette.primary.main}05 70%)`,
            filter: "blur(40px)",
            opacity: 0.6,
            animation: `float ${30 + shape.delay}s ease-in-out ${shape.delay}s infinite alternate`,
            zIndex: 0,
          }}
        />
      ))}
      <style>
        {`
          @keyframes float {
            0% {
              transform: translateY(0px) rotate(0deg);
            }
            100% {
              transform: translateY(-60px) rotate(10deg);
            }
          }
        `}
      </style>
    </>
  )
}

const TypingCode = () => {
  const [currentText, setCurrentText] = useState("")
  const [snippetIndex, setSnippetIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const theme = useTheme()

  useEffect(() => {
    const currentSnippet = codeSnippets[snippetIndex]
    const delay = isDeleting ? 50 : 150

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentSnippet.length) {
        setCurrentText(currentSnippet.substring(0, charIndex + 1))
        setCharIndex(charIndex + 1)
      } else if (isDeleting && charIndex > 0) {
        setCurrentText(currentSnippet.substring(0, charIndex - 1))
        setCharIndex(charIndex - 1)
      } else {
        if (!isDeleting) {
          setTimeout(() => setIsDeleting(true), 1000)
        } else {
          setIsDeleting(false)
          setSnippetIndex((snippetIndex + 1) % codeSnippets.length)
          setCharIndex(0)
        }
      }
    }, delay)

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, snippetIndex])

  return (
    <Typography
      variant="h4"
      sx={{
        fontFamily: "monospace",
        color: theme.palette.primary.main,
        whiteSpace: "pre",
        minHeight: "2em",
        textShadow: theme.palette.mode === "dark" ? "0 0 10px rgba(0, 230, 118, 0.3)" : "none",
        position: "relative",
        zIndex: 1,
      }}
    >
      {currentText}
      <span className="cursor">|</span>
      <style>
        {`
          .cursor {
            display: inline-block;
            animation: blink 1s step-end infinite;
          }

          @keyframes blink {
            from, to { opacity: 0; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </Typography>
  )
}

const FeatureCard = ({ icon, title, description }) => {
  const theme = useTheme()

  return (
    <motion.div whileHover={{ y: -10, boxShadow: "0 20px 30px rgba(0, 0, 0, 0.1)" }} transition={{ duration: 0.3 }}>
      <Paper
        sx={{
          p: 4,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "5px",
            height: "100%",
            background: "linear-gradient(to bottom, #00C853, #69F0AE)",
          },
          border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"}`,
        }}
      >
        <Box
          sx={{
            bgcolor: "rgba(0, 230, 118, 0.1)",
            p: 2,
            borderRadius: "50%",
            mb: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h5" gutterBottom fontWeight="600">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Paper>
    </motion.div>
  )
}

const Home = () => {
  const theme = useTheme()

  return (
    <Box sx={{ overflow: "hidden" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          minHeight: "80vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          p: 4,
          mb: 10,
        }}
      >
        <AnimatedShapes />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Typography
            variant="h1"
            sx={{
              mb: 2,
              position: "relative",
              zIndex: 1,
            }}
          >
            CodePilot
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="h5"
            sx={{
              color: theme.palette.text.secondary,
              mb: 4,
              position: "relative",
              zIndex: 1,
            }}
          >
            Smart Versioning. Visual Diff. Total Control.
          </Typography>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}>
          <TypingCode />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{ marginTop: "2rem", zIndex: 1, position: "relative" }}
        >
          <Button
            component={Link}
            to="/register"
            variant="contained"
            color="primary"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              mr: 2,
              boxShadow: "0 8px 20px rgba(0, 230, 118, 0.3)",
            }}
            startIcon={<GitHub />}
          >
            Get Started
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            color="primary"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
              },
            }}
          >
            Sign In
          </Button>
        </motion.div>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Typography
          variant="h3"
          textAlign="center"
          mb={6}
          sx={{
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -16,
              left: "50%",
              transform: "translateX(-50%)",
              width: 100,
              height: 4,
              borderRadius: 2,
              bgcolor: "primary.main",
            },
          }}
        >
          Key Features
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <FeatureCard
              icon={<Code sx={{ fontSize: 40, color: theme.palette.primary.main }} />}
              title="Smart Code Versioning"
              description="Keep track of all your code changes with intelligent versioning that makes it easy to manage your development process."
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard
              icon={<CompareArrows sx={{ fontSize: 40, color: theme.palette.primary.main }} />}
              title="Visual Diff Comparison"
              description="Compare different versions of your code with our intuitive visual diff tool to easily spot changes and improvements."
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard
              icon={<CloudUpload sx={{ fontSize: 40, color: theme.palette.primary.main }} />}
              title="Seamless File Management"
              description="Upload, organize, and manage your code files with our user-friendly interface designed for developers."
            />
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: theme.palette.mode === "dark" ? "rgba(0, 230, 118, 0.05)" : "rgba(0, 200, 83, 0.05)",
          py: 10,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h4" mb={3} fontWeight="bold">
              Ready to take control of your code?
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              Join thousands of developers who use CodePilot to manage their code versions efficiently.
            </Typography>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                px: 6,
                py: 1.5,
                boxShadow: "0 8px 20px rgba(0, 230, 118, 0.3)",
              }}
            >
              Start for Free
            </Button>
          </Box>
        </Container>

        {/* Background Elements */}
        <Box
          sx={{
            position: "absolute",
            top: "20%",
            left: "5%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.palette.primary.main}10 0%, ${theme.palette.primary.main}00 70%)`,
            filter: "blur(40px)",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.palette.secondary.main}10 0%, ${theme.palette.secondary.main}00 70%)`,
            filter: "blur(60px)",
            zIndex: 0,
          }}
        />
      </Box>
    </Box>
  )
}

export default Home
