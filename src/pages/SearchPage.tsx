import React, { useEffect, useState } from 'react'
import {
  Box,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Select,
  Spinner,
  Button,
} from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../app/store'
import { fetchSearch, setPage } from '../features/search/searchSlice'
import SearchBar from '../components/SearchBar'
import AnimeCard from '../components/AnimeCard'
import Pagination from '../components/Pagination'

// optional: small hook to debounce input
function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

const GENRES: { [key: string]: string } = {
  Action: '1',
  Adventure: '2',
  Comedy: '4',
  Drama: '8',
  Fantasy: '10',
  Horror: '14',
  Romance: '22',
  SciFi: '24',
}

export default function SearchPage() {
  const dispatch = useDispatch<any>()
  const { results, page, hasNextPage, loading, error } = useSelector(
    (s: RootState) => s.search
  )

  // local search & filters
  const [localQuery, setLocalQuery] = useState('')
  const debouncedQuery = useDebouncedValue(localQuery, 250)

  const [genre, setGenre] = useState('')
  const [year, setYear] = useState('')
  const [sort, setSort] = useState('score')
  const [order, setOrder] = useState('desc')

  // fetch data whenever query or filters change
  useEffect(() => {
    dispatch(
      fetchSearch({
        query: debouncedQuery || 'a', // load default results if blank
        page,
        genre: genre || undefined,
        year: year || undefined,
        sort: sort || undefined,
        order: order || undefined,
      })
    )
  }, [debouncedQuery, genre, year, sort, order, page, dispatch])

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, gray.50, gray.100)"
      bgImage="url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')"
      bgRepeat="repeat"
      p={{ base: 4, md: 8 }}
    >
      <VStack spacing={6} align="stretch">
        <SearchBar
          value={localQuery}
          onChange={setLocalQuery}
          placeholder="Search anime..."
        />

        {/* Filter + Sort Controls */}
        <HStack spacing={3} flexWrap="wrap">
          <Select
            placeholder="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            w="180px"
          >
            {Object.entries(GENRES).map(([name, id]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </Select>

          <Select
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            w="140px"
          >
            <option value="">Any</option>
            {Array.from({ length: 30 }, (_, i) => {
              const y = 2025 - i
              return (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              )
            })}
          </Select>

          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            w="180px"
          >
            <option value="score">Score</option>
            <option value="popularity">Popularity</option>
            <option value="updated_at">Last Update</option>
          </Select>

          <Select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            w="160px"
          >
            <option value="desc">High → Low</option>
            <option value="asc">Low → High</option>
          </Select>

          <Button
            onClick={() => {
              setGenre('')
              setYear('')
              setSort('score')
              setOrder('desc')
              setLocalQuery('')
              dispatch(setPage(1))
            }}
          >
            Reset
          </Button>
        </HStack>

        {/* Loading / Error */}
        {loading && (
          <HStack>
            <Spinner />
            <Text>Loading...</Text>
          </HStack>
        )}

        {error && (
          <Box p={3} bg="red.100" borderRadius="md">
            <Text color="red.700">{error}</Text>
            {error.includes('Too many requests') && (
              <Button
                mt={2}
                onClick={() =>
                  dispatch(
                    fetchSearch({
                      query: debouncedQuery || 'a',
                      page,
                      genre,
                      year,
                      sort,
                      order,
                    })
                  )
                }
              >
                Retry
              </Button>
            )}
          </Box>
        )}

        {!loading && !error && results.length === 0 && (
          <Text>No results found for "{debouncedQuery}".</Text>
        )}

        {/* Results */}
        <SimpleGrid minChildWidth="250px" spacing={5}>
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

        <Pagination
          page={page}
          hasNext={hasNextPage}
          onPrev={() => dispatch(setPage(page - 1))}
          onNext={() => dispatch(setPage(page + 1))}
        />
      </VStack>
    </Box>
  )
}
