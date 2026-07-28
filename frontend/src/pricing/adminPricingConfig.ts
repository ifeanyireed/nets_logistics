export interface PricingConfig {
  fuelPricePerLitre: number
  driverDailyAllowance: number
  driverOutstationAllowance: number
  maintenanceCostPerKm: number
  minimumChargeHiace: number
  minimumChargeCoaster: number
  hiaceMarkupPercent: number
  coasterMarkupPercent: number
  airportSurcharge: number
  waitingChargePerHour: number
  overnightChargePerNight: number
  longDistanceThresholdKm: number
  longDistanceSurchargePercent: number
  corporateDiscountPercent: number
}

export const defaultPricingConfig: PricingConfig = {
  fuelPricePerLitre: 1300,
  driverDailyAllowance: 10000,
  driverOutstationAllowance: 25000,
  maintenanceCostPerKm: 50,
  minimumChargeHiace: 90000,
  minimumChargeCoaster: 180000,
  hiaceMarkupPercent: 20,
  coasterMarkupPercent: 25,
  airportSurcharge: 15000,
  waitingChargePerHour: 5000,
  overnightChargePerNight: 35000,
  longDistanceThresholdKm: 200,
  longDistanceSurchargePercent: 10,
  corporateDiscountPercent: 5,
}

// Global state for in-memory pricing config across the app
let currentPricingConfig = { ...defaultPricingConfig }

export function getPricingConfig() {
  return currentPricingConfig
}

export function updatePricingConfig(newConfig: PricingConfig) {
  currentPricingConfig = { ...newConfig }
}
