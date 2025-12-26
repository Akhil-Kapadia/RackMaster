import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'
import { Item } from './StatusBox'

type Props = {
  item: Item | null
  open: boolean
  onClose: () => void
}

export default function ItemModal({ item, open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{item ? item.name : ''}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Status: {item?.status ?? 'unknown'}
        </Typography>
        <Typography variant="body2">Replace this with the TBD modal component and detailed content fetched from the API for the selected item.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
