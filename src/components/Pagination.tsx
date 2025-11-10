// src/components/Pagination.tsx
import React from 'react'
import { Button, HStack, Text } from '@chakra-ui/react'

type PaginationProps = {
  page: number
  hasNext: boolean
  onPrev: () => void
  onNext: () => void
}

const Pagination: React.FC<PaginationProps> = ({ page, hasNext, onPrev, onNext }) => {
  return (
    <HStack justify="center" mt={4}>
      <Button onClick={onPrev} isDisabled={page <= 1}>Prev</Button>
      <Text>Page {page}</Text>
      <Button onClick={onNext} isDisabled={!hasNext}>Next</Button>
    </HStack>
  )
}

export default Pagination
