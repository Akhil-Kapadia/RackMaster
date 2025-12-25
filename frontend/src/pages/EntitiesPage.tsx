import React from 'react'
import { Box, Typography } from '@mui/material'

export default function EntitiesPage() {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h5">Entities</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>List and manage racks, units and devices.</Typography>
    </Box>
  )
}
