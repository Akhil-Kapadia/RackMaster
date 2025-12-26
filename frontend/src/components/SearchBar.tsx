import React, { useMemo, useState } from 'react'
import { Autocomplete, TextField, IconButton, InputAdornment, Box, Checkbox } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import searchApi from '../services/searchService'

type Option = { title: string; group: string }

type Props = {
  onSearch: (selectedTitles: string[], inputValue: string) => void
  onResults?: (results: any[]) => void
}

const sampleOptions: Option[] = [
  { title: 'Rack 1', group: 'Racks' },
  { title: 'Rack 2', group: 'Racks' },
  { title: 'Switch A', group: 'Switches' },
  { title: 'Switch B', group: 'Switches' },
  { title: 'Server 01', group: 'Devices' },
  { title: 'Server 02', group: 'Devices' },
]

export default function SearchBar({ onSearch, onResults }: Props) {
  const [value, setValue] = useState<Option[]>([])
  const [inputValue, setInputValue] = useState('')

  const grouped = useMemo(() => sampleOptions, [])

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
            size="small"
            placeholder="Search and select..."
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
