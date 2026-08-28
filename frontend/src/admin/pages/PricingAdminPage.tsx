// ============================================================================
// NETS Admin — Pricing Administration
// ============================================================================
// Editable pricing configurations that feed directly into the pricing engine.
// ============================================================================
import { useState, useEffect } from 'react'
import { Save, RefreshCw, Info } from 'lucide-react'

import { fetchPricingConfig, savePricingConfig, defaultPricingConfig, type PricingConfig } from '../../pricing/adminPricingConfig'

type VehicleTab = 'coaster' | 'hiace' | 'saloon'

const vehicleConfigFields = {
  coaster: {
    fuelRatio: { key: 'coasterFuelRatio', label: 'Fuel Ratio', desc: 'Litres consumed per km (Coaster)', prefix: '' },
    salary: { key: 'coasterDriverSalary', label: 'Driver Salary / Day', desc: 'Daily driver allocation', prefix: '₦' },
    maintenance: { key: 'coasterMaintenance', label: 'Maintenance / Day', desc: 'Amortised daily vehicle maintenance', prefix: '₦' },
    security: { key: 'coasterSecurity', label: 'Security & Parking / Day', desc: 'Security and parking fees', prefix: '₦' },
    levies: { key: 'coasterLevies', label: 'Government Levies / Day', desc: 'Daily government levies', prefix: '₦' },
    outstation: { key: 'coasterOutstationAllowance', label: 'Outstation Allowance / Day', desc: 'Allowance for out-of-town trips', prefix: '₦' },
    depreciation: { key: 'coasterDepreciation', label: 'Depreciation Cost / Day', desc: 'Vehicle depreciation allocation', prefix: '₦' },
    markup: { key: 'coasterMarkupPercent', label: 'Mark-Up (%)', desc: 'Profit margin applied to base cost', prefix: '', suffix: '%' },
    retentionParked: { key: 'coasterRetentionParked', label: 'Retention Fee (Parked) / Day', desc: 'Fee per day when vehicle is kept parked', prefix: '₦' },
    retentionMoving: { key: 'coasterRetentionMoving', label: 'Retention Fee (Moving) / Day', desc: 'Fee per day when vehicle is kept moving', prefix: '₦' },
  },
  hiace: {
    fuelRatio: { key: 'hiaceFuelRatio', label: 'Fuel Ratio', desc: 'Litres consumed per km (HiAce/SUV/Sienna)', prefix: '' },
    salary: { key: 'hiaceDriverSalary', label: 'Driver Salary / Day', desc: 'Daily driver allocation', prefix: '₦' },
    maintenance: { key: 'hiaceMaintenance', label: 'Maintenance / Day', desc: 'Amortised daily vehicle maintenance', prefix: '₦' },
    security: { key: 'hiaceSecurity', label: 'Security & Parking / Day', desc: 'Security and parking fees', prefix: '₦' },
    levies: { key: 'hiaceLevies', label: 'Government Levies / Day', desc: 'Daily government levies', prefix: '₦' },
    outstation: { key: 'hiaceOutstationAllowance', label: 'Outstation Allowance / Day', desc: 'Allowance for out-of-town trips', prefix: '₦' },
    depreciation: { key: 'hiaceDepreciation', label: 'Depreciation Cost / Day', desc: 'Vehicle depreciation allocation', prefix: '₦' },
    markup: { key: 'hiaceMarkupPercent', label: 'Mark-Up (%)', desc: 'Profit margin applied to base cost', prefix: '', suffix: '%' },
    retentionParked: { key: 'hiaceRetentionParked', label: 'Retention Fee (Parked) / Day', desc: 'Fee per day when vehicle is kept parked', prefix: '₦' },
    retentionMoving: { key: 'hiaceRetentionMoving', label: 'Retention Fee (Moving) / Day', desc: 'Fee per day when vehicle is kept moving', prefix: '₦' },
  },
  saloon: {
    fuelRatio: { key: 'saloonFuelRatio', label: 'Fuel Ratio', desc: 'Litres consumed per km (Saloon)', prefix: '' },
    salary: { key: 'saloonDriverSalary', label: 'Driver Salary / Day', desc: 'Daily driver allocation', prefix: '₦' },
    maintenance: { key: 'saloonMaintenance', label: 'Maintenance / Day', desc: 'Amortised daily vehicle maintenance', prefix: '₦' },
    security: { key: 'saloonSecurity', label: 'Security & Parking / Day', desc: 'Security and parking fees', prefix: '₦' },
    levies: { key: 'saloonLevies', label: 'Government Levies / Day', desc: 'Daily government levies', prefix: '₦' },
    outstation: { key: 'saloonOutstationAllowance', label: 'Outstation Allowance / Day', desc: 'Allowance for out-of-town trips', prefix: '₦' },
    depreciation: { key: 'saloonDepreciation', label: 'Depreciation Cost / Day', desc: 'Vehicle depreciation allocation', prefix: '₦' },
    markup: { key: 'saloonMarkupPercent', label: 'Mark-Up (%)', desc: 'Profit margin applied to base cost', prefix: '', suffix: '%' },
    retentionParked: { key: 'saloonRetentionParked', label: 'Retention Fee (Parked) / Day', desc: 'Fee per day when vehicle is kept parked', prefix: '₦' },
    retentionMoving: { key: 'saloonRetentionMoving', label: 'Retention Fee (Moving) / Day', desc: 'Fee per day when vehicle is kept moving', prefix: '₦' },
  }
}

