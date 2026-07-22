import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Users, Briefcase, Wind } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useJourneyStore } from '../../../store/useJourneyStore'
import { vehicles } from '../../../data/vehicles'
import { fadeUp, staggerContainer } from '../../../lib/motion'

export function Step7Recommendation() {
  const { passengers, recommendedVehicleId, setRecommendedVehicleId, nextStep, prevStep } = useJourneyStore()

  useEffect(() => {
    // Simple logic to recommend a vehicle based on passenger range
    let recommended = vehicles.find(v => v.id === 'hiace') // Default
    
    switch (passengers) {
      case '1-4': recommended = vehicles.find(v => v.id === 'sedan') || recommended; break
      case '5-14': recommended = vehicles.find(v => v.id === 'hiace') || recommended; break
      case '15-30': recommended = vehicles.find(v => v.id === 'coaster') || recommended; break
      case '31-60': recommended = vehicles.find(v => v.id === 'coach-50') || recommended; break
      case '60+': recommended = vehicles.find(v => v.id === 'coach-50') || recommended; break // Might need multiple
    }

    if (recommended && recommended.id !== recommendedVehicleId) {
      setRecommendedVehicleId(recommended.id)
    }
  }, [passengers, recommendedVehicleId, setRecommendedVehicleId])

  const vehicle = vehicles.find(v => v.id === recommendedVehicleId)

  if (!vehicle) return null

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      <div style={{ flex: 1 }}>
        <motion.h2 variants={fadeUp} style={{ fontSize: '2rem', fontWeight: 300, color: 'var(--color-nets-navy-dark)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
          Our Recommendation
        </motion.h2>
        <motion.p variants={fadeUp} style={{ fontSize: '1rem', color: 'var(--color-nets-text-2)', marginBottom: '2.5rem' }}>
          Based on your requirements, this is the optimal vehicle for your journey.
        </motion.p>

        <motion.div variants={fadeUp} style={{ background: '#fff', border: '1px solid var(--color-nets-border)', overflow: 'hidden' }}>
          {/* Image */}
          <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: 'var(--color-nets-light)' }}>
            <img src={vehicle.imageUrl} alt={vehicle.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--color-nets-red)', color: '#fff', padding: '0.25rem 0.75rem', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              Recommended Match
            </div>
          </div>

          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-nets-navy)', marginBottom: '0.5rem' }}>
                  {vehicle.category}
                </div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 300, color: 'var(--color-nets-navy-dark)', lineHeight: 1.2 }}>
                  {vehicle.name}
                </h3>
              </div>
              <Link to={`/fleet/${vehicle.slug}`} target="_blank" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-nets-red)', textDecoration: 'none' }}>
                View Full Specs
              </Link>
            </div>

            {/* Editorial */}
            <p style={{ fontSize: '0.9375rem', color: 'var(--color-nets-text-2)', lineHeight: 1.6, marginBottom: '2rem' }}>
              {vehicle.editorialStory}
            </p>

            {/* Specs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-nets-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Users size={20} color="var(--color-nets-red)" />
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--color-nets-text-3)' }}>Capacity</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-nets-navy-dark)' }}>{vehicle.capacity} Passengers</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck size={20} color="var(--color-nets-red)" />
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--color-nets-text-3)' }}>Comfort</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-nets-navy-dark)' }}>{vehicle.comfortRating || 'Standard'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Briefcase size={20} color="var(--color-nets-red)" />
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--color-nets-text-3)' }}>Luggage</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-nets-navy-dark)' }}>{vehicle.luggageSpace?.split(' ')[0] || 'Standard'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Wind size={20} color="var(--color-nets-red)" />
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--color-nets-text-3)' }}>Climate</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-nets-navy-dark)' }}>{vehicle.airConditioning || 'A/C'}</div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--color-nets-border)' }}>
        <button
          onClick={prevStep}
          style={{ background: 'transparent', border: 'none', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-nets-text-2)', cursor: 'pointer' }}
        >
          Back
        </button>
        <button
          onClick={nextStep}
          className="btn btn-navy"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          Continue <ArrowRight size={16} />
        </button>
      </motion.div>

    </motion.div>
  )
}
