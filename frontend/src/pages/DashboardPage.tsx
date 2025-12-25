import React from 'react'
import { Box, Typography } from '@mui/material'

export default function DashboardPage() {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h5">Dashboard</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>Place dashboard widgets and live graphs here.</Typography>
    </Box>
  )
}