export function PricingAdminPage() {
  const [config, setConfig] = useState<PricingConfig>(defaultPricingConfig)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<{ timestamp: string; config: PricingConfig }[]>([])
  const [activeTab, setActiveTab] = useState<VehicleTab>('hiace')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchPricingConfig().then((data) => {
      if (mounted) {
        setConfig(data)
        setLoading(false)
      }
    })
    return () => { mounted = false }
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const result = await savePricingConfig(config)
    setSaving(false)
    if (result.success) {
      setHistory(h => [{ timestamp: new Date().toISOString(), config: { ...config } }, ...h.slice(0, 4)])
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } else {
      alert(`Failed to save pricing configuration: ${result.error}\nPlease try again.`)
    }
  }

  const handleReset = () => {
    setConfig({ ...defaultPricingConfig })
  }

  const fmtDate = (iso: string) => new Date(iso).toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

  const renderField = (field: any) => (
    <div key={field.key} className="admin-pricing-row">
      <div>
        <div className="admin-pricing-row-label">{field.label}</div>
        <div className="admin-pricing-row-desc">{field.desc}</div>
      </div>
      <div style={{ position: 'relative' }}>
        {field.prefix && (
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--adm-text-2)', fontSize: 13, fontWeight: 500 }}>{field.prefix}</span>
        )}
        <input
          className="admin-input"
          type="number"
          value={(config as any)[field.key]}
          onChange={e => setConfig(c => ({ ...c, [field.key]: parseFloat(e.target.value) || 0 }))}
          style={{ paddingLeft: field.prefix ? '1.75rem' : undefined, textAlign: 'right' }}
        />
        {field.suffix && (
          <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--adm-text-2)', fontSize: 13, fontWeight: 500, pointerEvents: 'none' }}>{field.suffix}</span>
        )}
      </div>
    </div>
  )

  const activeFields = vehicleConfigFields[activeTab]

  return (
    <>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Pricing Administration</div>
          <div className="admin-page-desc">All pricing values feed directly into the Journey Planner engine based on the established spreadsheet calculations. Changes take effect immediately.</div>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-ghost" onClick={handleReset}><RefreshCw size={13} /> Reset Defaults</button>
          <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving || loading}><Save size={13} /> {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}</button>
        </div>
      </div>

      {saved && (
        <div className="admin-alert admin-alert-success" style={{ marginBottom: '1.25rem' }}>
          ✓ Pricing configuration saved. The Journey Planner will reflect these values immediately.
        </div>
      )}

      <div className="admin-grid-2" style={{ gap: '1.5rem', alignItems: 'start' }}>
        <div>
          {/* Global Settings */}
          <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
            <div className="admin-pricing-section-title">Global Settings</div>
            {renderField({ key: 'fuelPricePerLitre', label: 'Fuel Price Per Litre', desc: 'Current market pump price (Global)', prefix: '₦' })}
          </div>

          {/* Vehicle Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', padding: '0.25rem', background: 'var(--adm-bg)', borderRadius: 'var(--adm-radius)', border: '1px solid var(--adm-border-subtle)' }}>
            {(['coaster', 'hiace', 'saloon'] as VehicleTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '0.625rem',
                  fontSize: 13,
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  border: 'none',
                  borderRadius: 'var(--adm-radius-sm)',
                  background: activeTab === tab ? '#fff' : 'transparent',
                  color: activeTab === tab ? 'var(--adm-accent)' : 'var(--adm-text-2)',
                  boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab === 'hiace' ? 'HiAce/SUV/Sienna' : tab}
              </button>
            ))}
          </div>

          {/* Vehicle Specific Settings */}
          <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
            <div className="admin-pricing-section-title">1. Dynamic Fuel Variables</div>
            {renderField(activeFields.fuelRatio)}
          </div>

          <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
            <div className="admin-pricing-section-title">2. Static Base Operational Costs</div>
            {renderField(activeFields.salary)}
            {renderField(activeFields.maintenance)}
            {renderField(activeFields.security)}
            {renderField(activeFields.levies)}
            {renderField(activeFields.outstation)}
            {renderField(activeFields.depreciation)}
          </div>

          <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
            <div className="admin-pricing-section-title">3. Profit Margin Variable</div>
            {renderField(activeFields.markup)}
          </div>

          <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
            <div className="admin-pricing-section-title">4. Vehicle Retention Fees (3+ Days)</div>
            {renderField(activeFields.retentionParked)}
            {renderField(activeFields.retentionMoving)}
          </div>
        </div>

        <div>
          <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
            <div className="admin-card-title">Live Preview</div>
            <div style={{ fontSize: 13, color: 'var(--adm-text-2)', marginBottom: '1rem', textTransform: 'capitalize' }}>
              Sample calculation for a 100km {activeTab === 'hiace' ? 'HiAce/SUV/Sienna' : activeTab} journey (1 Trip)
            </div>
            {(() => {
              const distanceKm = 100
              const trips = 1
              
              const fuelRatio = (config as any)[activeFields.fuelRatio.key]
              const fuelCost = distanceKm * trips * fuelRatio * config.fuelPricePerLitre
              
              const fixedOps = 
                (config as any)[activeFields.salary.key] + 
                (config as any)[activeFields.maintenance.key] + 
                (config as any)[activeFields.security.key] + 
                (config as any)[activeFields.levies.key] + 
                (config as any)[activeFields.outstation.key] + 
                (config as any)[activeFields.depreciation.key]
                
              const baseCost = fuelCost + fixedOps
              
              const markupPercent = (config as any)[activeFields.markup.key]
              const withMarkup = baseCost * (1 + markupPercent / 100)
              
              const final = withMarkup
              const fmt = (n: number) => `₦${Math.round(n).toLocaleString('en-NG')}`
              return (
                <div>
                  {[
                    ['Fuel Cost (100km × 1 trip × ratio × price)', fmt(fuelCost)], 
                    ['Fixed Ops (Salary, Maint, Sec, Levy, Dep)', fmt(fixedOps)], 
                    ['Running Total (Base Cost)', fmt(baseCost)], 
                    [`+ Mark-Up (${markupPercent}%)`, fmt(withMarkup - baseCost)],
                  ].map(([l,v]) => (
                    <div key={l as string} className="admin-detail-row">
                      <span className="admin-detail-label" style={{ fontSize: 12 }}>{l}</span>
                      <span className="admin-detail-value" style={{ fontSize: 12 }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: '0.75rem', padding: '0.875rem', background: 'var(--adm-accent-subtle)', borderRadius: 'var(--adm-radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--adm-accent)' }}>Estimated Investment</span>
                    <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--adm-accent)' }}>{fmt(final)}</span>
                  </div>
                </div>
              )
            })()}
          </div>

          <div className="admin-card">
            <div className="admin-card-title">
              <span>Version History</span>
              <Info size={13} color="var(--adm-text-3)" />
            </div>
            {history.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--adm-text-3)', textAlign: 'center', padding: '1rem' }}>No saved versions yet</div>
            ) : history.map((h, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem 0', borderBottom: '1px solid var(--adm-border-subtle)', fontSize: 12 }}>
                <div>
                  <div style={{ color: 'var(--adm-text-1)', fontWeight: 500 }}>Saved {fmtDate(h.timestamp)}</div>
                  <div style={{ color: 'var(--adm-text-3)' }}>Fuel: ₦{h.config.fuelPricePerLitre.toLocaleString()}</div>
                </div>
                <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setConfig({ ...h.config })}>Restore</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
