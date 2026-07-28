import { useState, useEffect, useRef } from 'react'
import { MapPin } from 'lucide-react'
import { LocationData } from '../../store/useJourneyStore'
import { MAPBOX_TOKEN } from '../../config/api'

interface MapboxAutocompleteProps {
  value: string | null
  onChange: (value: string) => void
  onLocationSelect: (location: LocationData) => void
  placeholder?: string
  className?: string
  style?: React.CSSProperties
}

export function MapboxAutocomplete({ value, onChange, onLocationSelect, placeholder, className, style }: MapboxAutocompleteProps) {
  const [query, setQuery] = useState(value || '')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

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
      if (!query || query.length < 3 || query === value) {
        setSuggestions([])
        return
      }
      try {
        // West/Central Africa bounding box (approx 0.0,2.0 to 16.0,15.0) spanning Nigeria and neighbors
        const waBbox = '0.0,2.0,16.0,15.0'
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&bbox=${waBbox}`)
        const data = await res.json()
        
        // Map Photon features to a standardized format
        const formattedFeatures = (data.features || []).map((f: any) => {
          const props = f.properties
          const name = props.name || ''
          const street = props.street || ''
          const city = props.city || props.county || ''
          const state = props.state || ''
          const country = props.country || ''
          
          let parts = []
          if (name) parts.push(name)
          if (street && street !== name) parts.push(street)
          if (city) parts.push(city)
          if (state) parts.push(state)
          if (country) parts.push(country)
          
          return {
            id: f.properties.osm_id || Math.random().toString(),
            place_name: parts.join(', '),
            text: name || street || city,
            center: f.geometry.coordinates,
            country: country
          }
        }).filter((f: any) => f.place_name)

        setSuggestions(formattedFeatures)
        setIsOpen(true)
      } catch (err) {
        console.error('Photon search failed', err)
      }
    }
    const timeoutId = setTimeout(fetchPlaces, 100)
    return () => clearTimeout(timeoutId)
  }, [query, value])

  const handleSelect = (feature: any) => {
    setQuery(feature.place_name)
    setIsOpen(false)
    onChange(feature.place_name)
    
    onLocationSelect({
      address: feature.place_name,
      lat: feature.center[1],
      lng: feature.center[0],
      country: feature.country || 'Nigeria'
    })
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
              key={s.id}
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
                <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.text}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {s.place_name.replace(s.text + ', ', '')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
