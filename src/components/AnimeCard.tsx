import React from 'react'
import { Box, Image, Text, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

interface AnimeCardProps {
  id: number
  title: string
  image?: string
  synopsis?: string
}

const AnimeCard: React.FC<AnimeCardProps> = ({ id, title, image, synopsis }) => {
  return (
    <Link to={`/anime/${id}`}>
      <Box
        bg="white"
        borderWidth="1px"
        borderRadius="md"
        overflow="hidden"
        _hover={{ shadow: 'lg', transform: 'scale(1.02)', transition: '0.2s' }}
        maxW="xs"
        w="100%"
      >
        <Box h={{ base: '200px', md: '250px' }} w="100%" overflow="hidden">
          <Image
            src={image}
            alt={title}
            h="100%"
            w="100%"
            objectFit="cover"
            objectPosition="top"
            borderTopRadius="md"
          />
        </Box>
        <VStack align="start" spacing={1} p={3}>
          <Text fontWeight="bold" noOfLines={2}>
            {title}
          </Text>
          {synopsis && (
            <Text fontSize="sm" noOfLines={3}>
              {synopsis}
            </Text>
          )}
        </VStack>
      </Box>
    </Link>
  )
}

export default AnimeCard
