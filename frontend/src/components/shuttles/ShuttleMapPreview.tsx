import { useState, useEffect } from 'react'
import { Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import type { ShuttleStop } from '../../types/shuttle'

interface ShuttleMapPreviewProps {
  stops: ShuttleStop[]
  pickupStop: ShuttleStop | null
  dropoffStop: ShuttleStop | null
  height?: string
  borderRadius?: string
}

function DirectionsController({ pickup, dropoff, waypoints }: { pickup?: ShuttleStop | null; dropoff?: ShuttleStop | null; waypoints?: ShuttleStop[] }) {
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
    if (!pickup || !routesLibrary || !renderer || !waypoints || waypoints.length === 0) return

    const allStops = waypoints
    const pIdx = allStops.findIndex(s => s.id === pickup.id)
    const pickupIndex = pIdx !== -1 ? pIdx : 0

    let dIdx = dropoff ? allStops.findIndex(s => s.id === dropoff.id) : -1
    if (dIdx <= pickupIndex) {
      dIdx = allStops.length - 1
    }
    const dropoffIndex = dIdx

    const originStop = allStops[pickupIndex]
    const destStop = allStops[dropoffIndex]

    // Strictly intermediate waypoints BETWEEN pickupIndex and dropoffIndex
    const intermediateStops = allStops.filter((_, idx) => idx > pickupIndex && idx < dropoffIndex)

    const service = new routesLibrary.DirectionsService()
    service.route({
      origin: { lat: originStop.lat, lng: originStop.lng },
      destination: { lat: destStop.lat, lng: destStop.lng },
      waypoints: intermediateStops.map(w => ({ location: { lat: w.lat, lng: w.lng }, stopover: true })),
      travelMode: google.maps.TravelMode.DRIVING
    }).then(result => {
      renderer.setDirections(result)
      if (map && result.routes[0]?.bounds) {
        map.fitBounds(result.routes[0].bounds, 60)
      }
    }).catch(err => {
      console.warn('Directions preview fallback:', err)
      if (map && originStop && destStop) {
        const bounds = new google.maps.LatLngBounds()
        bounds.extend(new google.maps.LatLng(originStop.lat, originStop.lng))
        bounds.extend(new google.maps.LatLng(destStop.lat, destStop.lng))
        map.fitBounds(bounds, 60)
      }
    })
  }, [map, pickup, dropoff, waypoints, routesLibrary, renderer])

  return null
}

export function ShuttleMapPreview({ stops, pickupStop, dropoffStop, height = '380px', borderRadius = '12px' }: ShuttleMapPreviewProps) {
  const defaultCenter = pickupStop 
    ? { lat: pickupStop.lat, lng: pickupStop.lng }
    : (stops[0] ? { lat: stops[0].lat, lng: stops[0].lng } : { lat: 6.5244, lng: 3.3792 })

  const pIdx = stops.findIndex(s => s.id === pickupStop?.id)
  const pickupIndex = pIdx !== -1 ? pIdx : 0
  const dIdx = dropoffStop ? stops.findIndex(s => s.id === dropoffStop.id) : -1
  const dropoffIndex = dIdx > pickupIndex ? dIdx : stops.length - 1

  return (
    <div style={{
      width: '100%',
      height,
      borderRadius,
      overflow: 'hidden',
      position: 'relative',
      borderTop: '1px solid #e2e8f0',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
    }}>
      <Map
        defaultZoom={11}
        defaultCenter={defaultCenter}
        mapId="NETS_SHUTTLE_PREVIEW_MAP_ID"
        disableDefaultUI={true}
      >
        <DirectionsController pickup={pickupStop} dropoff={dropoffStop} waypoints={stops} />

        {stops.map((stop, idx) => {
          const isPickup = stop.id === pickupStop?.id
          const isDropoff = stop.id === dropoffStop?.id
          const isInActiveSegment = idx >= pickupIndex && idx <= dropoffIndex

          let badgeBg = isInActiveSegment ? 'var(--color-nets-navy-dark)' : '#94a3b8'
          let badgeText = `${idx + 1}. ${stop.name}`
          let dotColor = isInActiveSegment ? 'var(--color-nets-navy)' : '#cbd5e1'

          if (isPickup) {
            badgeBg = '#10b981'
            badgeText = `Pickup: ${stop.name}`
            dotColor = '#10b981'
          } else if (isDropoff) {
            badgeBg = 'var(--color-nets-red)'
            badgeText = `Drop-off: ${stop.name}`
            dotColor = 'var(--color-nets-red)'
          }

          return (
            <AdvancedMarker key={stop.id} position={{ lat: stop.lat, lng: stop.lng }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: isInActiveSegment ? 1 : 0.45 }}>
                <div style={{
                  background: badgeBg,
                  color: '#fff',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  marginBottom: '3px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 3px 8px rgba(0,0,0,0.3)',
                  border: isPickup || isDropoff ? '1.5px solid #fff' : 'none'
                }}>
                  {badgeText}
                </div>
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: dotColor,
                  border: '3px solid #fff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 800
                }}>
                  {!isPickup && !isDropoff && (idx + 1)}
                </div>
              </div>
            </AdvancedMarker>
          )
        })}

      </Map>
    </div>
  )
}
