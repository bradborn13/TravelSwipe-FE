import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  search: string | null
  rehydrateSearch: boolean
}

const initialState: UserState = { search: '', rehydrateSearch: false }

const searchSlice = createSlice({
  name: 'base',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    clearSearch: (state) => {
      state.search = null
    },
    setSearchRehydrate: (state) => {
      state.rehydrateSearch = true
    },
    clearRehydrate: (state) => {
      state.rehydrateSearch = false
    },
  },
})

export const { setSearch, clearSearch, clearRehydrate, setSearchRehydrate } = searchSlice.actions
export default searchSlice.reducer
