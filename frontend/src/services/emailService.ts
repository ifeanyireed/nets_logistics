// ============================================================================
// NETS Enterprise Lead Management — Email Service
// ============================================================================
// Dispatches transactional and notification emails via the PHP Email Proxy API
// hosted on mail.neweratransports.com (bypassing cloud SMTP restrictions).
// ============================================================================

import { EMAIL_PROXY_URL, EMAIL_PROXY_KEY } from '../config/api'

class EmailService {
  /**
   * Send a branded confirmation email to the customer.
   */
  public async sendConfirmationEmail(payload: any): Promise<boolean> {
    const customerEmail = payload.customerInformation?.email
    const customerName = payload.customerInformation?.name || 'Valued Customer'
    const quoteRef = payload.leadMetadata?.quoteReferenceNumber || 'NETS-QUOTE'
    const journeyType = payload.journeyInformation?.journeyType || 'Charter Journey'
    const estimate = payload.estimatedInvestment?.total ? `₦${Math.round(payload.estimatedInvestment.total).toLocaleString('en-NG')}` : '₦---,---'

    if (!customerEmail) {
      console.warn('⚠️ [EMAIL SERVICE] Customer email missing, skipping dispatch.')
      return false
    }

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #0A3041; margin: 0; font-size: 24px;">NEW ERA TRANSPORT SERVICES</h1>
          <p style="color: #C40000; font-weight: 700; text-transform: uppercase; margin: 4px 0 0 0; font-size: 12px; letter-spacing: 0.1em;">Enterprise Logistics & Charters</p>
        </div>
        <h2 style="color: #0A3041; font-size: 18px;">Thank You, ${customerName}!</h2>
        <p style="color: #475569; line-height: 1.6;">We have received your journey quote request. A transport specialist has been assigned to your itinerary.</p>
        <div style="background: #F8FAFC; border-left: 4px solid #C40000; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Quote Reference:</strong> <code style="color: #C40000;">${quoteRef}</code></p>
          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Service Type:</strong> ${journeyType}</p>
          <p style="margin: 0; font-size: 14px;"><strong>Estimated Investment:</strong> <span style="font-size: 16px; font-weight: 700; color: #0A3041;">${estimate}</span></p>
        </div>
        <p style="color: #475569; font-size: 13px; line-height: 1.5;">If you have any urgent requests, please contact our dispatch team at <a href="mailto:info@neweratransports.com" style="color: #C40000;">info@neweratransports.com</a> or call <strong>+234 916 791 9439</strong>.</p>
        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
          &copy; ${new Date().getFullYear()} New Era Transport Services Ltd. All rights reserved.
        </div>
      </div>
    `

    try {
      const res = await fetch(EMAIL_PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${EMAIL_PROXY_KEY}`,
          'X-API-Key': EMAIL_PROXY_KEY,
        },
        body: JSON.stringify({
          to: customerEmail,
          subject: `Your Journey Quotation Request [${quoteRef}] — NETS`,
          html: htmlBody,
          text: `Thank you ${customerName}. We have received your journey quote request ${quoteRef}. Estimated Investment: ${estimate}.`,
          from: 'info@neweratransports.com',
          from_name: 'NETS Logistics',
        }),
      })

      if (res.ok) {
        console.log(`✅ [EMAIL SERVICE] Customer confirmation sent to ${customerEmail}`)
        return true
      }
    } catch (err) {
      console.warn('⚠️ [EMAIL SERVICE] Could not dispatch via email proxy:', err)
    }

    return true
  }

  /**
   * Send an immediate internal notification to the Sales / Operations Team (Supo & Social Media).
   */
  public async sendInternalNotification(payload: any): Promise<boolean> {
    const customerName = payload.customerInformation?.name || 'New Client'
    const customerEmail = payload.customerInformation?.email || 'N/A'
    const customerPhone = payload.customerInformation?.phone || 'N/A'
    const quoteRef = payload.leadMetadata?.quoteReferenceNumber || 'NETS-LEAD'
    const journeyType = payload.journeyInformation?.journeyType || 'Standard Charter'
    const estimate = payload.estimatedInvestment?.total ? `₦${Math.round(payload.estimatedInvestment.total).toLocaleString('en-NG')}` : '₦---,---'

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #cbd5e1; border-radius: 6px;">
        <h2 style="color: #C40000; margin-top: 0;">🚨 New Lead / Quote Request Captured</h2>
        <p>A customer has requested a journey estimate on the website:</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 16px 0;">
          <tr><td style="padding: 6px; border-bottom: 1px solid #e2e8f0; font-weight: bold; width: 140px;">Reference:</td><td style="padding: 6px; border-bottom: 1px solid #e2e8f0;">${quoteRef}</td></tr>
          <tr><td style="padding: 6px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Client Name:</td><td style="padding: 6px; border-bottom: 1px solid #e2e8f0;">${customerName}</td></tr>
          <tr><td style="padding: 6px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Client Email:</td><td style="padding: 6px; border-bottom: 1px solid #e2e8f0;">${customerEmail}</td></tr>
          <tr><td style="padding: 6px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Client Phone:</td><td style="padding: 6px; border-bottom: 1px solid #e2e8f0;">${customerPhone}</td></tr>
          <tr><td style="padding: 6px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Journey Type:</td><td style="padding: 6px; border-bottom: 1px solid #e2e8f0;">${journeyType}</td></tr>
          <tr><td style="padding: 6px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Estimated Value:</td><td style="padding: 6px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #0A3041;">${estimate}</td></tr>
        </table>
        <p style="font-size: 12px; color: #64748b;">View and manage this lead in the <a href="https://neweratransports.com/admin/crm" style="color: #C40000;">NETS CRM Control Center</a>.</p>
      </div>
    `

    const notifyRecipients = ['socialmedia@neweratransports.com', 'supo89@hotmail.com', 'olateju.daniel@neweratransports.com']

    for (const recipient of notifyRecipients) {
      try {
        await fetch(EMAIL_PROXY_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${EMAIL_PROXY_KEY}`,
            'X-API-Key': EMAIL_PROXY_KEY,
          },
          body: JSON.stringify({
            to: recipient,
            subject: `[NEW LEAD] ${customerName} — ${quoteRef}`,
            html: htmlBody,
            text: `New Lead: ${customerName} (${customerEmail}, ${customerPhone}). Ref: ${quoteRef}. Estimate: ${estimate}.`,
            from: 'info@neweratransports.com',
            from_name: 'NETS CRM Alert',
          }),
        })
      } catch (err) {
        console.warn(`⚠️ [EMAIL SERVICE] Alert proxy error for ${recipient}:`, err)
      }
    }

    return true
  }

  /**
   * Send an instant new order / booking notification to Supo and Social Media.
   */
  public async sendNewBookingNotification(booking: any): Promise<boolean> {
    const bookingRef = booking.reference || booking.id || `BK-${Date.now()}`
    const customerName = booking.customerName || booking.customerInformation?.name || 'Customer'
    const customerEmail = booking.customerEmail || booking.customerInformation?.email || 'N/A'
    const customerPhone = booking.customerPhone || booking.customerInformation?.phone || 'N/A'
    const vehicle = booking.vehicleName || booking.estimatedInvestment?.vehicleName || 'Standard Vehicle'
    const pickup = booking.pickup || booking.journeyInformation?.pickup?.address || 'N/A'
    const destination = booking.destination || booking.journeyInformation?.destination?.address || 'N/A'
    const travelDate = booking.travelDate || booking.journeyInformation?.travelDate || new Date().toISOString()
    const amount = booking.totalAmount || booking.estimatedInvestment?.total || 0
    const paymentStatus = booking.paymentStatus || booking.paymentInformation?.status || 'Confirmed'

    const fmtAmount = `₦${Math.round(amount).toLocaleString('en-NG')}`
    const fmtDate = new Date(travelDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 24px; border: 1px solid #cbd5e1; border-radius: 8px; background: #ffffff;">
        <div style="background: #0A3041; padding: 16px; border-radius: 6px 6px 0 0; text-align: center; color: #ffffff;">
          <h2 style="margin: 0; font-size: 20px; letter-spacing: 0.05em;">🚗 NEW BOOKING ORDER RECEIVED</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #f87171; text-transform: uppercase; font-weight: bold;">Immediate Dispatch Notification</p>
        </div>
        <div style="padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 6px 6px;">
          <p style="font-size: 15px; color: #0F172A; margin-top: 0;">A new booking order has been confirmed on the platform:</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 16px 0;">
            <tr style="background: #f8fafc;"><td style="padding: 8px; font-weight: bold; width: 140px; border-bottom: 1px solid #e2e8f0;">Booking Ref:</td><td style="padding: 8px; font-family: monospace; color: #C40000; font-weight: bold; border-bottom: 1px solid #e2e8f0;">${bookingRef}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Customer:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${customerName} (${customerPhone})</td></tr>
            <tr style="background: #f8fafc;"><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${customerEmail}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Vehicle Assigned:</td><td style="padding: 8px; font-weight: bold; color: #0A3041; border-bottom: 1px solid #e2e8f0;">${vehicle}</td></tr>
            <tr style="background: #f8fafc;"><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Pickup:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${pickup}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Destination:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${destination}</td></tr>
            <tr style="background: #f8fafc;"><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Travel Date:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${fmtDate}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Total Paid:</td><td style="padding: 8px; font-size: 16px; font-weight: bold; color: #16a34a; border-bottom: 1px solid #e2e8f0;">${fmtAmount}</td></tr>
            <tr style="background: #f8fafc;"><td style="padding: 8px; font-weight: bold;">Status:</td><td style="padding: 8px; font-weight: bold; color: #16a34a; text-transform: uppercase;">${paymentStatus}</td></tr>
          </table>
          <div style="margin-top: 20px; text-align: center;">
            <a href="https://neweratransports.com/admin/bookings" style="display: inline-block; background: #C40000; color: #ffffff; padding: 10px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px;">Open Bookings Manager</a>
          </div>
        </div>
      </div>
    `

    // Target recipients: Supo & Social Media Team (+ Daniel)
    const bookingRecipients = [
      'supo89@hotmail.com',
      'socialmedia@neweratransports.com',
      'olateju.daniel@neweratransports.com',
    ]

    for (const recipient of bookingRecipients) {
      try {
        await fetch(EMAIL_PROXY_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${EMAIL_PROXY_KEY}`,
            'X-API-Key': EMAIL_PROXY_KEY,
          },
          body: JSON.stringify({
            to: recipient,
            subject: `🚘 [NEW ORDER] ${bookingRef} — ${customerName} (${fmtAmount})`,
            html: htmlBody,
            text: `New Booking Order ${bookingRef} by ${customerName}. Vehicle: ${vehicle}. Route: ${pickup} to ${destination}. Total: ${fmtAmount}.`,
            from: 'info@neweratransports.com',
            from_name: 'NETS Booking Alert',
          }),
        })
        console.log(`✅ [EMAIL SERVICE] Booking notification dispatched to ${recipient}`)
      } catch (err) {
        console.warn(`⚠️ [EMAIL SERVICE] Booking notification failed for ${recipient}:`, err)
      }
    }

    return true
  }

  /**
   * Send a password reset email with 6-digit security code.
   */
  public async sendPasswordResetEmail(email: string, resetCode: string, resetLink: string): Promise<boolean> {
    const cleanEmail = email.trim()

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #0A3041; margin: 0; font-size: 22px;">NEW ERA TRANSPORT SERVICES</h1>
          <p style="color: #C40000; font-weight: 700; text-transform: uppercase; margin: 4px 0 0 0; font-size: 11px; letter-spacing: 0.1em;">Control Center Security</p>
        </div>
        <h2 style="color: #0A3041; font-size: 17px;">Password Reset Request</h2>
        <p style="color: #475569; line-height: 1.5; font-size: 14px;">We received a request to reset your password for the NETS Admin & Staff portal. Use the verification code below to complete your password reset:</p>
        
        <div style="text-align: center; margin: 28px 0;">
          <div style="display: inline-block; background: #F1F5F9; border: 2px dashed #C40000; padding: 14px 32px; border-radius: 8px; font-size: 32px; font-weight: 800; letter-spacing: 0.25em; color: #0A3041; font-family: monospace;">
            ${resetCode}
          </div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 8px;">This code is valid for 15 minutes.</p>
        </div>

        <p style="color: #475569; font-size: 13px; line-height: 1.5;">If you did not request this password reset, please ignore this message or contact your system administrator immediately.</p>
        
        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
          &copy; ${new Date().getFullYear()} New Era Transport Services Ltd.
        </div>
      </div>
    `

    try {
      const res = await fetch(EMAIL_PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${EMAIL_PROXY_KEY}`,
          'X-API-Key': EMAIL_PROXY_KEY,
        },
        body: JSON.stringify({
          to: cleanEmail,
          subject: `Your NETS Portal Password Reset Code: ${resetCode}`,
          html: htmlBody,
          text: `Your password reset code for NETS Control Center is: ${resetCode}. Valid for 15 minutes.`,
          from: 'info@neweratransports.com',
          from_name: 'NETS Security',
        }),
      })

      if (res.ok) {
        console.log(`✅ [EMAIL SERVICE] Password reset email sent to ${cleanEmail}`)
        return true
      }
    } catch (err) {
      console.warn('⚠️ [EMAIL SERVICE] Password reset email proxy error:', err)
    }

    return true
  }
}

export const emailService = new EmailService()
