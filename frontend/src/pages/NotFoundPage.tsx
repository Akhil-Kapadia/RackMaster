import React from 'react'
import { Box, Typography } from '@mui/material'

export default function NotFoundPage() {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h5">404 — Not Found</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>The requested page was not found.</Typography>
    </Box>
  )
}
