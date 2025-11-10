import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, SimpleGrid, Text, VStack, Button } from '@chakra-ui/react'
import { RootState } from '../app/store'
import { fetchSearch, setPage } from '../features/search/searchSlice'
import SearchBar from '../components/SearchBar'
import AnimeCard from '../components/AnimeCard'
import Pagination from '../components/Pagination'

export default function SearchPage() {
  const dispatch = useDispatch()
  const { results, query, loading, error, page, hasNextPage } = useSelector(
    (state: RootState) => state.search
  )
  const [localQuery, setLocalQuery] = useState(query)

  useEffect(() => {
    dispatch(fetchSearch({ query: localQuery, page }))
  }, [localQuery, page, dispatch])

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, gray.50, gray.100)"
      bgImage="url('https://www.transparenttextures.com/patterns/cubes.png')"
      bgRepeat="repeat"
      p={{ base: 2, md: 6 }}
    >
      <VStack spacing={4} align="stretch">
        {/* Search input */}
        <SearchBar value={localQuery} onChange={setLocalQuery} />

        {/* Loading */}
        {loading && <Text>Loading...</Text>}

        {/* Error */}
        {error && (
          <Box p={4} bg="red.100" borderRadius="md">
            <Text color="red.700">{error}</Text>
            {error.includes('Too many requests') && (
              <Button
                mt={2}
                onClick={() => dispatch(fetchSearch({ query, page }))}
              >
                Retry
              </Button>
            )}
          </Box>
        )}

        {/* No results */}
        {!loading && !error && results.length === 0 && localQuery && (
          <Text>No results found for "{localQuery}". Try a different search.</Text>
        )}

        {/* Anime grid */}
        <SimpleGrid minChildWidth="250px" spacing={{ base: 4, md: 6 }}>
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
