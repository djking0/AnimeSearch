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

// Async thunk for fetching anime
export const fetchSearch = createAsyncThunk(
  'search/fetch',
  async (
    {
      query,
      page,
      genre,
      year,
      sort,
      order,
    }: {
      query: string
      page: number
      genre?: string
      year?: string
      sort?: string
      order?: string
    },
    thunkAPI
  ) => {
    try {
      let url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&page=${page}&limit=20`

      if (genre) url += `&genres=${genre}`
      if (year) url += `&start_date=${year}-01-01&end_date=${year}-12-31`
      if (sort) url += `&order_by=${sort}`
      if (order) url += `&sort=${order}`

      const res = await fetch(url)
      if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`)
      const data = await res.json()
      return { data, query, page }
    } catch (err: any) {
      if (err.message.includes('429')) {
        return thunkAPI.rejectWithValue(
          'Too many requests! Please wait a moment before searching again.'
        )
      }
      return thunkAPI.rejectWithValue('Failed to fetch results. Please try again.')
    }
  }
)

const searchSlice = createSlice({
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearch.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSearch.fulfilled, (state, action) => {
        state.loading = false
        state.results = action.payload.data.data
        state.hasNextPage = action.payload.data.pagination.has_next_page
      })
      .addCase(fetchSearch.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setQuery, setPage } = searchSlice.actions
export default searchSlice.reducer
