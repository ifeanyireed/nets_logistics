/// <reference types="@types/google.maps" />
import { Map, useMap, AdvancedMarker } from '@vis.gl/react-google-maps'
import { useEffect, useState } from 'react'
import { useJourneyStore } from '../../store/useJourneyStore'
import { MapPinOff } from 'lucide-react'
import { RouteIntelligence } from './RouteIntelligence'

// Custom professional map styling (removing noisy POIs and using a clean palette)
const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
  { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] }
]

function MapBoundsController() {
  const map = useMap()
  const { pickup, destination, stops, journeyBounds } = useJourneyStore()
  
  useEffect(() => {
    if (!map) return

    // If RouteIntelligence has calculated exact bounds, use them
    if (journeyBounds) {
      map.fitBounds(journeyBounds, { top: 50, bottom: 50, left: 50, right: 50 })
      return
    }

    // Fallback bounds calculation
    const bounds = new window.google.maps.LatLngBounds()
    let hasPoints = false

    if (pickup) {
      bounds.extend({ lat: pickup.lat, lng: pickup.lng })
      hasPoints = true
    }
    
    stops.forEach(stop => {
      if (stop.lat && stop.lng) {
        bounds.extend({ lat: stop.lat, lng: stop.lng })
        hasPoints = true
      }
    })

    if (destination) {
      bounds.extend({ lat: destination.lat, lng: destination.lng })
      hasPoints = true
    }

    if (hasPoints) {
      map.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 })
    }
  }, [map, pickup, destination, stops, journeyBounds])

  return null
}

export function InteractiveMap() {
  const { pickup, destination, stops } = useJourneyStore()
  const [error, setError] = useState(false)

  // Wait for Google Maps to load
  if (error) {
    return (
      <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, background: 'var(--color-nets-navy-dark)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-nets-text-3)', marginBottom: '1rem' }}>
          <MapPinOff size={24} />
        </div>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>
          Live route preview is temporarily unavailable.
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', maxWidth: '280px', lineHeight: 1.5 }}>
          Your journey information has been saved and calculations will continue once mapping services become available.
        </p>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, background: 'var(--color-nets-navy-dark)' }}>
        <Map
          defaultCenter={{ lat: 6.5244, lng: 3.3792 }}
          defaultZoom={11}
          disableDefaultUI={true}
          gestureHandling="greedy"
          styles={mapStyles}
        >
          <MapBoundsController />
          <RouteIntelligence />

          {/* Fallback markers if RouteIntelligence fails or hasn't rendered directions yet */}
          {pickup && (
            <AdvancedMarker position={{ lat: pickup.lat, lng: pickup.lng }}>
              <div style={{ width: '16px', height: '16px', background: '#fff', border: '4px solid var(--color-nets-navy)', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }} />
            </AdvancedMarker>
          )}

          {stops.map((stop, i) => {
            if (!stop.lat || !stop.lng) return null
            return (
              <AdvancedMarker key={i} position={{ lat: stop.lat, lng: stop.lng }}>
                <div style={{ width: '16px', height: '16px', background: 'var(--color-nets-navy)', border: '2px solid #fff', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.6rem', fontWeight: 700 }}>
                  {i + 1}
                </div>
              </AdvancedMarker>
            )
          })}

          {destination && (
            <AdvancedMarker position={{ lat: destination.lat, lng: destination.lng }}>
              <div style={{ width: '20px', height: '20px', background: 'var(--color-nets-red)', border: '4px solid #fff', borderRadius: '50%', boxShadow: '0 4px 12px rgba(192,39,45,0.4)' }} />
            </AdvancedMarker>
          )}

        </Map>

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(circle at center, transparent 0%, rgba(13,16,96,0.1) 100%)' }} />
    </div>
  )
}
