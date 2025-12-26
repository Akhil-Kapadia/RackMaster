import React from 'react'
import { Card, CardActionArea, CardContent, Typography, Box, Avatar } from '@mui/material'
import { Storage, Router, DevicesOther } from '@mui/icons-material'

type Status = 'ok' | 'error' | 'empty'
type BoxType = 'rack' | 'switch' | 'device'

export type Item = {
  id: string
  name: string
  status: Status
  type: BoxType
}

function StatusDot({ status }: { status: Status }) {
  const size = 14
  const bg = status === 'ok' ? 'success.main' : status === 'error' ? 'error.main' : 'transparent'
  const border = status === 'empty' ? '1px solid' : 'none'
  const borderColor = status === 'empty' ? 'grey.400' : undefined

  return (
    <Avatar
      variant="circular"
      sx={{ width: size, height: size, bgcolor: bg, border, borderColor }}
      aria-hidden
    />
  )
}

function typeIcon(t: BoxType) {
  switch (t) {
    case 'rack':
      return <Storage sx={{ fontSize: 40, color: 'primary.dark' }} />
    case 'switch':
      return <Router sx={{ fontSize: 40, color: 'primary.dark' }} />
    default:
      return <DevicesOther sx={{ fontSize: 40, color: 'primary.dark' }} />
  }
}

type Props = {
  item: Item
  onClick?: (item: Item) => void
}

export default function StatusBox({ item, onClick }: Props) {
  return (
    <Card elevation={2} sx={{ minHeight: 120 }}>
      <CardActionArea onClick={() => onClick?.(item)}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <StatusDot status={item.status} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1">{item.name}</Typography>
            </Box>
          </Box>
          <Box sx={{ ml: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{typeIcon(item.type)}</Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
