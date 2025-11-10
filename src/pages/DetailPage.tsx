import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getAnimeById } from '../api/jikan'
import { Box, Text, Spinner, Image, Button, VStack } from '@chakra-ui/react'

export default function DetailPage() {
  const { id } = useParams()
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const controller = new AbortController()
    setLoading(true)
    getAnimeById(id, controller.signal)
      .then((res) => {
        setData(res.data ?? res)
        setLoading(false)
      })
      .catch((e) => {
        if (e.name === 'AbortError') return
        setErr(String(e))
        setLoading(false)
      })
    return () => controller.abort()
  }, [id])

  if (loading)
    return (
      <Box p={6} textAlign="center">
        <Spinner size="xl" />
      </Box>
    )

  if (err)
    return (
      <Box p={6} textAlign="center">
        <Text color="red.500">{err}</Text>
      </Box>
    )

  if (!data)
    return (
      <Box p={6} textAlign="center">
        <Text>No details available</Text>
      </Box>
    )

  return (
    <Box p={6}>
      <Link to="/">
        <Button mb={4}>Back</Button>
      </Link>
      <VStack spacing={4} align="start">
        <Image
          src={data.images?.jpg?.image_url}
          alt={data.title}
          maxW="300px"
          borderRadius="md"
          objectFit="cover"
        />
        <Text fontSize="2xl" fontWeight="bold">
          {data.title}
        </Text>
        <Text>{data.synopsis || 'No synopsis available.'}</Text>
        <Text>Episodes: {data.episodes ?? 'N/A'}</Text>
        <Text>Score: {data.score ?? 'N/A'}</Text>
        <Text>Type: {data.type || 'N/A'}</Text>
        <Text>
          Genres: {data.genres?.map((g: any) => g.name).join(', ') || 'N/A'}
        </Text>
        <Text>
          Aired:{' '}
          {data.aired?.from
            ? new Date(data.aired.from).toLocaleDateString()
            : 'N/A'}{' '}
          -{' '}
          {data.aired?.to
            ? new Date(data.aired.to).toLocaleDateString()
            : 'Present'}
        </Text>
      </VStack>
    </Box>
  )
}
