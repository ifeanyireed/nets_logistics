import { API_URL } from '../config/api'

export interface PricingConfig {
  fuelPricePerLitre: number;
  coasterFuelRatio: number;
  hiaceFuelRatio: number;
  saloonFuelRatio: number;
  coasterDriverSalary: number;
  hiaceDriverSalary: number;
  saloonDriverSalary: number;
  coasterMaintenance: number;
  hiaceMaintenance: number;
  saloonMaintenance: number;
  coasterSecurity: number;
  hiaceSecurity: number;
  saloonSecurity: number;
  coasterLevies: number;
  hiaceLevies: number;
  saloonLevies: number;
  coasterOutstationAllowance: number;
  hiaceOutstationAllowance: number;
  saloonOutstationAllowance: number;
  coasterDepreciation: number;
  hiaceDepreciation: number;
  saloonDepreciation: number;
  coasterMarkupPercent: number;
  hiaceMarkupPercent: number;
  saloonMarkupPercent: number;
  coasterRetentionParked: number;
  hiaceRetentionParked: number;
  saloonRetentionParked: number;
  coasterRetentionMoving: number;
  hiaceRetentionMoving: number;
  saloonRetentionMoving: number;
}

export const defaultPricingConfig: PricingConfig = {
  fuelPricePerLitre: 1200,
  coasterFuelRatio: 0.5,
  hiaceFuelRatio: 0.35,
  saloonFuelRatio: 0.25,
  coasterDriverSalary: 10000,
  hiaceDriverSalary: 10000,
  saloonDriverSalary: 10000,
  coasterMaintenance: 12500,
  hiaceMaintenance: 8500,
  saloonMaintenance: 3500,
  coasterSecurity: 3000,
  hiaceSecurity: 2500,
  saloonSecurity: 2500,
  coasterLevies: 2000,
  hiaceLevies: 1000,
  saloonLevies: 1000,
  coasterOutstationAllowance: 10000,
  hiaceOutstationAllowance: 0,
  saloonOutstationAllowance: 0,
  coasterDepreciation: 45000,
  hiaceDepreciation: 55000,
  saloonDepreciation: 11180,
  coasterMarkupPercent: 36,
  hiaceMarkupPercent: 10,
  saloonMarkupPercent: 0,
  coasterRetentionParked: 150000,
  hiaceRetentionParked: 150000,
  saloonRetentionParked: 150000,
  coasterRetentionMoving: 200000,
  hiaceRetentionMoving: 200000,
  saloonRetentionMoving: 200000,
};

export async function fetchPricingConfig(): Promise<PricingConfig> {
  try {
    const res = await fetch(`${API_URL}/pricing`)
    if (res.ok) {
      const json = await res.json()
      // The backend wraps response in { success: true, data: { ... } }
      // AND the pricing handler itself wrapped it in { data: config }
      // So the actual config might be in json.data.data or json.data
      const remoteConfig = json.data?.data || json.data
      
      if (remoteConfig && Object.keys(remoteConfig).length > 0) {
        // Strip out the nested "data" key if it somehow got saved
        const cleanConfig = { ...remoteConfig };
        delete cleanConfig.data;
        
        return { ...defaultPricingConfig, ...cleanConfig }
      }
    }
  } catch (err) {
    console.warn('⚠️ [PRICING CONFIG] Could not load from backend, using defaults:', err)
  }
  return { ...defaultPricingConfig }
}

export async function savePricingConfig(newConfig: PricingConfig): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/pricing`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newConfig)
    })
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: errData.error || `HTTP ${res.status}` };
    }
    return { success: true }
  } catch (err: any) {
    console.error('⚠️ [PRICING CONFIG] Network error saving config:', err)
    return { success: false, error: err.message || 'Network error' }
  }
}
