import { Calendar, Share2 } from 'lucide-react'
import type { ShuttleBooking } from '../../types/shuttle'

interface QRCodeDisplayProps {
  booking: ShuttleBooking
}

export function QRCodeDisplay({ booking }: QRCodeDisplayProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `NETS Shuttle Pass: ${booking.bookingRef}`,
          text: `My shuttle booking from ${booking.origin} to ${booking.destination} on ${booking.travelDate} at ${booking.departureTime}. Booking Ref: ${booking.bookingRef}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Share dismissed')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Booking link copied to clipboard!')
    }
  }

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`NETS Shuttle: ${booking.routeName}`)
    const details = encodeURIComponent(`Boarding at ${booking.pickupStop.name}. Booking Ref: ${booking.bookingRef}`)
    const location = encodeURIComponent(booking.pickupStop.address)
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`
    window.open(googleCalendarUrl, '_blank')
  }

  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--color-nets-border)',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
    }}>
      {/* Boarding Pass Header */}
      <div style={{
        background: 'var(--color-nets-navy-dark)',
        color: '#fff',
        padding: '1.5rem',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-nets-red)', fontWeight: 700 }}>
            BOARDING PASS • CONFIRMED
          </span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem' }}>
            {booking.bookingRef}
          </h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Seat Count</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4ade80' }}>
            {booking.seatCount} {booking.seatCount === 1 ? 'Seat' : 'Seats'}
          </div>
        </div>
      </div>

      {/* Main Ticket Content */}
      <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* QR Code and Instructions */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
          <img 
            src={booking.qrCodeUrl} 
            alt={`QR Code for ${booking.bookingRef}`}
            style={{ width: '180px', height: '180px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '1rem', maxWidth: '300px' }}>
            Show this QR code to the shuttle driver or conductor at boarding for instant check-in.
          </p>
        </div>

        {/* Journey Details */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', background: '#f1f5f9', padding: '1.25rem', borderRadius: '8px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Passenger Name</span>
            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0f172a' }}>{booking.passengerName}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Travel Date</span>
            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0f172a' }}>{booking.travelDate}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Pickup Stop</span>
            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0f172a' }}>{booking.pickupStop.name}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Drop-off Stop</span>
            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0f172a' }}>{booking.dropoffStop.name}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Departure Time</span>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-nets-red)' }}>{booking.departureTime}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Est. Arrival</span>
            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0f172a' }}>{booking.arrivalTime}</div>
          </div>
        </div>

        {/* Vehicle & Driver Details */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Vehicle & Driver</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{booking.vehicleType}</div>
            <div style={{ fontSize: '0.8125rem', color: '#475569' }}>Driver: {booking.driverName} ({booking.vehiclePlate})</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Paid</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-nets-navy)' }}>₦{booking.totalFare.toLocaleString()}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button
            onClick={handleAddToCalendar}
            className="btn btn-outline"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Calendar size={16} />
            <span>Add to Calendar</span>
          </button>
          <button
            onClick={handleShare}
            className="btn btn-red"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Share2 size={16} />
            <span>Share Trip Pass</span>
          </button>
        </div>

      </div>
    </div>
  )
}
