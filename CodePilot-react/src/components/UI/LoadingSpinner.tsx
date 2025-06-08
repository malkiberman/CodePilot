"use client"

import { Box, CircularProgress, Typography } from "@mui/material"
import { motion } from "framer-motion"

interface LoadingSpinnerProps {
  message?: string
  size?: number
}

const LoadingSpinner = ({ message = "Loading...", size = 40 }: LoadingSpinnerProps) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "200px",
          gap: 2,
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <CircularProgress size={size} thickness={4} />
        </motion.div>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </Box>
    </motion.div>
  )
}

export default LoadingSpinner
