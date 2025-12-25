import React from 'react'
import { Box, Typography } from '@mui/material'

export default function SettingsPage() {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h5">Settings</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>Application settings and preferences.</Typography>
    </Box>
  )
}
