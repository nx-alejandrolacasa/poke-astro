import { useState, useEffect, useRef } from 'react'
import { getPokemonName } from '@/utils/pokemon'

export function PokemonSearch() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [allPokemonNames, setAllPokemonNames] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch all Pokemon names on mount
  useEffect(() => {
    async function loadPokemonNames() {
      try {
        const response = await fetch('/api/pokemon/names')
        const data = await response.json()
        setAllPokemonNames(data.names)
      } catch (error) {
        console.error('Failed to load Pokemon names:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadPokemonNames()
  }, [])

  // Update suggestions when query changes
  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([])
      setIsOpen(false)
      setSelectedIndex(-1)
      return
    }

    const filtered = allPokemonNames
      .filter((name) => name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5)

    setSuggestions(filtered)
    setIsOpen(filtered.length > 0)
    setSelectedIndex(-1)
  }, [query, allPokemonNames])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          navigateToPokemon(suggestions[selectedIndex])
        } else if (suggestions.length > 0) {
          navigateToPokemon(suggestions[0])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  const navigateToPokemon = (name: string) => {
    window.location.href = `/pokemon/${name}`
    setQuery('')
    setIsOpen(false)
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && suggestions.length > 0 && setIsOpen(true)}
          placeholder={isLoading ? 'Loading...' : 'Search Pokémon...'}
          disabled={isLoading}
          className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 pr-10 text-gray-900 placeholder-gray-500 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-primary-900"
          aria-label="Search Pokémon"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={isOpen}
        />
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          id="search-suggestions"
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-700"
          role="listbox"
        >
          {suggestions.map((name, index) => (
            <button
              key={name}
              onClick={() => navigateToPokemon(name)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`block w-full px-4 py-3 text-left transition-colors ${
                index === selectedIndex
                  ? 'bg-primary text-white'
                  : 'text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-600'
              }`}
              role="option"
              aria-selected={index === selectedIndex}
            >
              <span className="font-medium">{getPokemonName(name)}</span>
              <span className="ml-2 text-sm opacity-75">#{name}</span>
            </button>
          ))}
        </div>
      )}

      {isOpen && query && suggestions.length === 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-2 w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-gray-500 shadow-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
        >
          No Pokémon found
        </div>
      )}
    </div>
  )
}
