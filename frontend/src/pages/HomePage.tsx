import React from 'react'
import { Box, Typography } from '@mui/material'

export default function HomePage() {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h5">Welcome</Typography>
      <Typography variant="body1" sx={{ mt: 1 }}>This is the home page. Start adding pages under <strong>src/pages</strong>.</Typography>
    </Box>
  )
}
