// src/features/search/searchSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface SearchState {
  query: string
  results: any[]
  page: number
  hasNextPage: boolean
  loading: boolean
  error: string | null
}

const initialState: SearchState = {
  query: '',
  results: [],
  page: 1,
  hasNextPage: false,
  loading: false,
  error: null,
}

// thunk; accepts flat args. thunkAPI.signal used to cancel fetch
export const fetchSearch = createAsyncThunk<
  // return
  { data: any; query: string; page: number },
  // arg
  {
    query: string
    page?: number
    genre?: string
    year?: string
    sort?: string
    order?: string
  },
  { rejectValue: string }
>(
  'search/fetch',
  async (args, thunkAPI) => {
    const { query = '', page = 1, genre, year, sort, order } = args
    try {
      // base URL
      let url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&page=${page}&limit=20`

      // genre: Jikan expects numeric genre ids (comma-separated allowed)
      if (genre) url += `&genres=${encodeURIComponent(genre)}`

      // year: use start_date & end_date to limit year
      if (year) {
        url += `&start_date=${encodeURIComponent(year + '-01-01')}&end_date=${encodeURIComponent(year + '-12-31')}`
      }

      // sorting field (order_by) and order (sort)
      if (sort) url += `&order_by=${encodeURIComponent(sort)}`
      if (order) url += `&sort=${encodeURIComponent(order)}`

      const res = await fetch(url, { signal: thunkAPI.signal })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`API error ${res.status}: ${text}`)
      }
      const data = await res.json()
      return { data, query, page }
    } catch (err: any) {
      // If aborted, let RTK handle it (it will reject with aborted error)
      if (err.name === 'AbortError') throw err
      if (String(err).includes('429')) {
        return thunkAPI.rejectWithValue('Too many requests — please wait a moment and try again.')
      }
      return thunkAPI.rejectWithValue('Failed to fetch results. Please try again.')
    }
  }
)

const slice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload
      state.page = 1
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
    clearResults(state) {
      state.results = []
      state.page = 1
      state.query = ''
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearch.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSearch.fulfilled, (state, action) => {
        state.loading = false
        // API returns data.data (list) and data.pagination
        state.results = action.payload.data.data ?? []
        state.hasNextPage = !!(action.payload.data.pagination?.has_next_page)
      })
      .addCase(fetchSearch.rejected, (state, action) => {
        state.loading = false
        // action.payload when rejectWithValue used
        state.error = action.payload ?? action.error.message ?? 'An error occurred'
      })
  }
})

export const { setQuery, setPage, clearResults } = slice.actions
export default slice.reducer
