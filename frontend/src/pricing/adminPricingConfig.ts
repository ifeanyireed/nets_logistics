import { API_URL } from '../config/api'

export interface PricingConfig {
  // 1. Dynamic Fuel Variables
  fuelPricePerLitre: number;
  coasterFuelRatio: number;
  hiaceFuelRatio: number;
  saloonFuelRatio: number;

  // 2. Static Base Operational Costs - Salaries
  coasterDriverSalary: number;
  hiaceDriverSalary: number;
  saloonDriverSalary: number;

  // 2. Static Base Operational Costs - Maintenance
  coasterMaintenance: number;
  hiaceMaintenance: number;
  saloonMaintenance: number;

  // 2. Static Base Operational Costs - Security
  coasterSecurity: number;
  hiaceSecurity: number;
  saloonSecurity: number;

  // 2. Static Base Operational Costs - Levies
  coasterLevies: number;
  hiaceLevies: number;
  saloonLevies: number;

  // 2. Static Base Operational Costs - Outstation Allowance
  coasterOutstationAllowance: number;
  hiaceOutstationAllowance: number;
  saloonOutstationAllowance: number;

  // 2. Static Base Operational Costs - Depreciation
  coasterDepreciation: number;
  hiaceDepreciation: number;
  saloonDepreciation: number;

  // 3. Profit Margin Variables
  coasterMarkupPercent: number;
  hiaceMarkupPercent: number;
  saloonMarkupPercent: number;

  // 4. Vehicle Retention Fees (3+ Days)
  coasterRetentionParked: number;
  hiaceRetentionParked: number;
  saloonRetentionParked: number;
  coasterRetentionMoving: number;
  hiaceRetentionMoving: number;
  saloonRetentionMoving: number;
}

export const defaultPricingConfig: PricingConfig = {
  // 1. Dynamic Fuel Variables
  fuelPricePerLitre: 1200,
  coasterFuelRatio: 0.5,
  hiaceFuelRatio: 0.35,
  saloonFuelRatio: 0.25,

  // 2. Static Base Operational Costs - Salaries
  coasterDriverSalary: 10000,
  hiaceDriverSalary: 10000,
  saloonDriverSalary: 10000,

  // 2. Static Base Operational Costs - Maintenance
  coasterMaintenance: 12500,
  hiaceMaintenance: 8500,
  saloonMaintenance: 3500,

  // 2. Static Base Operational Costs - Security
  coasterSecurity: 3000,
  hiaceSecurity: 2500,
  saloonSecurity: 2500,

  // 2. Static Base Operational Costs - Levies
  coasterLevies: 2000,
  hiaceLevies: 1000,
  saloonLevies: 1000,

  // 2. Static Base Operational Costs - Outstation Allowance
  coasterOutstationAllowance: 10000,
  hiaceOutstationAllowance: 0,
  saloonOutstationAllowance: 0,

  // 2. Static Base Operational Costs - Depreciation
  coasterDepreciation: 45000,
  hiaceDepreciation: 55000,
  saloonDepreciation: 11180,

  // 3. Profit Margin Variables
  coasterMarkupPercent: 36,
  hiaceMarkupPercent: 10,
  saloonMarkupPercent: 0,

  // 4. Vehicle Retention Fees (3+ Days)
  coasterRetentionParked: 150000,
  hiaceRetentionParked: 150000,
  saloonRetentionParked: 150000,
  coasterRetentionMoving: 200000,
  hiaceRetentionMoving: 200000,
  saloonRetentionMoving: 200000,
};

// Global state for in-memory pricing config across the app
let currentPricingConfig = { ...defaultPricingConfig };
let isConfigLoaded = false;

// Attempt to load from the Go Backend API asynchronously
export async function initializePricingConfig() {
  if (isConfigLoaded) return;
  try {
    const res = await fetch(`${API_URL}/pricing`)
    if (res.ok) {
      const json = await res.json()
      if (json.data && Object.keys(json.data).length > 0) {
        currentPricingConfig = { ...defaultPricingConfig, ...json.data }
        isConfigLoaded = true
        return
      }
    }
  } catch (err) {
    console.warn('⚠️ [PRICING CONFIG] Could not load from backend, using defaults:', err)
  }
}

// Call it immediately on module load (non-blocking)
initializePricingConfig()

export function getPricingConfig() {
  return currentPricingConfig;
}

export async function updatePricingConfig(newConfig: PricingConfig) {
  // Update local memory instantly
  currentPricingConfig = { ...newConfig };
  
  // Persist to backend
  try {
    const res = await fetch(`${API_URL}/pricing`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newConfig)
    })
    if (!res.ok) {
      console.warn('⚠️ [PRICING CONFIG] Failed to save config to backend.')
    }
  } catch (err) {
    console.error('⚠️ [PRICING CONFIG] Network error saving config:', err)
  }
}
