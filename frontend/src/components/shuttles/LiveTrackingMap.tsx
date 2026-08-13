import { useState, useEffect } from 'react'
import { Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { Play } from 'lucide-react'
import type { ShuttleBooking } from '../../types/shuttle'

interface LiveTrackingMapProps {
  booking: ShuttleBooking
  progressPct: number
  etaMins: number
  onAdvanceSimulation: () => void
}

function ShuttleMapDirections({ pickup, dropoff }: { pickup: { lat: number; lng: number }; dropoff: { lat: number; lng: number } }) {
  const map = useMap()
  const routesLibrary = useMapsLibrary('routes')
  const [renderer, setRenderer] = useState<google.maps.DirectionsRenderer | null>(null)

  useEffect(() => {
    if (!map || !routesLibrary) return
    if (!renderer) {
      const r = new routesLibrary.DirectionsRenderer({
        map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#C0272D',
          strokeWeight: 5,
          strokeOpacity: 0.95
        }
      })
      setRenderer(r)
    }
  }, [map, routesLibrary, renderer])

  useEffect(() => {
    if (!pickup || !dropoff || !routesLibrary || !renderer) return

    const service = new routesLibrary.DirectionsService()
    service.route({
      origin: { lat: pickup.lat, lng: pickup.lng },
      destination: { lat: dropoff.lat, lng: dropoff.lng },
      travelMode: google.maps.TravelMode.DRIVING
    }).then(result => {
      renderer.setDirections(result)
      if (map && result.routes[0]?.bounds) {
        map.fitBounds(result.routes[0].bounds, 50)
      }
    }).catch(err => {
      console.warn('Google Directions route fallback:', err)
      if (map) {
        const bounds = new google.maps.LatLngBounds()
        bounds.extend(new google.maps.LatLng(pickup.lat, pickup.lng))
        bounds.extend(new google.maps.LatLng(dropoff.lat, dropoff.lng))
        map.fitBounds(bounds, 50)
      }
    })
  }, [map, pickup, dropoff, routesLibrary, renderer])

  return null
}

export function LiveTrackingMap({ booking, progressPct, etaMins, onAdvanceSimulation }: LiveTrackingMapProps) {
  useEffect(() => {
    const timer = setInterval(() => {
      onAdvanceSimulation()
    }, 8000)
    return () => clearInterval(timer)
  }, [onAdvanceSimulation])

  const pickupLat = booking.pickupStop.lat
  const pickupLng = booking.pickupStop.lng
  const dropoffLat = booking.dropoffStop.lat
  const dropoffLng = booking.dropoffStop.lng

  // Interpolate vehicle live location along route segment
  const t = Math.min(1, Math.max(0, progressPct / 100))
  const vehicleLat = pickupLat + (dropoffLat - pickupLat) * t
  const vehicleLng = pickupLng + (dropoffLng - pickupLng) * t

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '380px',
      background: 'var(--color-nets-navy-dark)',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.15)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
    }}>
      <Map
        defaultZoom={12}
        defaultCenter={{ lat: pickupLat, lng: pickupLng }}
        mapId="NETS_LIVE_SHUTTLE_MAP_ID"
        disableDefaultUI={true}
      >
        <ShuttleMapDirections
          pickup={{ lat: pickupLat, lng: pickupLng }}
          dropoff={{ lat: dropoffLat, lng: dropoffLng }}
        />

        {/* Pickup Stop Marker */}
        <AdvancedMarker position={{ lat: pickupLat, lng: pickupLng }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              background: '#10b981',
              color: '#fff',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: 700,
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              marginBottom: '4px',
              whiteSpace: 'nowrap'
            }}>
              Pickup: {booking.pickupStop.name}
            </div>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#10b981', border: '3px solid #fff', boxShadow: '0 0 10px #10b981' }} />
          </div>
        </AdvancedMarker>

        {/* Drop-off Stop Marker */}
        <AdvancedMarker position={{ lat: dropoffLat, lng: dropoffLng }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              background: 'var(--color-nets-red)',
              color: '#fff',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: 700,
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              marginBottom: '4px',
              whiteSpace: 'nowrap'
            }}>
              Drop-off: {booking.dropoffStop.name}
            </div>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'var(--color-nets-red)', border: '3px solid #fff', boxShadow: '0 0 10px var(--color-nets-red)' }} />
          </div>
        </AdvancedMarker>

        {/* Live Moving Vehicle Marker */}
        <AdvancedMarker position={{ lat: vehicleLat, lng: vehicleLng }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              background: 'var(--color-nets-navy-dark)',
              border: '1px solid #4ade80',
              color: '#4ade80',
              padding: '0.2rem 0.6rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              marginBottom: '4px',
              whiteSpace: 'nowrap'
            }}>
              {etaMins === 0 ? 'ARRIVED' : `${etaMins} mins ETA`}
            </div>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--color-nets-red)',
              border: '3px solid #fff',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              color: '#fff',
              fontWeight: 900,
              fontSize: '0.75rem',
              boxShadow: '0 0 15px rgba(192, 39, 45, 0.8)'
            }}>
              BUS
            </div>
          </div>
        </AdvancedMarker>

      </Map>

      {/* Floating GPS Status Overlay */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        background: 'rgba(13, 16, 96, 0.9)',
        backdropFilter: 'blur(8px)',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        zIndex: 10
      }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
        <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: 600 }}>
          Google Maps GPS Connected
        </span>
        <button
          onClick={onAdvanceSimulation}
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            color: '#fff',
            fontSize: '0.7rem',
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: '0.5rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          <span>Fast-Forward</span>
          <Play size={10} fill="#fff" />
        </button>
      </div>

    </div>
  )
}
