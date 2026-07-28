import { useJourneyStore } from '../store/useJourneyStore'
import { PlannerLayout } from '../components/planner/PlannerLayout'
import { Step1Locations } from '../components/planner/new_steps/Step1Locations'
import { Step2Details } from '../components/planner/new_steps/Step2Details'
import { Step3Review } from '../components/planner/new_steps/Step3Review'
import { AnimatePresence, motion } from 'framer-motion'
import { usePaystackPayment } from 'react-paystack'

export function JourneyPlannerPage() {
  const state = useJourneyStore()
  const { currentStep, nextStep, prevStep } = state

  const isStep1Complete = state.pickup && state.destination
  const isStep2Complete = state.passengers && state.travelDate && state.departureTime && state.selectedVehicleId && state.additionalVehicleIds.every(id => id !== '') && (state.tripType === 'Recurring' ? state.multiDayItinerary.every(d => d.date) : true)

  const isComplete = currentStep === 1 ? isStep1Complete : currentStep === 2 ? isStep2Complete : true

  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email: state.customerDetails?.email || 'customer@nets.com.ng',
    amount: (state.estimatedInvestment?.estimatedInvestment || 0) * 100, // Amount is in Kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_1573581f39d4a4aa7486dc09a13d91856f085063',
  }

  const initializePayment = usePaystackPayment(paystackConfig)

  const handlePay = () => {
    if (!state.estimatedInvestment?.estimatedInvestment) {
      alert('Cannot process payment: estimated investment is missing.')
      return
    }

    initializePayment({
      onSuccess: (reference: any) => {
        console.log(reference)
        alert('Payment Successful! Reference: ' + reference.reference)
      },
      onClose: () => {
        console.log('Payment modal closed')
      }
    })
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Locations />
      case 2: return <Step2Details />
      case 3: return <Step3Review />
      default: return <Step1Locations />
    }
  }

  return (
    <>
      <PlannerLayout>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </PlannerLayout>

      {/* Floating Action Buttons */}
        <div style={{ 
          position: 'fixed',
          bottom: '2rem',
          left: '2rem',
          right: '2rem',
          background: 'transparent',
          display: 'flex', 
          justifyContent: currentStep === 1 ? 'flex-end' : 'space-between',
          pointerEvents: 'none', // so users can click map through the empty space
          zIndex: 9999
        }}>
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="btn btn-outline shadow-lg"
              style={{ padding: '0.75rem 2rem', border: '1px solid var(--color-nets-border)', background: '#fff', pointerEvents: 'auto', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
            >
              Back
            </button>
          )}

          <button
            onClick={currentStep === 3 ? handlePay : nextStep}
            disabled={!isComplete}
            className="btn btn-red btn-lg shadow-lg"
            style={{ 
              padding: '0.75rem 3rem', 
              opacity: isComplete ? 1 : 0.5, 
              cursor: isComplete ? 'pointer' : 'not-allowed', 
              border: 'none', 
              pointerEvents: 'auto', 
              boxShadow: '0 8px 16px rgba(192,39,45,0.2)' 
            }}
          >
            {currentStep === 1 ? 'Next Step' : currentStep === 2 ? 'Review & Pay' : 'Pay Now'}
          </button>
        </div>
    </>
  )
}
