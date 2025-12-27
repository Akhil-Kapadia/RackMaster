import React, { useState, useEffect } from 'react'
import { Autocomplete, TextField, IconButton, InputAdornment, Box, Checkbox } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import searchApi from '../services/searchService'
import { fetchUnitTypes, fetchDeviceTypes } from '../services/modelServices'

type Option = { title: string; group: string; id?: number }

type Props = {
  onSearch: (selectedTitles: string[], inputValue: string) => void
  onResults?: (results: any[]) => void
}
// Options are loaded from the API: UnitType and DeviceType

export default function SearchBar({ onSearch, onResults }: Props) {
  const [value, setValue] = useState<Option[]>([])
  const [inputValue, setInputValue] = useState('')
  const [grouped, setGrouped] = useState<Option[]>([])

  useEffect(() => {
    let mounted = true
    const fetchTypes = async () => {
      try {
        const [unitResp, deviceResp] = await Promise.all([
          fetchUnitTypes(),
          fetchDeviceTypes(),
        ])

        if (!mounted) return

        const unitList: any[] = Array.isArray(unitResp)
          ? unitResp
          : unitResp?.results
          ? unitResp.results
          : unitResp
          ? [unitResp]
          : []

        const deviceList: any[] = Array.isArray(deviceResp)
          ? deviceResp
          : deviceResp?.results
          ? deviceResp.results
          : deviceResp
          ? [deviceResp]
          : []

        const unitOptions: Option[] = unitList.map((u: any) => ({
          title: u.name,
          group: u.name,
          id: u.id,
        }))

        const deviceOptions: Option[] = deviceList.map((d: any) => ({
          title: d.name,
          group: d.name,
          id: d.id,
        }))

        setGrouped([...unitOptions, ...deviceOptions])
      } catch (err) {
        console.error('Failed to load types for search bar', err)
      }
    }

    fetchTypes()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <Box sx={{ width: 360 }}>
      <Autocomplete
        multiple
        options={grouped}
        groupBy={(o) => o.group}
        getOptionLabel={(o) => o.title}
        value={value}
        onChange={(_, v) => setValue(v)}
        inputValue={inputValue}
        onInputChange={(_, v) => setInputValue(v)}
        disableCloseOnSelect
        renderOption={(props, option, { selected }) => {
          const { key, ...liProps } = props as any
          return (
            <li key={key} {...liProps}>
              <Checkbox size="small" checked={selected} sx={{ mr: 1 }} />
              {option.title}
            </li>
          )
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            size="medium"
            variant='outlined'
            placeholder="Search Inventory..."
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="trigger search"
                    onClick={async () => {
                      const selected = value.map((s) => s.title)
                      onSearch(selected, inputValue)
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
                    }}
                    edge="end"
                  >
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
