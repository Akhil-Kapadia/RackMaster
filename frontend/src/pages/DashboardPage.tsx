import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from '@mui/material'
import { Storage, Router, DevicesOther } from '@mui/icons-material'
import SearchBar from '../components/SearchBar'

type Status = 'ok' | 'error' | 'empty'

type BoxType = 'rack' | 'switch' | 'device'

type Item = {
  id: string
  name: string
  status: Status
  type: BoxType
}

function StatusDot({ status }: { status: Status }) {
  const size = 12
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

export default function DashboardPage() {
  const [searchFilters, setSearchFilters] = useState<string[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [selected, setSelected] = useState<Item | null>(null)

  // Initial demo items; in real app this would come from an API
  useEffect(() => {
    const types: BoxType[] = ['rack', 'switch', 'device']
    const initial: Item[] = Array.from({ length: 24 }).map((_, i) => ({
      id: `item-${i + 1}`,
      name: `Rack ${i + 1}`,
      status: 'empty',
      type: types[i % types.length],
    }))
    setItems(initial)
  }, [])

  // Placeholder for fetching statuses from API. Replace with real call.
  useEffect(() => {
    let mounted = true
    const t = setTimeout(() => {
      if (!mounted) return
      setItems((prev) => prev.map((it, idx) => ({
        ...it,
        status: idx % 5 === 0 ? 'error' : idx % 3 === 0 ? 'ok' : 'empty',
      })))
    }, 600)

    return () => {
      mounted = false
      clearTimeout(t)
    }
  }, [])

  const filtered = useMemo(() => {
    if (searchFilters.length === 0) return items
    return items.filter((it) => searchFilters.some((f) => it.name.toLowerCase().includes(f.toLowerCase())))
  }, [searchFilters, items])

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

  const handleSearch = (selectedTitles: string[], inputValue: string) => {
    // Trigger TBD API call here. For now we just set the filters and log.
    console.log('Search triggered. selections=', selectedTitles, 'input=', inputValue)
    setSearchFilters(selectedTitles)
  }

  return (
    <Box sx={{ py: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5">Dashboard</Typography>
        <SearchBar onSearch={(selected, input) => handleSearch(selected, input)} />
      </Stack>

      <Grid container spacing={2}>
        {filtered.map((it) => (
          <Grid item key={it.id} xs={12} sm={6} md={4} lg={3}>
            <Card elevation={2} sx={{ minHeight: 110 }}>
              <CardActionArea onClick={() => setSelected(it)}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                    <StatusDot status={it.status} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1">{it.name}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ ml: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{typeIcon(it.type)}</Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth maxWidth="sm">
        <DialogTitle>{selected ? selected.name : ''}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Status: {selected?.status ?? 'unknown'}
          </Typography>
          <Typography variant="body2">Replace this with the TBD modal component and detailed content fetched from the API for the selected item.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
