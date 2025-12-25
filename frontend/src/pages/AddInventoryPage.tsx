import React from 'react'
import { Box, Typography } from '@mui/material'

export default function AddInventoryPage() {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h5">Add Inventory</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>Form to add inventory items.</Typography>
    </Box>
  )
}
