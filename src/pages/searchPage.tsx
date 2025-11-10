// src/pages/SearchPage.tsx
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { VStack, SimpleGrid, HStack, Spinner, Text, Box, Button, Select } from '@chakra-ui/react'
import { RootState, AppDispatch } from '../app/store'
import { setQuery, setPage, fetchSearch } from '../features/search/searchSlice'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import SearchBar from '../components/SearchBar'
import AnimeCard from '../components/AnimeCard'
import Pagination from '../components/Pagination'

// Map genre names to Jikan API numeric IDs
const GENRES: { [key: string]: string } = {
  action: '1',
  adventure: '2',
  comedy: '4',
  drama: '8',
  fantasy: '10',
  horror: '14',
  romance: '22',
  sci_fi: '24',
}

export default function SearchPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { query, results, loading, error, page, hasNextPage } = useSelector(
    (s: RootState) => s.search
  )

  const [localQuery, setLocalQuery] = useState(query)
  const debouncedQuery = useDebouncedValue(localQuery, 250)

  const [genre, setGenre] = useState('')
  const [year, setYear] = useState('')
  const [sort, setSort] = useState('score') // default sort field
  const [order, setOrder] = useState('desc') // High → Low

  // Fetch whenever search/filter/sort changes
  useEffect(() => {
    dispatch(setQuery(debouncedQuery))
    dispatch(fetchSearch({ query: debouncedQuery, page, genre, year, sort, order }))
  }, [debouncedQuery, genre, year, sort, order, dispatch])

  // Fetch when page changes
  useEffect(() => {
    dispatch(fetchSearch({ query: debouncedQuery, page, genre, year, sort, order }))
  }, [page, debouncedQuery, genre, year, sort, order, dispatch])

  return (
    <VStack spacing={4} align="stretch" p={6}>
      {/* Search Bar */}
      <SearchBar value={localQuery} onChange={setLocalQuery} placeholder="Search anime..." />

      {/* Filters and Sorting */}
      <HStack spacing={4}>
        <Select placeholder="Filter by Genre" onChange={(e) => setGenre(e.target.value)} w="200px">
          {Object.entries(GENRES).map(([name, id]) => (
            <option key={id} value={id}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </option>
          ))}
        </Select>

        <Select placeholder="Filter by Year" onChange={(e) => setYear(e.target.value)} w="150px">
          {Array.from({ length: 30 }, (_, i) => {
            const y = 2025 - i
            return (
              <option key={y} value={y}>
                {y}
              </option>
            )
          })}
        </Select>

        <Select onChange={(e) => setSort(e.target.value)} w="150px" value={sort}>
          <option value="score">Score</option>
          <option value="popularity">Popularity</option>
        </Select>

        <Select onChange={(e) => setOrder(e.target.value)} w="150px" value={order}>
          <option value="desc">High → Low</option>
          <option value="asc">Low → High</option>
        </Select>
      </HStack>

      {/* Loading */}
      {loading && (
        <HStack>
          <Spinner />
          <Text>Loading...</Text>
        </HStack>
      )}

      {/* Error messages */}
      {error && (
        <Box p={4} bg="red.100" borderRadius="md">
          <Text color="red.700">{error}</Text>
          {error.includes('Too many requests') && (
            <Button
              mt={2}
              onClick={() =>
                dispatch(fetchSearch({ query: debouncedQuery, page, genre, year, sort, order }))
              }
            >
              Retry
            </Button>
          )}
        </Box>
      )}

      {/* Empty state */}
      {!loading && !error && results.length === 0 && (
        <Text>
          {debouncedQuery
            ? `No results found for "${debouncedQuery}". Try a different search.`
            : 'Showing top anime. Use the search bar or filters to refine.'}
        </Text>
      )}

      {/* Anime results grid */}
      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        {results.map((r: any) => (
          <AnimeCard
            key={r.mal_id}
            id={r.mal_id}
            title={r.title}
            image={r.images?.jpg?.image_url}
            synopsis={r.synopsis}
          />
        ))}
      </SimpleGrid>

      {/* Pagination */}
      {!loading && !error && results.length > 0 && (
        <Pagination
          page={page}
          hasNext={hasNextPage}
          onPrev={() => dispatch(setPage(page - 1))}
          onNext={() => dispatch(setPage(page + 1))}
        />
      )}
    </VStack>
  )
}
