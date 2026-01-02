import React, { useState, useEffect } from 'react'
import { Autocomplete, TextField, IconButton, InputAdornment, Box, Checkbox } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import searchApi from '../services/searchService'
import { fetchUnitTypes, fetchDeviceTypes, fetchDevices, fetchUnits } from '../services/modelServices'

// Define a clearer type for the options
type Option = { title: string; group: string; id?: number; type: 'unit' | 'device' }

type Props = {
  onSearch: (selectedTitles: string[], inputValue: string) => void
  onResults?: (results: any[]) => void
}

export default function SearchBar({ onSearch, onResults }: Props) {
  const [value, setValue] = useState<Option[]>([])
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState<Option[]>([])

  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      try {
        // Fetch all data concurrently
        const [unitTypes, deviceTypes, units, devices] = await Promise.all([
          fetchUnitTypes(),
          fetchDeviceTypes(),
          fetchUnits(),
          fetchDevices(),
        ])

        if (!mounted) return

        // Helper to normalize DRF responses (handling direct arrays or {results: []})
        const normalize = (resp: any) => (Array.isArray(resp) ? resp : resp?.results || [])

        const uTypes = normalize(unitTypes)
        const dTypes = normalize(deviceTypes)
        const uItems = normalize(units)
        const dItems = normalize(devices)

        // 1. Map Types (The Categories)
        const typeOptions: Option[] = [
          ...uTypes.map((t: any) => ({ title: t.name, group: 'Unit Categories', id: t.id, type: 'unit' })),
          ...dTypes.map((t: any) => ({ title: t.name, group: 'Device Categories', id: t.id, type: 'device' })),
        ]

        // 2. Map Units and Devices (The specific items)
        // Note: If your API provides 'unit_type_name', use that for the group name
        const itemOptions: Option[] = [
          ...uItems.map((u: any) => ({ 
            title: u.name || "unnamed unit", 
            group: `Units (${u.unit_type?.name || 'Uncategorized'})`, 
            id: u.id,
            type: 'unit' 
          })),
          ...dItems.map((d: any) => ({ 
            title: d.name || "unnamed device", 
            group: `Devices (${d.device_type?.name || 'Uncategorized'})`, 
            id: d.id,
            type: 'device' 
          })),
        ]

        setOptions([...typeOptions, ...itemOptions])
      } catch (err) {
        console.error('Failed to load search data', err)
      }
    }

    loadData()
    return () => { mounted = false }
  }, [])

  const handleSearchTrigger = async () => {
    const selectedTitles = value.map((s) => s.title)
    onSearch(selectedTitles, inputValue)
    
    try {
      const resp = await searchApi({
        model: 'Rack',
        filters: { name__icontains: inputValue },
        fields: ['id', 'name'],
        limit: 50,
      })
      if (onResults) onResults(resp.results)
    } catch (err) {
      console.error('Search error', err)
    }
  }

  return (
    <Box sx={{ width: 360 }}>
      <Autocomplete
        multiple
        options={options}
        groupBy={(option) => option.group}
        getOptionLabel={(option) => option.title}
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
        disableCloseOnSelect
        // Optimized rendering
        renderOption={(props, option, { selected }) => {
          const { key, ...liProps } = props as any
          return (
            <li key={key} {...liProps}>
              <Checkbox size="small" checked={selected} sx={{ mr: 1 }} />
              <Box component="span" sx={{ fontSize: '0.9rem' }}>
                {option.title}
              </Box>
            </li>
          )
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Search Inventory..."
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearchTrigger} edge="end">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </Box>
  )
}