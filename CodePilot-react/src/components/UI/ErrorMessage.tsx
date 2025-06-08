"use client"

import { Alert, AlertTitle, Button, Box } from "@mui/material"
import { Refresh } from "@mui/icons-material"
import { motion } from "framer-motion"

interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
}

const ErrorMessage = ({ title = "Error", message, onRetry }: ErrorMessageProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
        <Alert
          severity="error"
          sx={{
            borderRadius: 2,
            "& .MuiAlert-icon": {
              fontSize: 28,
            },
          }}
        >
          <AlertTitle sx={{ fontWeight: 600 }}>{title}</AlertTitle>
          {message}
          {onRetry && (
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" color="error" startIcon={<Refresh />} onClick={onRetry} size="small">
                Try Again
              </Button>
            </Box>
          )}
        </Alert>
      </Box>
    </motion.div>
  )
}

export default ErrorMessage
