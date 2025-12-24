import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
  Chip,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import EditIcon from '@mui/icons-material/Edit'
import RefreshIcon from '@mui/icons-material/Refresh'
import InfoIcon from '@mui/icons-material/Info'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1'

type Severity = 'INFO' | 'WARNING' | 'CRITICAL' | string

type EntityType = 'rack' | 'unit' | 'device'

type Entity = {
  id: number
  type: EntityType
  name?: string | null
  serial_number?: string | null
  status_message?: { message?: string; severity?: Severity } | null
  [key: string]: any
}

function SeverityIcon({ severity }: { severity?: Severity | null }) {
  if (!severity) return <InfoIcon color="disabled" />
  switch (severity) {
    case 'CRITICAL':
      return <ReportGmailerrorredIcon color="error" />
    case 'WARNING':
      return <WarningAmberIcon color="warning" />
    default:
      return <InfoIcon color="info" />
  }
}

export default function App(): JSX.Element {
  const [query, setQuery] = useState<string>('')
  const [items, setItems] = useState<Entity[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selected, setSelected] = useState<Entity | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogAction, setDialogAction] = useState<'add' | 'move' | 'update'>('add')
  const [dialogType, setDialogType] = useState<EntityType>('rack')

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [racksRes, unitsRes, devicesRes] = await Promise.all([
        fetch(`${API_BASE}/racks/`),
        fetch(`${API_BASE}/units/`),
        fetch(`${API_BASE}/devices/`),
      ])

      const [racks, units, devices] = await Promise.all([
        racksRes.ok ? racksRes.json() : [],
        unitsRes.ok ? unitsRes.json() : [],
        devicesRes.ok ? devicesRes.json() : [],
      ])

      const mapped: Entity[] = []
      if (Array.isArray(racks))
        mapped.push(...racks.map((r: any) => ({ ...(r || {}), id: r.id, type: 'rack' })))
      if (Array.isArray(units))
        mapped.push(...units.map((u: any) => ({ ...(u || {}), id: u.id, type: 'unit' })))
      if (Array.isArray(devices))
        mapped.push(...devices.map((d: any) => ({ ...(d || {}), id: d.id, type: 'device' })))

      setItems(mapped)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const filtered = useMemo(() => {
    if (!query) return items
    const q = query.toLowerCase()
    return items.filter((it) => {
      const name = (it.name || '') as string
      const serial = (it.serial_number || '') as string
      return name.toLowerCase().includes(q) || serial.toLowerCase().includes(q)
    })
  }, [items, query])

  const handleActionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget)
  }
  const handleCloseMenu = () => setAnchorEl(null)
  const handleAction = (action: 'add' | 'move' | 'update', model: EntityType) => {
    handleCloseMenu()
    setDialogAction(action)
    setDialogType(model)
    setDialogOpen(true)
  }

  const refreshItem = async (it: Entity) => {
    try {
      const res = await fetch(`${API_BASE}/${it.type}s/${it.id}/`)
      if (!res.ok) throw new Error('fetch failed')
      const updated = await res.json()
      setItems((prev) => prev.map((p) => (p.type === it.type && p.id === it.id ? { ...p, ...updated } : p)))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        RackMaster
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search racks, units, devices by name or serial..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
          }}
          sx={{ minWidth: 320 }}
        />

        <Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleActionClick} sx={{ mr: 1 }}>
            Add
          </Button>
          <Button variant="outlined" startIcon={<SwapHorizIcon />} onClick={(e) => handleActionClick(e)} sx={{ mr: 1 }}>
            Move
          </Button>
          <Button variant="outlined" startIcon={<EditIcon />} onClick={(e) => handleActionClick(e)}>
            Update
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
            <MenuItem onClick={() => handleAction('add', 'rack')}>Add Rack</MenuItem>
            <MenuItem onClick={() => handleAction('add', 'unit')}>Add Unit</MenuItem>
            <MenuItem onClick={() => handleAction('add', 'device')}>Add Device</MenuItem>
            <MenuItem onClick={() => handleAction('move', 'rack')}>Move Rack</MenuItem>
            <MenuItem onClick={() => handleAction('move', 'unit')}>Move Unit</MenuItem>
            <MenuItem onClick={() => handleAction('move', 'device')}>Move Device</MenuItem>
            <MenuItem onClick={() => handleAction('update', 'rack')}>Update Rack</MenuItem>
            <MenuItem onClick={() => handleAction('update', 'unit')}>Update Unit</MenuItem>
            <MenuItem onClick={() => handleAction('update', 'device')}>Update Device</MenuItem>
          </Menu>
        </Box>
      </Stack>

      <Grid container spacing={2}>
        {filtered.map((it) => (
          <Grid item key={`${it.type}-${it.id}`} xs={12} sm={6} md={4} lg={3}>
            <Paper sx={{ p: 2, position: 'relative' }} elevation={2}>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={1} alignItems="center" onClick={() => setSelected(it)} sx={{ cursor: 'pointer' }}>
                  <SeverityIcon severity={it?.status_message?.severity} />
                  <Box>
                    <Typography variant="subtitle1">
                      {it.name || (it.device_type && it.device_type.name) || it.serial_number || `${it.type} ${it.id}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {it.serial_number || ''}
                    </Typography>
                    {it.status_message?.message ? (
                      <Chip label={it.status_message.message} size="small" sx={{ mt: 1 }} />
                    ) : null}
                  </Box>
                </Stack>

                <Box>
                  <IconButton size="small" onClick={() => refreshItem(it)} aria-label="refresh">
                    <RefreshIcon />
                  </IconButton>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} maxWidth="md" fullWidth>
        <DialogTitle>Details</DialogTitle>
        <DialogContent>
          {selected && (
            <Table>
              <TableBody>
                {Object.keys(selected).map((k) => (
                  <TableRow key={k}>
                    <TableCell sx={{ width: '30%', fontWeight: 'bold' }}>{k}</TableCell>
                    <TableCell>
                      <pre style={{ margin: 0 }}>{JSON.stringify((selected as any)[k], null, 2)}</pre>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
      {/* Add / Move / Update dialog */}
      <EntityDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        action={dialogAction}
        type={dialogType}
        entity={dialogAction !== 'add' && selected ? selected : undefined}
      />
    </Container>
  )
}
