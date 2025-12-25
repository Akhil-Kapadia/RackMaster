import React, { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from '@mui/material'

type EntityType = 'rack' | 'unit' | 'device'

export default function EntityDialog({
  open,
  onClose,
  action,
  type,
  entity,
}: {
  open: boolean
  onClose: () => void
  action: 'add' | 'update' | 'move'
  type: EntityType
  entity?: any
}) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1'
  const [loading, setLoading] = useState(false)
  const [racks, setRacks] = useState<any[]>([])
  const [units, setUnits] = useState<any[]>([])

  const [form, setForm] = useState<any>({})

  useEffect(() => {
    if (open) {
      setForm(entity || {})
      fetch(`${API_BASE}/racks/`).then((r) => r.json()).then((d) => setRacks(Array.isArray(d) ? d : []))
      fetch(`${API_BASE}/units/`).then((r) => r.json()).then((d) => setUnits(Array.isArray(d) ? d : []))
    }
  }, [open, entity])

  const handleChange = (k: string, v: any) => setForm((s: any) => ({ ...s, [k]: v }))

  const submit = async () => {
    setLoading(true)
    try {
      if (action === 'add') {
        const url = `${API_BASE}/${type}s/`
        await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      } else if (action === 'update' && entity?.id) {
        const url = `${API_BASE}/${type}s/${entity.id}/`
        await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      } else if (action === 'move' && entity?.id) {
        // For move we expect form.rack (for units) or form.unit (for devices)
        const url = `${API_BASE}/${type}s/${entity.id}/`
        await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {action.toUpperCase()} {type.toUpperCase()}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {(type === 'rack' || type === 'unit') && (
            <TextField label="Name" value={form.name || ''} onChange={(e) => handleChange('name', e.target.value)} />
          )}

          <TextField label="Serial Number" value={form.serial_number || ''} onChange={(e) => handleChange('serial_number', e.target.value)} />

          {type === 'rack' && (
            <TextField label="Location" value={form.location || ''} onChange={(e) => handleChange('location', e.target.value)} />
          )}

          {type === 'unit' && (
            <FormControl fullWidth>
              <InputLabel id="rack-select-label">Rack</InputLabel>
              <Select
                labelId="rack-select-label"
                value={form.rack || ''}
                label="Rack"
                onChange={(e) => handleChange('rack', e.target.value)}
              >
                <MenuItem value="">(none)</MenuItem>
                {racks.map((r) => (
                  <MenuItem key={r.id} value={r.id}>
                    {r.name} ({r.serial_number})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {type === 'device' && (
            <FormControl fullWidth>
              <InputLabel id="unit-select-label">Unit</InputLabel>
              <Select labelId="unit-select-label" value={form.unit || ''} label="Unit" onChange={(e) => handleChange('unit', e.target.value)}>
                <MenuItem value="">(none)</MenuItem>
                {units.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.serial_number} {u.name ? `- ${u.name}` : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={submit} disabled={loading} variant="contained">
          {loading ? <CircularProgress size={18} /> : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
