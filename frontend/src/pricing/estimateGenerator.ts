import type {
  JourneyPricingInput,
  EstimatedInvestment,
} from './pricing.types'
import { getPricingConfig } from './adminPricingConfig'
import { getVehiclePricingConfig } from './vehiclePricingConfig'
import { PricingError, validatePricingInputs } from './pricingErrors'
import { PRICING_ENGINE_VERSION } from './crmPayloadBuilder'

/**
 * Generate a complete pricing estimate for a journey based on the Admin Pricing Config.
 */
export function generateEstimate(input: JourneyPricingInput): EstimatedInvestment {
  const validationErrors = validatePricingInputs({
    vehicleId: input.vehicleId,
    distanceKm: input.distanceKm,
  })

  if (validationErrors.length > 0) {
    throw new PricingError(
      `Pricing validation failed: ${validationErrors.join(', ')}`,
      'VALIDATION_ERROR'
    )
  }

  const adminConfig = getPricingConfig()
  const vehicleConfig = getVehiclePricingConfig(input.vehicleId) // For vehicleName

  // Step 1: Base Operating Costs
  const isCoaster = input.vehicleId === 'coaster' || input.vehicleId === 'coach-50'
  const vehicleFuelEfficiency = isCoaster ? 15 : 8 // Liters per 100km

  const fuelCost = (input.distanceKm / 100) * vehicleFuelEfficiency * adminConfig.fuelPricePerLitre
  const maintenanceCost = input.distanceKm * adminConfig.maintenanceCostPerKm
  
  const isOutstation = input.tripType === 'Multi-Day' || input.tripType === 'Recurring' || input.numberOfDays > 1
  const driverCost = isOutstation
    ? adminConfig.driverOutstationAllowance * input.numberOfDays
    : adminConfig.driverDailyAllowance * input.numberOfDays

  const baseCost = fuelCost + maintenanceCost + driverCost

  // Step 2: Margin & Floor Price
  const vehicleMarkupPercent = isCoaster ? adminConfig.coasterMarkupPercent : adminConfig.hiaceMarkupPercent
  const vehicleMinimumCharge = isCoaster ? adminConfig.minimumChargeCoaster : adminConfig.minimumChargeHiace

  const markedUpPrice = baseCost * (1 + vehicleMarkupPercent / 100)
  
  let floorPrice = Math.max(markedUpPrice, vehicleMinimumCharge * input.numberOfDays)
  const minimumChargeApplied = floorPrice > markedUpPrice

  // Step 3: Event-Driven Surcharges
  let surcharges = 0

  if (input.distanceKm > adminConfig.longDistanceThresholdKm) {
    surcharges += floorPrice * (adminConfig.longDistanceSurchargePercent / 100)
  }

  // Very basic airport detection from journeyInsights or we can leave it to the dispatcher.
  // We'll apply it if journeyInsights contains "Airport"
  const hasAirport = input.journeyInsights.some(insight => insight.toLowerCase().includes('airport'))
  if (hasAirport) {
    surcharges += adminConfig.airportSurcharge
  }

  if (input.numberOfDays > 1) {
    surcharges += adminConfig.overnightChargePerNight * (input.numberOfDays - 1)
  }

  const subtotal = floorPrice + surcharges

  // Step 4: Final Modifiers
  let discounts = 0
  // Corporate Staff intent gives corporate discount
  if (input.journeyInsights.includes('Corporate Staff')) {
    discounts = subtotal * (adminConfig.corporateDiscountPercent / 100)
  }

  const finalTotal = subtotal - discounts

  const pricingNotes: string[] = []
  if (minimumChargeApplied) pricingNotes.push('Minimum charge threshold applied')
  if (hasAirport) pricingNotes.push('Airport Surcharge applied')
  if (discounts > 0) pricingNotes.push('Corporate Discount applied')

  return {
    estimatedInvestment: finalTotal,
    rateTier: input.tripType === 'Recurring' ? 'monthly' : input.tripType === 'Multi-Day' ? 'three-day' : 'daily',
    vehicleId: input.vehicleId,
    vehicleName: vehicleConfig.vehicleName,
    minimumChargeApplied,
    pricingNotes,
    pricingVersion: PRICING_ENGINE_VERSION,
    calculatedAt: new Date().toISOString(),
  }
}
