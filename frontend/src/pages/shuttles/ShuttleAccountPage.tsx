import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ListOrdered, Star, Users, CreditCard, Radio, Plus, ArrowRight } from 'lucide-react'
import { useShuttleStore } from '../../store/useShuttleStore'

export function ShuttleAccountPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'bookings' | 'favorites' | 'passengers' | 'wallet'>('bookings')
  const { 
    bookings, routes, favoriteRouteIds, toggleFavoriteRoute,
    savedPassengers, addSavedPassenger, removeSavedPassenger,
    walletBalance, walletTransactions, topUpWallet, setSelectedRoute 
  } = useShuttleStore()

  // New Passenger Form state
  const [newPaxName, setNewPaxName] = useState('')
  const [newPaxEmail, setNewPaxEmail] = useState('')
  const [newPaxPhone, setNewPaxPhone] = useState('')
  const [newPaxRel, setNewPaxRel] = useState('Family Member')

  // Topup amount
  const [topupAmt, setTopupAmt] = useState(10000)

  const handleAddPassenger = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPaxName || !newPaxPhone) return
    addSavedPassenger({
      fullName: newPaxName,
      email: newPaxEmail || 'pax@nets.ng',
      phone: newPaxPhone,
      relationship: newPaxRel
    })
    setNewPaxName('')
    setNewPaxEmail('')
    setNewPaxPhone('')
  }

  const favoriteRoutes = routes.filter(r => favoriteRouteIds.includes(r.id))

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* Header Banner - Full Bleed Navy Dark */}
      <section style={{ background: 'var(--color-nets-navy-dark)', color: '#fff', paddingTop: '7.5rem', paddingBottom: '3.5rem', borderBottom: '4px solid var(--color-nets-red)' }}>
        <div className="container-nets">
          <span style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-nets-red)', fontWeight: 700 }}>
            HELPFUL EXTRAS & DASHBOARD
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, marginTop: '0.25rem' }}>
            My Shuttle Hub
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem' }}>
            Manage your active passes, favorite routes, saved passengers, and wallet balance.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container-nets" style={{ padding: '2.5rem 0 5rem' }}>
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #cbd5e1', marginBottom: '2.5rem', overflowX: 'auto' }}>
          {[
            { id: 'bookings', label: `My Shuttle Bookings (${bookings.length})`, icon: ListOrdered },
            { id: 'favorites', label: `Favorite Routes (${favoriteRoutes.length})`, icon: Star },
            { id: 'passengers', label: `Saved Passengers (${savedPassengers.length})`, icon: Users },
            { id: 'wallet', label: `Wallet & Payment History (₦${walletBalance.toLocaleString()})`, icon: CreditCard },
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '0.875rem 1.25rem',
                  fontSize: '0.9375rem',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  color: activeTab === tab.id ? 'var(--color-nets-red)' : '#475569',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '3px solid var(--color-nets-red)' : '3px solid transparent',
                  background: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab 1: My Bookings */}
        {activeTab === 'bookings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {bookings.length > 0 ? (
              bookings.map(b => (
                <div key={b.id} style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', background: b.status === 'confirmed' ? '#d1fae5' : '#e2e8f0', color: b.status === 'confirmed' ? '#065f46' : '#334155' }}>
                        {b.status.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-nets-navy)' }}>
                        {b.bookingRef}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginTop: '0.5rem' }}>
                      {b.routeName}
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '4px' }}>
                      Pickup: <strong>{b.pickupStop.name}</strong> ➔ Drop-off: <strong>{b.dropoffStop.name}</strong>
                    </p>
                    <p style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '2px' }}>
                      Date: {b.travelDate} • Time: {b.departureTime} • Seats: {b.seatCount}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <button
                      onClick={() => navigate(`/shuttles/confirmation/${b.id}`)}
                      className="btn btn-outline"
                      style={{ fontSize: '0.8125rem' }}
                    >
                      View QR Pass
                    </button>

                    <button
                      onClick={() => navigate(`/shuttles/live/${b.id}`)}
                      className="btn btn-red"
                      style={{ fontSize: '0.8125rem', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Radio size={14} />
                      <span>Live GPS</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '3rem', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <p>No active shuttle bookings.</p>
                <Link to="/shuttles" className="btn btn-red" style={{ marginTop: '1rem' }}>Book a Shuttle Now</Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Favorite Routes */}
        {activeTab === 'favorites' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {favoriteRoutes.length > 0 ? (
              favoriteRoutes.map(r => (
                <div key={r.id} style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-nets-red)' }}>{r.code}</span>
                    <button onClick={() => toggleFavoriteRoute(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem' }}>
                      <Star size={14} fill="#ef4444" />
                      <span>Favorite</span>
                    </button>
                  </div>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-nets-navy)' }}>{r.name}</h3>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.5rem 0 1rem' }}>Fare: ₦{r.startingFare.toLocaleString()} • Frequency: {r.frequency}</p>
                  <button
                    onClick={() => {
                      setSelectedRoute(r)
                      navigate('/shuttles/stops')
                    }}
                    className="btn btn-red btn-sm"
                    style={{ width: '100%', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <span>Quick Book</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ))
            ) : (
              <div style={{ padding: '3rem', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <p>No favorite routes saved yet. Click the star icon on any route card to save it here.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Saved Passengers */}
        {activeTab === 'passengers' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
            
            {/* List */}
            <div className="col-span-12 lg:col-span-7" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {savedPassengers.map(pax => (
                <div key={pax.id} style={{ background: '#fff', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{pax.fullName}</h4>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-nets-red)', background: '#fee2e2', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                        {pax.relationship}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '2px' }}>
                      {pax.phone} • {pax.email}
                    </p>
                  </div>
                  {pax.relationship !== 'Self' && (
                    <button onClick={() => removeSavedPassenger(pax.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8125rem', cursor: 'pointer' }}>
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Form */}
            <div className="col-span-12 lg:col-span-5" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-nets-navy)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} />
                <span>Save New Passenger Profile</span>
              </h3>
              <form onSubmit={handleAddPassenger} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Full Name</label>
                  <input type="text" required value={newPaxName} onChange={e => setNewPaxName(e.target.value)} placeholder="e.g. Babatunde Johnson" style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Phone Number</label>
                  <input type="tel" required value={newPaxPhone} onChange={e => setNewPaxPhone(e.target.value)} placeholder="+234 800 000 0000" style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Email</label>
                  <input type="email" value={newPaxEmail} onChange={e => setNewPaxEmail(e.target.value)} placeholder="email@example.com" style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Relationship</label>
                  <select value={newPaxRel} onChange={e => setNewPaxRel(e.target.value)} style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    <option value="Family Member">Family Member</option>
                    <option value="Colleague">Colleague / Staff</option>
                    <option value="Friend">Friend</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-navy" style={{ width: '100%', justifyContent: 'center' }}>
                  Save Passenger
                </button>
              </form>
            </div>

          </div>
        )}

        {/* Tab 4: Wallet & Payment History */}
        {activeTab === 'wallet' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
            
            {/* Wallet Balance Card */}
            <div className="col-span-12 lg:col-span-5" style={{ background: 'linear-gradient(135deg, var(--color-nets-navy-dark) 0%, var(--color-nets-navy) 100%)', color: '#fff', padding: '2rem', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)' }}>
                NETS DIGITAL WALLET
              </span>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.5rem 0 1.5rem', color: '#4ade80' }}>
                ₦{walletBalance.toLocaleString()}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '0.5rem' }}>
                  Top-up Amount (₦)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[5000, 10000, 25000].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setTopupAmt(amt)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        borderRadius: '4px',
                        border: topupAmt === amt ? '1px solid #4ade80' : '1px solid rgba(255,255,255,0.2)',
                        background: topupAmt === amt ? 'rgba(74,222,128,0.2)' : 'transparent',
                        color: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      ₦{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  topUpWallet(topupAmt)
                  alert(`Successfully topped up ₦${topupAmt.toLocaleString()} to your NETS Wallet!`)
                }}
                className="btn btn-red"
                style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', border: 'none' }}
              >
                + Top-up ₦{topupAmt.toLocaleString()} Now
              </button>
            </div>

            {/* Transaction Log */}
            <div className="col-span-12 lg:col-span-7" style={{ background: '#fff', padding: '1.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-nets-navy)', marginBottom: '1.25rem' }}>
                Wallet & Payment Transaction History
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {walletTransactions.map(tx => (
                  <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0f172a' }}>{tx.description}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{tx.timestamp}</div>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: tx.type === 'credit' ? '#10b981' : 'var(--color-nets-navy)' }}>
                      {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  )
}
