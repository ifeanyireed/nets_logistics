import { API_URL } from '../config/api'
import { Vehicle } from '../types'
import { vehicles as fallbackVehicles } from '../data/vehicles'

export class VehicleService {
  /**
   * Fetch all vehicles from backend REST API (with static fallback).
   */
  public async getVehicles(): Promise<Vehicle[]> {
    try {
      const res = await fetch(`${API_URL}/vehicles`)
      if (res.ok) {
        const json = await res.json()
        if (json.data && Array.isArray(json.data.vehicles) && json.data.vehicles.length > 0) {
          return json.data.vehicles
        }
      }
    } catch (err) {
      console.warn('⚠️ [VEHICLE SERVICE] Could not reach Go backend API, using local fallback:', err)
    }
    return fallbackVehicles
  }

  /**
   * Fetch single vehicle by slug.
   */
  public async getVehicleBySlug(slug: string): Promise<Vehicle | undefined> {
    try {
      const res = await fetch(`${API_URL}/vehicles/${slug}`)
      if (res.ok) {
        const json = await res.json()
        if (json.data && json.data.vehicle) {
          return json.data.vehicle
        }
      }
    } catch (err) {
      console.warn('⚠️ [VEHICLE SERVICE] Could not fetch vehicle detail from backend:', err)
    }
    const all = await this.getVehicles()
    return all.find((v) => v.slug === slug || v.id === slug)
  }
}

export const vehicleService = new VehicleService()
