import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useShuttleStore } from '../../store/useShuttleStore'

export function TripDetailsPage() {
  const navigate = useNavigate()
  const { 
    selectedRoute, pickupStop, dropoffStop, selectedTrip,
    travelDate, seatCount, savedPassengers,
    selectedPassengerId, setSelectedPassengerId,
    customPassengerName, customPassengerPhone, customPassengerEmail,
    setCustomPassengerDetails, promoCode, promoDiscountRatio,
    promoError, applyPromoCode, clearPromoCode 
  } = useShuttleStore()

  const [inputCode, setInputCode] = useState('')

  if (!selectedRoute || !pickupStop || !dropoffStop || !selectedTrip) {
    return (
      <div style={{ paddingTop: '100px', textAlign: 'center', minHeight: '80vh', padding: '4rem 1rem' }}>
        <h2>Incomplete Booking Selection</h2>
        <Link to="/shuttles" className="btn btn-red" style={{ marginTop: '1rem' }}>Start Over</Link>
      </div>
    )
  }

  const baseTotal = selectedTrip.farePerSeat * seatCount
  const discountAmt = Math.round(baseTotal * promoDiscountRatio)
  const finalTotal = baseTotal - discountAmt

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault()
    applyPromoCode(inputCode)
  }

  const handleProceed = () => {
    navigate('/shuttles/payment')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* Header Banner - Full Bleed Navy Dark */}
      <section style={{ background: 'var(--color-nets-navy-dark)', color: '#fff', paddingTop: '7.5rem', paddingBottom: '3rem', borderBottom: '4px solid var(--color-nets-red)' }}>
        <div className="container-nets">
          <Link to="/shuttles/trips" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowLeft size={14} />
            <span>Back to Departure Times</span>
          </Link>
          <div className="overline-dark" style={{ marginTop: '0.75rem', marginBottom: '0.25rem' }}>
            Step 4 • Passenger Info & Promo Code
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800 }}>
            Trip & Passenger Details
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <main className="container-nets" style={{ padding: '2.5rem 0 5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2.5rem', alignItems: 'flex-start' }}>
          
          {/* Left Column — Route Summary & Passenger Selection */}
          <div className="col-span-12 lg:col-span-7" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            
            {/* Boarding Time & Route Summary */}
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-nets-red)', fontWeight: 700 }}>
                    SCHEDULED BOARDING
                  </span>
                  <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-nets-navy)', marginTop: '2px' }}>
                    {selectedTrip.departureTime} (Date: {travelDate})
                  </h3>
                </div>
                <div style={{ textAlign: 'right', background: '#f8fafc', padding: '0.5rem 1rem', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Seats Reserved</span>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-nets-navy)' }}>{seatCount} Seat(s)</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', marginTop: '6px' }} />
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Pickup Stop & Address</span>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>{pickupStop.name}</div>
                    <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{pickupStop.address}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-nets-red)', marginTop: '6px' }} />
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Drop-off Stop & Address</span>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>{dropoffStop.name}</div>
                    <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{dropoffStop.address}</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', background: '#f1f5f9', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span><strong>Vehicle:</strong> {selectedTrip.vehicleType} ({selectedTrip.vehiclePlate})</span>
                <span><strong>Driver:</strong> {selectedTrip.driverName}</span>
              </div>
            </div>

            {/* Passenger Selector */}
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-nets-navy)', marginBottom: '1.25rem' }}>
                Who is Traveling?
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.5rem' }}>
                {savedPassengers.map(pax => (
                  <label key={pax.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: selectedPassengerId === pax.id ? '2px solid var(--color-nets-navy)' : '1px solid #e2e8f0',
                    background: selectedPassengerId === pax.id ? 'rgba(13, 16, 96, 0.03)' : '#fff',
                    cursor: 'pointer'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input
                        type="radio"
                        name="paxSelect"
                        value={pax.id}
                        checked={selectedPassengerId === pax.id}
                        onChange={() => setSelectedPassengerId(pax.id)}
                      />
                      <div>
                        <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>{pax.fullName}</div>
                        <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{pax.phone} • {pax.email}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-nets-red)', background: '#fee2e2', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {pax.relationship}
                    </span>
                  </label>
                ))}

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: selectedPassengerId === 'custom' ? '2px solid var(--color-nets-navy)' : '1px solid #e2e8f0',
                  background: selectedPassengerId === 'custom' ? 'rgba(13, 16, 96, 0.03)' : '#fff',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="paxSelect"
                    value="custom"
                    checked={selectedPassengerId === 'custom'}
                    onChange={() => setSelectedPassengerId('custom')}
                  />
                  <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>
                    + Add New Passenger / Booking for Someone Else
                  </span>
                </label>
              </div>

              {selectedPassengerId === 'custom' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <div>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Toluwani Williams"
                      value={customPassengerName}
                      onChange={(e) => setCustomPassengerDetails({ name: e.target.value })}
                      style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+234 800 000 0000"
                        value={customPassengerPhone}
                        onChange={(e) => setCustomPassengerDetails({ phone: e.target.value })}
                        style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Email Address</label>
                      <input
                        type="email"
                        placeholder="passenger@example.com"
                        value={customPassengerEmail}
                        onChange={(e) => setCustomPassengerDetails({ email: e.target.value })}
                        style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Right Column — Promo Code & Price Summary */}
          <div className="col-span-12 lg:col-span-5" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Promo Code Box */}
            <div style={{ background: '#fff', padding: '1.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-nets-navy)', marginBottom: '1rem' }}>
                Promo Code
              </h3>

              {promoCode ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.875rem 1rem', borderRadius: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700, display: 'block' }}>PROMO APPLIED</span>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{promoCode} ({Math.round(promoDiscountRatio * 100)}% OFF)</span>
                  </div>
                  <button onClick={clearPromoCode} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 700, cursor: 'pointer' }}>
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCode} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Enter code (e.g. NETSFIRST)"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    style={{ flex: 1, padding: '0.625rem 0.875rem', borderRadius: '6px', border: '1px solid #cbd5e1', textTransform: 'uppercase' }}
                  />
                  <button type="submit" className="btn btn-navy" style={{ padding: '0.625rem 1rem' }}>
                    Apply
                  </button>
                </form>
              )}

              {promoError && (
                <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem', display: 'block' }}>
                  {promoError} (Try code: <strong>NETSFIRST</strong> or <strong>SHUTTLE2026</strong>)
                </span>
              )}
            </div>

            {/* Price Summary */}
            <div style={{ background: '#fff', padding: '1.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-nets-navy)', marginBottom: '1.25rem' }}>
                Payment Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem', color: '#475569' }}>
                  <span>Fare ({seatCount} seat x ₦{selectedTrip.farePerSeat.toLocaleString()})</span>
                  <span>₦{baseTotal.toLocaleString()}</span>
                </div>
                
                {discountAmt > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem', color: '#166534', fontWeight: 600 }}>
                    <span>Promo Discount ({promoCode})</span>
                    <span>-₦{discountAmt.toLocaleString()}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem', color: '#475569' }}>
                  <span>Service & Tech Fee</span>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>FREE</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Total Amount Payable</span>
                <span style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--color-nets-navy)' }}>
                  ₦{finalTotal.toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleProceed}
                className="btn btn-red btn-lg"
                style={{ width: '100%', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
              >
                Proceed to Payment →
              </button>
            </div>

          </div>

        </div>
      </main>

    </div>
  )
}
