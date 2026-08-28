import { API_URL } from '../config/api'

export interface PricingConfig {
  fuelPricePerLitre: number;
  billOneWayAsReturn: boolean;
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

export async function fetchPricingConfig(): Promise<PricingConfig> {
  let res;
  try {
    res = await fetch(`${API_URL}/pricing`);
  } catch (err: any) {
    throw new Error(`Database connection failed: ${err.message || 'Network Error'}`);
  }

  if (!res.ok) {
    throw new Error(`Failed to load pricing config: HTTP ${res.status}`);
  }
  
  const json = await res.json()
  const remoteConfig = json.data?.data || json.data
  
  if (!remoteConfig || Object.keys(remoteConfig).length === 0) {
    throw new Error("Pricing configuration is missing from the database. Please configure pricing in the admin dashboard.");
  }
  
  const cleanConfig = { ...remoteConfig };
  delete cleanConfig.data;
  
  return cleanConfig as PricingConfig;
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
