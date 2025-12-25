import React from 'react'
import { Box, Typography } from '@mui/material'

export default function ManageInventoryPage() {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h5">Manage Inventory</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>Tools to search and update inventory.</Typography>
    </Box>
  )
}
