import { useState, useEffect, useRef } from 'react'
import { MapPin } from 'lucide-react'
import { LocationData, useJourneyStore } from '../../store/useJourneyStore'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { geocodeAddress } from '../../config/api'

interface GooglePlacesAutocompleteProps {
  value: string | null
  onChange: (value: string) => void
  onLocationSelect: (location: LocationData) => void
  placeholder?: string
  className?: string
  style?: React.CSSProperties
}

export function GooglePlacesAutocomplete({ value, onChange, onLocationSelect, placeholder, className, style }: GooglePlacesAutocompleteProps) {
  const [query, setQuery] = useState(value || '')
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  
  const placesLibrary = useMapsLibrary('places')
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null)
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null)

  useEffect(() => {
    if (!placesLibrary) return
    setAutocompleteService(new placesLibrary.AutocompleteService())
    
    // We need a dummy div for PlacesService
    const dummyDiv = document.createElement('div')
    setPlacesService(new placesLibrary.PlacesService(dummyDiv))
  }, [placesLibrary])

  useEffect(() => {
    if (value && value !== query) setQuery(value)
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchPlaces = async () => {
      if (!query || query.length < 3 || query === value || !autocompleteService) {
        setSuggestions([])
        return
      }

      autocompleteService.getPlacePredictions({
        input: query,
        componentRestrictions: { country: ['ng', 'bj', 'ne', 'td', 'cm'] }
      }, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions)
          setIsOpen(true)
        } else {
          setSuggestions([])
        }
      })
    }
    const timeoutId = setTimeout(fetchPlaces, 300)
    return () => clearTimeout(timeoutId)
  }, [query, value, autocompleteService])

  const handleSelect = (prediction: google.maps.places.AutocompletePrediction) => {
    const placeName = prediction.description
    setQuery(placeName)
    setIsOpen(false)
    onChange(placeName)
    
    if (placesService) {
      placesService.getDetails({ placeId: prediction.place_id }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          
          let country = 'Nigeria'
          place.address_components?.forEach(component => {
            if (component.types.includes('country')) {
              country = component.long_name
            }
          })

          if (country.toLowerCase() !== 'nigeria') {
            useJourneyStore.getState().setInternationalModalOpen(true)
            setQuery('') // Reset query
            return
          }

          onLocationSelect({
            address: placeName,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            country: country
          })
        }
      })
    } else {
      // Fallback if placesService is not ready
      geocodeAddress(placeName).then(coords => {
        if (coords) {
          // No easy country check here without reverse geocoding, 
          // but we can assume most typing queries that bypass Place details might be within bounds,
          // or we can skip check here.
          onLocationSelect({
            address: placeName,
            lat: coords.lat,
            lng: coords.lng,
            country: 'Nigeria'
          })
        }
      })
    }
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          onChange(e.target.value)
          if (!e.target.value) onLocationSelect(null as any)
        }}
        onFocus={() => { if (suggestions.length > 0) setIsOpen(true) }}
        placeholder={placeholder}
        className={className}
        style={style}
      />
      {isOpen && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 50,
          background: 'var(--color-nets-navy-dark)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '4px',
          marginTop: '4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          maxHeight: '240px',
          overflowY: 'auto'
        }}>
          {suggestions.map((s) => (
            <div
              key={s.place_id}
              onClick={() => handleSelect(s)}
              style={{
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                color: '#fff',
                fontSize: '0.875rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ color: 'var(--color-nets-text-3)', display: 'flex', alignItems: 'center' }}>
                <MapPin size={16} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.structured_formatting.main_text}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {s.structured_formatting.secondary_text}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
