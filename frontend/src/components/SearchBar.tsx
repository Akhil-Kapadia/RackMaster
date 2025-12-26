import React, { useMemo, useState } from 'react'
import { Autocomplete, TextField, IconButton, InputAdornment, Box, Checkbox } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

type Option = { title: string; group: string }

type Props = {
  onSearch: (selectedTitles: string[], inputValue: string) => void
}

const sampleOptions: Option[] = [
  { title: 'Rack 1', group: 'Racks' },
  { title: 'Rack 2', group: 'Racks' },
  { title: 'Switch A', group: 'Switches' },
  { title: 'Switch B', group: 'Switches' },
  { title: 'Server 01', group: 'Devices' },
  { title: 'Server 02', group: 'Devices' },
]

export default function SearchBar({ onSearch }: Props) {
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
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              size="small"
              checked={selected}
              sx={{ mr: 1 }}
            />
            {option.title}
          </li>
        )}
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
                    onClick={() => onSearch(value.map((s) => s.title), inputValue)}
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
