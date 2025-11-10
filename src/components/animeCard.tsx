// src/components/AnimeCard.tsx
import React from 'react'
import { Box, Text, Button, Image } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

type AnimeCardProps = {
  id: number
  title: string
  image: string
  synopsis?: string
}

const AnimeCard: React.FC<AnimeCardProps> = ({ id, title, image, synopsis }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      overflow="hidden"
      p={3}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="100%"
    >
      <Box w="100%" h={250} overflow="hidden" mb={2}>
        <Image
          src={image}
          alt={title}
          w="100%"
          h="100%"
          objectFit="cover"  // scales the image to fill the box without distortion
          borderRadius="md"
        />
      </Box>

      <Text fontWeight="bold" fontSize="lg" mb={1}>
        {title}
      </Text>

      <Text fontSize="sm" flexGrow={1}>
        {synopsis ? synopsis.slice(0, 120) + '...' : 'No description available.'}
      </Text>

      <Link to={`/anime/${id}`}>
        <Button mt={2} size="sm" w="full">
          Details
        </Button>
      </Link>
    </Box>
  )
}

export default AnimeCard
