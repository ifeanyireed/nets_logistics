import { motion } from 'framer-motion'
import { useJourneyStore } from '@/store/useJourneyStore'
import { MapboxAutocomplete } from '../MapboxAutocomplete'

export function Step1Locations() {
  const { pickup, setPickup, destination, setDestination, intent, setIntent, nextStep } = useJourneyStore()

  const isComplete = pickup && destination

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 600, color: 'var(--color-nets-navy-dark)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Where are you heading?
        </h1>
        <p style={{ color: 'var(--color-nets-text-2)' }}>
          Enter your pickup and drop-off locations to get started.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-nets-navy-dark)' }}>
            Purpose
          </label>
          <select 
            value={intent || ''}
            onChange={(e) => setIntent(e.target.value as any)}
            className="input"
            style={{ width: '100%', padding: '0.75rem 1rem', cursor: 'pointer', appearance: 'none', background: '#fff url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E") no-repeat right 1rem center / 10px 10px' }}
          >
            <option value="" disabled>Select Purpose</option>
            <option value="General Transport">General Transport</option>
            <option value="Corporate Staff">Corporate Staff</option>
            <option value="Airport Transfer">Airport Transfer</option>
            <option value="Weddings & Events">Weddings & Events</option>
            <option value="School Transport">School Transport</option>
            <option value="Religious Groups">Religious Groups</option>
            <option value="Conferences">Conferences</option>
            <option value="Tourism">Tourism</option>
            <option value="Private Group">Private Group</option>
            <option value="Recurring Shuttle">Recurring Shuttle</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-nets-navy-dark)' }}>
            Pickup Location
          </label>
          <MapboxAutocomplete
            value={pickup?.address || null}
            onChange={() => {}}
            onLocationSelect={setPickup}
            placeholder="e.g. Murtala Muhammed Airport, Lagos"
            className="input"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-nets-navy-dark)' }}>
            Destination
          </label>
          <MapboxAutocomplete
            value={destination?.address || null}
            onChange={() => {}}
            onLocationSelect={setDestination}
            placeholder="e.g. Transcorp Hilton, Abuja"
            className="input"
          />
        </div>
      </div>

    </div>
  )
}
