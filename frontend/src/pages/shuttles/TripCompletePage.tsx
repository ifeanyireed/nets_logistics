import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { CheckCircle, Download, RotateCcw, AlertTriangle, Star, ArrowRight } from 'lucide-react'
import { useShuttleStore } from '../../store/useShuttleStore'

export function TripCompletePage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const { 
    bookings, latestBooking, submitDriverRating,
    submitIssueReport, setSelectedRoute, routes 
  } = useShuttleStore()

  const booking = bookings.find(b => b.id === bookingId) || latestBooking

  const [rating, setRating] = useState(5)
  const [feedback, setFeedback] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [issueType, setIssueType] = useState('Late Arrival')
  const [issueDetails, setIssueDetails] = useState('')
  const [reportSuccess, setReportSuccess] = useState(false)

  if (!booking) {
    return (
      <div style={{ paddingTop: '100px', textAlign: 'center', minHeight: '80vh', padding: '4rem 1rem' }}>
        <h2>Trip Not Found</h2>
        <Link to="/shuttles" className="btn btn-red" style={{ marginTop: '1rem' }}>Back to Shuttles</Link>
      </div>
    )
  }

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitDriverRating(booking.id, rating, feedback)
    setIsSubmitted(true)
  }

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitIssueReport(booking.id, issueType, issueDetails)
    setReportSuccess(true)
    setTimeout(() => {
      setIsReportModalOpen(false)
      setReportSuccess(false)
    }, 1500)
  }

  const handleBookReturn = () => {
    const route = routes.find(r => r.id === booking.routeId) || routes[0]
    setSelectedRoute(route)
    navigate('/shuttles/stops')
  }

  const handleDownloadReceipt = () => {
    const text = `
NETS TRANSPORT LOGISTICS SERVICES
OFFICIAL SHUTTLE TRIP RECEIPT
-------------------------------------------
Booking Ref: ${booking.bookingRef}
Date: ${booking.travelDate}
Passenger: ${booking.passengerName}

Route: ${booking.origin} -> ${booking.destination}
Pickup Stop: ${booking.pickupStop.name}
Drop-off Stop: ${booking.dropoffStop.name}

Vehicle: ${booking.vehicleType}
Driver: ${booking.driverName}
Seats: ${booking.seatCount}

Base Fare: ₦${booking.baseFare.toLocaleString()}
Discount: ₦${booking.discount.toLocaleString()}
TOTAL PAID: ₦${booking.totalFare.toLocaleString()}
Payment Method: ${booking.paymentMethod.toUpperCase()}
Status: TRIP COMPLETED & SAFELY ARRIVED
-------------------------------------------
Thank you for riding with NETS Logistics!
Support: info@neweratransports.com
    `
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `NETS-Receipt-${booking.bookingRef}.txt`
    a.click()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* Header Banner - Full Bleed Navy Dark */}
      <section style={{ background: 'var(--color-nets-navy-dark)', color: '#fff', paddingTop: '7.5rem', paddingBottom: '3.5rem', textAlign: 'center', borderBottom: '4px solid var(--color-nets-red)' }}>
        <div className="container-nets">
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#10b981',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            margin: '0 auto 1rem'
          }}>
            <CheckCircle size={36} />
          </div>
          <span style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4ade80', fontWeight: 700 }}>
            YOU HAVE SAFELY ARRIVED AT YOUR DESTINATION
          </span>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, marginTop: '0.25rem' }}>
            Trip Completed Successfully!
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem' }}>
            Thank you for traveling with NETS Express Shuttles.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container-nets" style={{ padding: '3rem 0 5rem' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Quick Action Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <button
              onClick={handleDownloadReceipt}
              className="btn btn-outline"
              style={{ justifyContent: 'center', flexDirection: 'column', padding: '1rem', gap: '0.5rem', height: '100%' }}
            >
              <Download size={20} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>Download Receipt</span>
            </button>

            <button
              onClick={handleBookReturn}
              className="btn btn-red"
              style={{ justifyContent: 'center', flexDirection: 'column', padding: '1rem', gap: '0.5rem', height: '100%', border: 'none' }}
            >
              <RotateCcw size={20} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>Book Return Trip</span>
            </button>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="btn btn-outline-white"
              style={{ justifyContent: 'center', flexDirection: 'column', padding: '1rem', gap: '0.5rem', height: '100%', background: '#fff', color: '#991b1b', borderColor: '#fecaca' }}
            >
              <AlertTriangle size={20} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>Report an Issue</span>
            </button>
          </div>

          {/* Driver Rating Card */}
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-nets-navy)', marginBottom: '0.5rem' }}>
              How was your journey with {booking.driverName}?
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
              Your rating helps us maintain top driver standards across Nigeria.
            </p>

            {isSubmitted ? (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.25rem', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#166534' }}>
                  ✓ Thank you for your feedback! Rating Submitted.
                </span>
              </div>
            ) : (
              <form onSubmit={handleRatingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* 5 Stars Selector */}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '0.25rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Star
                        size={32}
                        fill={star <= rating ? '#f59e0b' : 'none'}
                        color={star <= rating ? '#f59e0b' : '#cbd5e1'}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  rows={3}
                  placeholder="Share details about punctuality, shuttle cleanliness, or driver courtesy..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.875rem'
                  }}
                />

                <button type="submit" className="btn btn-navy" style={{ width: '100%', justifyContent: 'center' }}>
                  Submit Driver Review
                </button>
              </form>
            )}
          </div>

          {/* Return Trip Highlight Card */}
          <div style={{ background: 'var(--color-nets-navy-dark)', color: '#fff', padding: '1.75rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-nets-red)', fontWeight: 700 }}>
                NEED A RETURN SHUTTLE?
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, marginTop: '0.25rem' }}>
                {booking.destination} ➔ {booking.origin}
              </div>
            </div>
            <button onClick={handleBookReturn} className="btn btn-red btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>Book Return Seat</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </main>

      {/* Report Issue Modal */}
      {isReportModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          padding: '1rem'
        }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', maxWidth: '480px', width: '100%' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-nets-navy)', marginBottom: '1rem' }}>
              Report an Issue
            </h3>

            {reportSuccess ? (
              <div style={{ background: '#f0fdf4', color: '#166534', padding: '1rem', borderRadius: '8px', fontWeight: 700 }}>
                ✓ Issue reported to NETS Support. We will contact you shortly!
              </div>
            ) : (
              <form onSubmit={handleIssueSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Issue Category</label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="Late Arrival">Late Arrival / Schedule Delay</option>
                    <option value="Lost Item">Lost Item Left on Shuttle</option>
                    <option value="Driver Behavior">Driver Behavior concern</option>
                    <option value="Overcharge">Billing or Overcharge issue</option>
                    <option value="Other">Other Service complaint</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Details</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe what happened..."
                    value={issueDetails}
                    onChange={(e) => setIssueDetails(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setIsReportModalOpen(false)} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-red" style={{ flex: 1, justifyContent: 'center', border: 'none' }}>
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
