// src/components/SearchBar.tsx
import React from 'react'
import { Input } from '@chakra-ui/react'

type SearchBarProps = {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder }) => {
  return (
    <Input
      placeholder={placeholder || 'Search anime...'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export default SearchBar
