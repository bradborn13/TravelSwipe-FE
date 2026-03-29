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
    <Stack spacing={1} sx={{ width: 200 }}>
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
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Look up a location"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ opacity: 0.4, fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: 280,
              '& .MuiOutlinedInput-root': {
                borderRadius: '100px',
                background: 'var(--bg)',
                padding: '2px 18px',
                fontSize: 14,
                '& fieldset': { borderColor: '#D9D4CC', borderWidth: '1.5px' },
                '&:hover fieldset': { borderColor: '#aaa' },
              },
            }}
          />
        )}
      />
    </Stack>
  )
}
