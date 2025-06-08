"use client"

import { Box, Typography, Button, Container, Grid, Paper, useTheme } from "@mui/material"
import { motion } from "framer-motion"
import { Code, CloudUpload, CompareArrows, GitHub, Speed, Security, Analytics } from "@mui/icons-material"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

const codeSnippets = [
  "git commit -m 'Initial commit'",
  "npm install @mui/material",
  "docker build -t myapp .",
  "yarn start",
  "npx eslint . --fix",
  "python manage.py migrate",
  "cargo build --release",
  "kubectl apply -f deployment.yaml",
]

const AnimatedBackground = () => {
  const theme = useTheme()

  const shapes = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: 100 + Math.random() * 200,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 20 + Math.random() * 10,
  }))

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        zIndex: -1,
      }}
    >
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          style={{
            position: "absolute",
            width: shape.size,
            height: shape.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}05 70%)`,
            filter: "blur(40px)",
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </Box>
  )
}

const TypingAnimation = () => {
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
          setTimeout(() => setIsDeleting(true), 1500)
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
    <Box sx={{ minHeight: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "monospace",
            color: theme.palette.primary.main,
            textShadow: theme.palette.mode === "dark" ? "0 0 20px rgba(0, 230, 118, 0.3)" : "none",
            position: "relative",
            minHeight: "1.5em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span>{currentText}</span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
            style={{ marginLeft: 4 }}
          >
            |
          </motion.span>
        </Typography>
      </motion.div>
    </Box>
  )
}

type FeatureCardProps = {
  icon: React.ReactNode
  title: string
  description: string
  delay?: number
}

const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => {
  const theme = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -10, scale: 1.02 }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          borderRadius: 3,
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          border: `1px solid ${theme.palette.divider}`,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "4px",
            background: "linear-gradient(90deg, #00C853, #69F0AE)",
          },
          "&:hover": {
            boxShadow: `0 20px 40px ${theme.palette.primary.main}20`,
          },
        }}
      >
        <Box
          sx={{
            bgcolor: `${theme.palette.primary.main}15`,
            p: 2,
            borderRadius: "50%",
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
        <Typography variant="h5" gutterBottom fontWeight="700" color="text.primary">
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {description}
        </Typography>
      </Paper>
    </motion.div>
  )
}

const HomePage = () => {
  const theme = useTheme()

  const features = [
    {
      icon: <Code sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Smart Version Control",
      description:
        "Advanced versioning system that tracks every change in your codebase with intelligent diff algorithms and seamless rollback capabilities.",
    },
    {
      icon: <CompareArrows sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Visual Diff Comparison",
      description:
        "Side-by-side comparison tool with syntax highlighting that makes it easy to spot changes and understand code evolution.",
    },
    {
      icon: <CloudUpload sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Seamless File Management",
      description:
        "Drag-and-drop interface with support for multiple programming languages and automatic language detection.",
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "AI-Powered Analysis",
      description:
        "Get intelligent suggestions for code improvements, bug fixes, performance optimizations, and security enhancements.",
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Lightning Fast",
      description:
        "Optimized performance with instant file loading, real-time syntax highlighting, and responsive user interface.",
    },
    {
      icon: <Security sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Secure & Private",
      description:
        "Enterprise-grade security with encrypted file storage, secure authentication, and privacy-first architecture.",
    },
  ]

  return (
    <Box sx={{ overflow: "hidden" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          px: 4,
          py: 8,
        }}
      >
        <AnimatedBackground />

        <Container maxWidth="lg">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Typography
              variant="h1"
              sx={{
                mb: 3,
                fontWeight: 800,
                background: "linear-gradient(90deg, #00E676 0%, #69F0AE 50%, #00C853 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "3rem", md: "4.5rem", lg: "5.5rem" },
                lineHeight: 1.1,
              }}
            >
              CodePilot
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant="h4"
              sx={{
                color: theme.palette.text.secondary,
                mb: 4,
                fontWeight: 400,
                fontSize: { xs: "1.5rem", md: "2rem" },
                maxWidth: 800,
                mx: "auto",
              }}
            >
              The Future of Code Version Management
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                mb: 6,
                fontWeight: 300,
                maxWidth: 600,
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              Smart versioning, visual diffs, AI-powered analysis, and total control over your codebase evolution.
            </Typography>
          </motion.div>

          <TypingAnimation />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            style={{ marginTop: "3rem" }}
          >
            <Box sx={{ display: "flex", gap: 3, justifyContent: "center", flexWrap: "wrap" }}>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                startIcon={<GitHub />}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: "1.1rem",
                  borderRadius: 3,
                  background: "linear-gradient(45deg, #00E676 0%, #69F0AE 100%)",
                  boxShadow: "0 8px 32px rgba(0, 230, 118, 0.4)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #00C853 0%, #00E676 100%)",
                    boxShadow: "0 12px 40px rgba(0, 230, 118, 0.6)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Get Started Free
              </Button>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: "1.1rem",
                  borderRadius: 3,
                  borderWidth: 2,
                  "&:hover": {
                    borderWidth: 2,
                    backgroundColor: `${theme.palette.primary.main}10`,
                  },
                }}
              >
                Sign In
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            textAlign="center"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            Powerful Features
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 8, maxWidth: 600, mx: "auto" }}>
            Everything you need to manage your code versions like a pro
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <FeatureCard {...feature} delay={index * 0.1} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
          py: 10,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Box textAlign="center">
              <Typography variant="h3" mb={3} fontWeight="bold" color="text.primary">
                Ready to Transform Your Workflow?
              </Typography>
              <Typography variant="h6" color="text.secondary" mb={5} sx={{ maxWidth: 500, mx: "auto" }}>
                Join thousands of developers who trust CodePilot for their version control needs.
              </Typography>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: "1.2rem",
                  borderRadius: 3,
                  background: "linear-gradient(45deg, #00E676 0%, #69F0AE 100%)",
                  boxShadow: "0 8px 32px rgba(0, 230, 118, 0.4)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #00C853 0%, #00E676 100%)",
                    boxShadow: "0 12px 40px rgba(0, 230, 118, 0.6)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Start Your Journey
              </Button>
            </Box>
          </motion.div>
        </Container>

        {/* Background decoration */}
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.palette.primary.main}15 0%, transparent 70%)`,
            filter: "blur(40px)",
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
            background: `radial-gradient(circle, ${theme.palette.secondary.main}15 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
        />
      </Box>
    </Box>
  )
}

export default HomePage
