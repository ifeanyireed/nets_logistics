// ============================================================================
// NETS Enterprise Lead Management — CRM Service & Local Persistence
// ============================================================================

import { API_URL } from '../config/api'

export interface CRMSubmissionResponse {
  success: boolean
  leadId?: string
  error?: string
}

class CRMService {
  /**
   * Submit a new lead/booking to the CRM and local storage persistence.
   */
  public async submitLead(payload: any): Promise<CRMSubmissionResponse> {
    const leadRef = payload.leadMetadata?.quoteReferenceNumber || `NETS-LD-${Date.now().toString().slice(-6)}`
    const bookingRef = payload.leadMetadata?.bookingReferenceNumber || `BK-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Date.now().toString().slice(-3)}`

    // Always persist locally first to guarantee dashboard & booking page update immediately
    try {
      if (typeof window !== 'undefined') {
        const localLeads = JSON.parse(localStorage.getItem('nets_local_leads') || '[]')
        const newLead = {
          id: Date.now(),
          leadReference: leadRef,
          customerName: payload.customerInformation?.name || 'Valued Customer',
          customerEmail: payload.customerInformation?.email || 'N/A',
          customerPhone: payload.customerInformation?.phone || 'N/A',
          company: payload.customerInformation?.company || 'N/A',
          journeyType: payload.journeyInformation?.journeyType || 'Standard Charter',
          origin: payload.journeyInformation?.pickup?.address || 'N/A',
          destination: payload.journeyInformation?.destination?.address || 'N/A',
          estimatedInvestmentMin: payload.estimatedInvestment?.total || 0,
          estimatedInvestmentMax: payload.estimatedInvestment?.total || 0,
          status: payload.paymentInformation?.status === 'paid' ? 'won' : 'new',
          createdAt: new Date().toISOString(),
          payload,
        }
        localStorage.setItem('nets_local_leads', JSON.stringify([newLead, ...localLeads]))

        // Create matching booking entry for booking page
        const localBookings = JSON.parse(localStorage.getItem('nets_local_bookings') || '[]')
        const newBooking = {
          id: `bk-${Date.now()}`,
          reference: bookingRef,
          quoteReference: leadRef,
          customerId: payload.customerInformation?.email || `cust-${Date.now()}`,
          customerName: payload.customerInformation?.name || 'Valued Customer',
          vehicleId: payload.estimatedInvestment?.vehicleSlug || 'exec-bus',
          vehicleName: payload.estimatedInvestment?.vehicleName || 'Executive Vehicle',
          driverId: null,
          driverName: null,
          pickup: payload.journeyInformation?.pickup?.address || 'N/A',
          destination: payload.journeyInformation?.destination?.address || 'N/A',
          distanceKm: payload.journeyInformation?.distanceKm || 0,
          durationMins: payload.journeyInformation?.durationMins || 0,
          tripType: payload.journeyInformation?.journeyType || 'Standard Charter',
          passengerCount: payload.journeyInformation?.passengerCount || 1,
          travelDate: payload.journeyInformation?.travelDate || new Date().toISOString(),
          totalAmount: payload.estimatedInvestment?.total || 0,
          paymentStatus: payload.paymentInformation?.status === 'paid' ? 'paid' : 'pending',
          operationalStatus: payload.paymentInformation?.status === 'paid' ? 'confirmed' : 'pending',
          notes: `Submitted via ${payload.leadMetadata?.leadSource || 'Website Journey Planner'}`,
          createdAt: new Date().toISOString(),
        }
        localStorage.setItem('nets_local_bookings', JSON.stringify([newBooking, ...localBookings]))
      }
    } catch (e) {
      console.warn('⚠️ [CRM SERVICE] Local storage write error:', e)
    }

    try {
      const response = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const json = await response.json()
        const leadData = json.data?.lead || json.data
        return {
          success: true,
          leadId: leadData?.leadId || leadData?.leadReference || leadRef,
        }
      }
    } catch (err) {
      console.warn('⚠️ [CRM SERVICE] Backend REST API unreachable, operating in persistent offline mode:', err)
    }

    return {
      success: true,
      leadId: leadRef
    }
  }

  /**
   * Fire an analytics event for business intelligence.
   */
  public trackEvent(eventName: string, eventData: any): void {
    console.log(`📊 [ANALYTICS] ${eventName}`, eventData)
  }
}

export const crmService = new CRMService()
