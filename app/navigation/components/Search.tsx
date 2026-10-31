'use client'
import { useEffect, useState } from 'react'
import { TextField } from '@mui/material'
import { setSearch } from '../../store/slices/searchSlice'
import Stack from '@mui/material/Stack'
import { useAppDispatch } from '../../store/hooks'
import Autocomplete from '@mui/material/Autocomplete'
import { getAllCityLocations } from '../../services/activitiesService'
import { InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'

export default function Search() {
  const dispatch = useAppDispatch()
  const [inputValue, setInputValue] = useState('')
  const [location, setLocation] = useState('')
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const { data, error, isLoading } = getAllCityLocations()
  useEffect(() => {
    setLocationSuggestions(data ?? [])
  }, [data])

  return (
    <Stack spacing={1} sx={{ width: '100%' }}>
      <Autocomplete
        freeSolo
        id="Autocomplete-locations"
        options={locationSuggestions}
        value={location}
        onKeyDown={(e) => {
          if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            setLocation(inputValue)
            dispatch(setSearch(inputValue))
          }
        }}
        onChange={(event, newValue) => {
          setLocation(newValue ?? '')
          setInputValue(newValue ?? '')
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue)
        }}
        getOptionLabel={(option) => option}
        filterSelectedOptions
        renderOption={({ key, ...props }, option) => (
          <li key={key} {...props}>
            <PlaceOutlinedIcon className="option-icon" sx={{ fontSize: 18 }} />
            {option}
          </li>
        )}
        slotProps={{
          // the suggestion list: a white card under the field, in the same type as the page
          paper: {
            elevation: 0,
            sx: {
              mt: '6px',
              borderRadius: '14px',
              border: '1px solid var(--border)',
              boxShadow: '0 8px 24px rgba(27, 29, 31, 0.08)',
              fontFamily: 'inherit',
              overflow: 'hidden',
            },
          },
          listbox: {
            sx: {
              padding: '6px',
              maxHeight: 320,
              scrollbarWidth: 'thin',
              '& .MuiAutocomplete-option': {
                gap: '10px',
                minHeight: 40,
                padding: '8px 10px !important',
                borderRadius: '10px',
                fontSize: 14,
                color: 'var(--text)',
                '& .option-icon': { color: 'var(--muted)' },
              },
              '& .MuiAutocomplete-option.Mui-focused, & .MuiAutocomplete-option[aria-selected="true"].Mui-focused':
                {
                  background: 'var(--active)',
                },
              '& .MuiAutocomplete-option[aria-selected="true"]': { background: 'var(--raised)' },
            },
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Look up a location"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="search-icon" sx={{ color: 'var(--muted-text)', fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-root': {
                height: 'var(--control-height)',
                borderRadius: '100px',
                background: 'var(--raised)',
                padding: '0 16px !important',
                fontSize: 14,
                fontFamily: 'inherit',
                color: 'var(--text)',
                transition: 'background 0.15s ease, box-shadow 0.15s ease',
                '& input::placeholder': { color: 'var(--muted)', opacity: 1 },
                '& fieldset': {
                  borderColor: 'var(--border)',
                  borderWidth: '1px',
                  transition: 'border-color 0.15s ease',
                },
                '&:hover fieldset': { borderColor: 'var(--control)' },
                '& .search-icon': { transition: 'color 0.15s ease' },
                // focused: the field lifts to white with a soft ring, and the icon darkens to ink
                '&.Mui-focused': {
                  background: 'var(--surface)',
                  boxShadow: '0 0 0 4px rgba(27, 29, 31, 0.06)',
                },
                '&.Mui-focused fieldset': { borderColor: 'var(--text)', borderWidth: '1px' },
                '&.Mui-focused .search-icon': { color: 'var(--text)' },
                // the clear (×) button: a small round target that matches the field
                '& .MuiAutocomplete-clearIndicator': {
                  width: 24,
                  height: 24,
                  color: 'var(--muted)',
                  '&:hover': { background: 'var(--active)', color: 'var(--text)' },
                  '& svg': { fontSize: 16 },
                },
              },
            }}
          />
        )}
      />
    </Stack>
  )
}
