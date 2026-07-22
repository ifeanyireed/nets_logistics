import { useEffect, useRef, useState } from 'react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { useJourneyStore, LocationData } from '../../store/useJourneyStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'

const MOCK_LOCATIONS = [
  { address: 'Murtala Muhammed International Airport (LOS), Ikeja, Lagos', lat: 6.5774, lng: 3.3223, placeId: 'mock_los', admin: 'Lagos', country: 'Nigeria' },
  { address: 'Victoria Island, Lagos', lat: 6.4281, lng: 3.4219, placeId: 'mock_vi', admin: 'Lagos', country: 'Nigeria' },
  { address: 'Lekki Phase 1, Lagos', lat: 6.4474, lng: 3.4723, placeId: 'mock_lekki', admin: 'Lagos', country: 'Nigeria' },
  { address: 'Ikeja City Mall, Alausa, Ikeja', lat: 6.6139, lng: 3.3578, placeId: 'mock_icm', admin: 'Lagos', country: 'Nigeria' },
  { address: 'Nnamdi Azikiwe International Airport (ABV), Abuja', lat: 9.0065, lng: 7.2631, placeId: 'mock_abv', admin: 'Federal Capital Territory', country: 'Nigeria' },
  { address: 'Wuse 2, Abuja', lat: 9.0788, lng: 7.4725, placeId: 'mock_wuse2', admin: 'Federal Capital Territory', country: 'Nigeria' },
  { address: 'Maitama, Abuja', lat: 9.0833, lng: 7.4988, placeId: 'mock_maitama', admin: 'Federal Capital Territory', country: 'Nigeria' },
  { address: 'Port Harcourt International Airport (PHC), Omagwa', lat: 5.0155, lng: 6.9496, placeId: 'mock_phc', admin: 'Rivers', country: 'Nigeria' },
  { address: 'GRA Phase 2, Port Harcourt', lat: 4.8156, lng: 7.0498, placeId: 'mock_grap2', admin: 'Rivers', country: 'Nigeria' },
  { address: 'Eko Hotels & Suites, Victoria Island, Lagos', lat: 6.4258, lng: 3.4244, placeId: 'mock_eko', admin: 'Lagos', country: 'Nigeria' },
  { address: 'Transcorp Hilton, Abuja', lat: 9.0747, lng: 7.4950, placeId: 'mock_hilton', admin: 'Federal Capital Territory', country: 'Nigeria' }
]

interface GoogleAutocompleteProps {
  value: string | null
  onChange: (value: string) => void
  onLocationSelect: (location: LocationData | null) => void
  placeholder?: string
  className?: string
  style?: React.CSSProperties
}

export function GoogleAutocomplete({ value, onChange, onLocationSelect, placeholder, className, style }: GoogleAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const placesLibrary = useMapsLibrary('places')
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
  const [isApiReady, setIsApiReady] = useState(false)
  const [showMockDropdown, setShowMockDropdown] = useState(false)

  const filteredMockLocations = MOCK_LOCATIONS.filter(loc => 
    (value || '').toLowerCase() === '' || loc.address.toLowerCase().includes((value || '').toLowerCase())
  ).slice(0, 5)

  const handleMockSelect = (loc: typeof MOCK_LOCATIONS[0]) => {
    onChange(loc.address)
    onLocationSelect({
      address: loc.address,
      lat: loc.lat,
      lng: loc.lng,
      placeId: loc.placeId,
      displayName: loc.address.split(',')[0],
      administrativeArea: loc.admin,
      country: loc.country
    })
    setShowMockDropdown(false)
  }

  // Initialize Autocomplete
  useEffect(() => {
    if (!placesLibrary || !inputRef.current) return

    const options = {
      fields: ['geometry', 'name', 'formatted_address', 'place_id', 'address_components'],
      componentRestrictions: { country: 'ng' } // Restrict to Nigeria for NETS
    }

    try {
      const widget = new placesLibrary.Autocomplete(inputRef.current, options)
      setAutocomplete(widget)
      setIsApiReady(true)
    } catch (e) {
      console.error('Google Places Autocomplete failed to initialise:', e)
      setIsApiReady(false)
    }
  }, [placesLibrary])

  // Handle Place Selection
  useEffect(() => {
    if (!autocomplete) return

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      
      if (!place.geometry || !place.geometry.location) {
        // User pressed enter on a free-text entry instead of selecting a suggestion
        // If API fails, we just allow the free text, but we don't have lat/lng
        onLocationSelect(null)
        if (inputRef.current) onChange(inputRef.current.value)
        return
      }

      const formattedAddress = place.formatted_address || place.name || ''
      
      // Extract Admin Area / State
      let adminArea = ''
      let country = ''
      if (place.address_components) {
        for (const component of place.address_components) {
          if (component.types.includes('administrative_area_level_1')) {
            adminArea = component.long_name
          }
          if (component.types.includes('country')) {
            country = component.long_name
          }
        }
      }

      onChange(formattedAddress)
      onLocationSelect({
        address: formattedAddress,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        placeId: place.place_id,
        displayName: place.name,
        administrativeArea: adminArea,
        country: country
      })
    })

    return () => {
      google.maps.event.removeListener(listener)
    }
  }, [autocomplete, onLocationSelect, onChange])

  // If the API isn't ready, we still want the input to function as a dumb text box for fallback
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder || "Search for a location..."}
        value={value || ''}
        onChange={(e) => {
          onChange(e.target.value)
          if (!isApiReady) {
            setShowMockDropdown(true)
            onLocationSelect(null) 
          }
        }}
        onFocus={() => {
          if (!isApiReady) setShowMockDropdown(true)
        }}
        onBlur={(e) => {
          // Delay hiding to allow click on dropdown
          if (!isApiReady) {
            setTimeout(() => setShowMockDropdown(false), 200)
          }
        }}
        className={className}
        style={style}
      />

      {/* Fallback Mock Autocomplete Dropdown when API is dead */}
      {!isApiReady && (
        <AnimatePresence>
          {showMockDropdown && (value || '').length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                background: '#fff', border: '1px solid var(--color-nets-border)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)', marginTop: '0.5rem', borderRadius: '4px', overflow: 'hidden'
              }}
            >
              {filteredMockLocations.length > 0 ? (
                filteredMockLocations.map((loc, i) => (
                  <button
                    key={i}
                    onClick={() => handleMockSelect(loc)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem', width: '100%',
                      padding: '1rem 1.25rem', background: 'transparent', border: 'none', borderBottom: i === filteredMockLocations.length -1 ? 'none' : '1px solid var(--color-nets-border)',
                      textAlign: 'left', cursor: 'pointer'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'var(--color-nets-light)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <Search size={16} color="var(--color-nets-text-3)" />
                    <span style={{ fontSize: '0.9375rem', color: 'var(--color-nets-navy-dark)', fontWeight: 500 }}>
                      {loc.address}
                    </span>
                  </button>
                ))
              ) : (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-nets-text-3)', fontSize: '0.875rem' }}>
                  Press confirm to use "{value}" as a custom address.
                  <button 
                    onClick={() => {
                      onChange(value || '')
                      onLocationSelect(null)
                      setShowMockDropdown(false)
                    }}
                    style={{ display: 'block', margin: '0.5rem auto 0', padding: '0.5rem 1rem', background: 'var(--color-nets-navy-dark)', color: '#fff', border: 'none', borderRadius: '2px', cursor: 'pointer' }}
                  >
                    Use this address
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
