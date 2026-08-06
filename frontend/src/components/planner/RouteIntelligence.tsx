import { useEffect, useState } from 'react'
import { useJourneyStore, LocationData } from '../../store/useJourneyStore'
import { GOOGLE_MAPS_API_KEY, geocodeAddress } from '../../config/api'
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'

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
  const { pickup, destination, stops, setRouteCalculations } = useJourneyStore()
  const map = useMap()
  const routesLibrary = useMapsLibrary('routes')
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null)

  useEffect(() => {
    if (!map || !routesLibrary) return
    if (!directionsRenderer) {
      setDirectionsRenderer(new routesLibrary.DirectionsRenderer({
        map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#C0272D',
          strokeWeight: 4,
          strokeOpacity: 0.8
        }
      }))
    }
  }, [map, routesLibrary, directionsRenderer])

  useEffect(() => {
    if (!pickup || !destination || !routesLibrary || !directionsRenderer) {
      return
    }

    const calculateRoute = async () => {
      try {
        let pLat = pickup.lat
        let pLng = pickup.lng
        
        if (!pLat || !pLng) {
          const coords = await geocodeAddress(pickup.address)
          if (coords) { pLat = coords.lat; pLng = coords.lng }
        }

        let dLat = destination.lat
        let dLng = destination.lng
        
        if (!dLat || !dLng) {
          const coords = await geocodeAddress(destination.address)
          if (coords) { dLat = coords.lat; dLng = coords.lng }
        }

        if (!pLat || !pLng || !dLat || !dLng) {
          throw new Error('Coordinates missing and could not be geocoded')
        }

        const waypoints = stops.filter((s: LocationData) => s.lat && s.lng)
        
        const directionsService = new routesLibrary.DirectionsService()
        const request: google.maps.DirectionsRequest = {
          origin: { lat: pLat, lng: pLng },
          destination: { lat: dLat, lng: dLng },
          waypoints: waypoints.map((s: LocationData) => ({ location: { lat: s.lat!, lng: s.lng! }, stopover: true })),
          travelMode: google.maps.TravelMode.DRIVING,
        }

        const result = await directionsService.route(request)
        directionsRenderer.setDirections(result)
        
        const route = result.routes[0]
        let totalDistanceMeters = 0
        let totalDurationSeconds = 0

        route.legs.forEach((leg: google.maps.DirectionsLeg) => {
          totalDistanceMeters += leg.distance?.value || 0
          totalDurationSeconds += leg.duration?.value || 0
        })

        const distanceKm = Math.round((totalDistanceMeters / 1000) * 10) / 10
        const durationMins = Math.round(totalDurationSeconds / 60)
        
        const insights: string[] = []
        if (distanceKm > 100) insights.push('Long Distance Journey')
        if (distanceKm > 300) insights.push('Interstate Journey')
        if (distanceKm <= 50) insights.push('Urban Journey')
        
        if (destination.country && destination.country !== 'Nigeria') {
          insights.push('International Border Crossing - Special Request')
        }

        const bounds = route.bounds
        const sw = bounds.getSouthWest()
        const ne = bounds.getNorthEast()

        setRouteCalculations({
          distanceKm,
          distanceMeters: totalDistanceMeters,
          durationMins,
          durationSeconds: totalDurationSeconds,
          durationText: `${Math.floor(durationMins / 60)}h ${durationMins % 60}m`,
          routePolyline: route.overview_polyline, // Storing encoded polyline just in case
          journeyBounds: [[sw.lng(), sw.lat()], [ne.lng(), ne.lat()]], // Format for bounds
          journeyInsights: insights
        })

      } catch (err) {
        console.warn('Google Directions failed, using Haversine fallback', err)
        directionsRenderer.setDirections({ routes: [] } as any)
        
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
  }, [pickup, destination, stops, setRouteCalculations, routesLibrary, directionsRenderer])

  return null
}
