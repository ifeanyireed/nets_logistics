/**
 * Centralized Environment & API Configuration
 */

export const API_URL = 
  import.meta.env.NEXT_PUBLIC_API_URL || 
  import.meta.env.VITE_API_URL || 
  'http://localhost:8080/api/v1'

export const MAPBOX_TOKEN = 
  import.meta.env.NEXT_PUBLIC_MAPBOX_TOKEN || 
  import.meta.env.VITE_MAPBOX_TOKEN || 
  ''

export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const query = encodeURIComponent(address)
    // West/Central Africa bounding box (approx 0.0,2.0 to 16.0,15.0) spanning Nigeria and neighbors
    const waBbox = '0.0,2.0,16.0,15.0'
    const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${query}&access_token=${MAPBOX_TOKEN}&limit=1&bbox=${waBbox}&country=ng,bj,ne,td,cm`
    const res = await fetch(url)
    const data = await res.json()
    if (data.features && data.features.length > 0) {
      const geometry = data.features[0].geometry
      if (geometry.type === 'Point') {
        const coordinates = geometry.coordinates
        return { lng: coordinates[0], lat: coordinates[1] }
      }
    }
  } catch (err) {
    console.error('Geocoding error:', err)
  }
  return null
}
