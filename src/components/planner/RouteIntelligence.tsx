import { useEffect, useState } from 'react'
import { useMapsLibrary, useMap } from '@vis.gl/react-google-maps'
import { useJourneyStore, LocationData } from '../../store/useJourneyStore'

// Fallback Haversine for development without API Key
function getFallbackDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180) 
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)))
}

export function RouteIntelligence() {
  const map = useMap()
  const routesLibrary = useMapsLibrary('routes')
  const { pickup, destination, stops, setRouteCalculations } = useJourneyStore()
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null)
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null)

  useEffect(() => {
    if (!routesLibrary || !map) return
    if (!directionsService) setDirectionsService(new routesLibrary.DirectionsService())
    if (!directionsRenderer) {
      setDirectionsRenderer(new routesLibrary.DirectionsRenderer({
        map,
        suppressMarkers: true, // We use custom AdvancedMarkers
        polylineOptions: {
          strokeColor: '#C0272D', // var(--color-nets-red)
          strokeOpacity: 0.8,
          strokeWeight: 4,
        }
      }))
    }
  }, [routesLibrary, map, directionsService, directionsRenderer])

  useEffect(() => {
    // We only calculate a full route when we have both pickup and destination
    if (!pickup || !destination) {
      if (directionsRenderer) directionsRenderer.setDirections(null)
      return
    }

    const calculateRoute = async () => {
      try {
        if (!directionsService || !directionsRenderer) throw new Error('Directions Service not ready')

        const waypoints = stops.filter((s: LocationData) => s.lat && s.lng).map((s: LocationData) => ({
          location: new google.maps.LatLng(s.lat, s.lng),
          stopover: true
        }))

        const request: google.maps.DirectionsRequest = {
          origin: new google.maps.LatLng(pickup.lat, pickup.lng),
          destination: new google.maps.LatLng(destination.lat, destination.lng),
          waypoints: waypoints,
          travelMode: google.maps.TravelMode.DRIVING,
          optimizeWaypoints: false // Keep user's chosen order
        }

        const result = await directionsService.route(request)
        directionsRenderer.setDirections(result) // Draw on map
        
        const route = result.routes[0]

        if (!route || !route.legs) throw new Error('No route legs found')

        let totalDistanceMeters = 0
        let totalDurationSeconds = 0

        route.legs.forEach(leg => {
          totalDistanceMeters += leg.distance?.value || 0
          totalDurationSeconds += leg.duration?.value || 0
        })

        const distanceKm = Math.round((totalDistanceMeters / 1000) * 10) / 10
        const durationMins = Math.round(totalDurationSeconds / 60)
        
        // Generate Journey Insights
        const insights: string[] = []
        if (distanceKm > 100) insights.push('Long Distance Journey')
        if (distanceKm > 300) insights.push('Interstate Journey')
        if (distanceKm <= 50) insights.push('Urban Journey')
        
        // Service Area Check
        if (destination.country && destination.country !== 'Nigeria') {
          insights.push('International Border Crossing - Special Request')
        }

        setRouteCalculations({
          distanceKm,
          distanceMeters: totalDistanceMeters,
          durationMins,
          durationSeconds: totalDurationSeconds,
          durationText: `${Math.floor(durationMins / 60)}h ${durationMins % 60}m`,
          routePolyline: route.overview_polyline,
          journeyBounds: route.bounds.toJSON(),
          journeyInsights: insights
        })

      } catch (err) {
        console.warn('Google Maps Directions failed, using Haversine fallback', err)
        if (directionsRenderer) directionsRenderer.setDirections(null)
        
        // Fallback calculation
        let totalKm = 0
        const points = [pickup, ...stops, destination].filter(p => p && p.lat && p.lng) as any[]
        for (let i = 0; i < points.length - 1; i++) {
          totalKm += getFallbackDistanceKm(points[i].lat, points[i].lng, points[i+1].lat, points[i+1].lng)
        }
        totalKm = Math.max(1.5, Math.round(totalKm * 10) / 10)
        const totalMins = Math.round(totalKm * 2.5)

        const insights: string[] = []
        if (totalKm > 100) insights.push('Long Distance Journey')
        if (totalKm <= 50) insights.push('Urban Journey')

        setRouteCalculations({
          distanceKm: totalKm,
          distanceMeters: totalKm * 1000,
          durationMins: totalMins,
          durationSeconds: totalMins * 60,
          durationText: `${Math.floor(totalMins / 60)}h ${totalMins % 60}m`,
          routePolyline: null,
          journeyBounds: null,
          journeyInsights: insights
        })
      }
    }

    calculateRoute()
  }, [pickup, destination, stops, directionsService, directionsRenderer, setRouteCalculations])

  return null // Headless intelligence component
}
