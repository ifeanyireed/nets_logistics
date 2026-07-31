// ============================================================================
// NETS Enterprise Lead Management — PDF Service (jsPDF Implementation)
// ============================================================================
// Generates styled, professional PDF quotations with NETS branding.
// ============================================================================

import jsPDF from 'jspdf'

class PDFService {
  /**
   * Generates a styled PDF quotation document and triggers a browser download.
   */
  public generateQuotationPDF(payload: any): void {
    console.log('📄 [PDF SERVICE] Generating Styled Quotation PDF...')
    
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const ref = payload.leadMetadata?.quoteReferenceNumber || `NETS-${Date.now().toString().slice(-6)}`
      const customerName = payload.customerInformation?.name || 'Valued Customer'
      const customerEmail = payload.customerInformation?.email || 'N/A'
      const customerPhone = payload.customerInformation?.phone || 'N/A'
      const company = payload.customerInformation?.company || 'N/A'

      const journeyType = payload.journeyInformation?.journeyType || 'Standard Charter'
      const vehicle = payload.estimatedInvestment?.vehicleName || 'Standard Vehicle'
      const pickup = payload.journeyInformation?.pickup?.address || 'N/A'
      const destination = payload.journeyInformation?.destination?.address || 'N/A'
      const distance = payload.journeyInformation?.distanceKm ? `${payload.journeyInformation.distanceKm} km` : 'N/A'
      const passengers = payload.journeyInformation?.passengerCount || 'N/A'
      const travelDate = payload.journeyInformation?.travelDate 
        ? new Date(payload.journeyInformation.travelDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'N/A'

      const totalCost = payload.estimatedInvestment?.total 
        ? `₦${Math.round(payload.estimatedInvestment.total).toLocaleString('en-NG')}` 
        : '₦---,---'
      
      const paymentStatus = payload.paymentInformation?.status === 'paid' ? 'PAID & CONFIRMED' : 'QUOTATION ESTIMATE'
      const payRef = payload.paymentInformation?.paystackReference || 'N/A'

      // Header Band (NETS Navy Background)
      doc.setFillColor(13, 16, 96) // #0D1060
      doc.rect(0, 0, 210, 38, 'F')

      // Header Brand Text
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('NEW ERA TRANSPORT SERVICES', 14, 16)
      
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text('Official Charter & Logistics Quotation', 14, 23)
      doc.text('info@neweratransports.com | +234 916 791 9439', 14, 29)

      // Status Badge Top Right
      if (paymentStatus === 'PAID & CONFIRMED') {
        doc.setFillColor(34, 197, 94) // Green
      } else {
        doc.setFillColor(192, 39, 45) // NETS Red
      }
      doc.roundedRect(140, 10, 56, 14, 2, 2, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text(paymentStatus, 168, 18.5, { align: 'center' })

      // Reference & Date Info Section
      let y = 48
      doc.setTextColor(30, 41, 59)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('DOCUMENT DETAILS', 14, y)
      doc.setDrawColor(226, 232, 240)
      doc.line(14, y + 2, 196, y + 2)

      y += 10
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('Reference No:', 14, y)
      doc.setFont('helvetica', 'normal')
      doc.text(ref, 45, y)

      doc.setFont('helvetica', 'bold')
      doc.text('Date Issued:', 120, y)
      doc.setFont('helvetica', 'normal')
      doc.text(new Date().toLocaleDateString('en-NG'), 145, y)

      if (payRef !== 'N/A') {
        y += 6
        doc.setFont('helvetica', 'bold')
        doc.text('Payment Ref:', 14, y)
        doc.setFont('helvetica', 'normal')
        doc.text(payRef, 45, y)
      }

      // Customer Information Section
      y += 12
      doc.setFont('helvetica', 'bold')
      doc.text('CLIENT INFORMATION', 14, y)
      doc.line(14, y + 2, 196, y + 2)

      y += 10
      doc.setFont('helvetica', 'bold')
      doc.text('Full Name:', 14, y)
      doc.setFont('helvetica', 'normal')
      doc.text(customerName, 45, y)

      doc.setFont('helvetica', 'bold')
      doc.text('Email:', 120, y)
      doc.setFont('helvetica', 'normal')
      doc.text(customerEmail, 145, y)

      y += 6
      doc.setFont('helvetica', 'bold')
      doc.text('Company:', 14, y)
      doc.setFont('helvetica', 'normal')
      doc.text(company, 45, y)

      doc.setFont('helvetica', 'bold')
      doc.text('Phone:', 120, y)
      doc.setFont('helvetica', 'normal')
      doc.text(customerPhone, 145, y)

      // Journey Specifications Section
      y += 12
      doc.setFont('helvetica', 'bold')
      doc.text('JOURNEY SPECIFICATIONS', 14, y)
      doc.line(14, y + 2, 196, y + 2)

      y += 10
      doc.setFont('helvetica', 'bold')
      doc.text('Trip Type:', 14, y)
      doc.setFont('helvetica', 'normal')
      doc.text(journeyType, 45, y)

      doc.setFont('helvetica', 'bold')
      doc.text('Travel Date:', 120, y)
      doc.setFont('helvetica', 'normal')
      doc.text(travelDate, 145, y)

      y += 6
      doc.setFont('helvetica', 'bold')
      doc.text('Pickup:', 14, y)
      doc.setFont('helvetica', 'normal')
      doc.text(pickup.length > 42 ? pickup.substring(0, 39) + '...' : pickup, 45, y)

      y += 6
      doc.setFont('helvetica', 'bold')
      doc.text('Destination:', 14, y)
      doc.setFont('helvetica', 'normal')
      doc.text(destination.length > 42 ? destination.substring(0, 39) + '...' : destination, 45, y)

      y += 6
      doc.setFont('helvetica', 'bold')
      doc.text('Vehicle Category:', 14, y)
      doc.setFont('helvetica', 'normal')
      doc.text(vehicle, 45, y)

      doc.setFont('helvetica', 'bold')
      doc.text('Passengers:', 120, y)
      doc.setFont('helvetica', 'normal')
      doc.text(String(passengers), 145, y)

      y += 6
      doc.setFont('helvetica', 'bold')
      doc.text('Est. Distance:', 14, y)
      doc.setFont('helvetica', 'normal')
      doc.text(distance, 45, y)

      // Financial Summary Box
      y += 16
      doc.setFillColor(248, 250, 252) // slate-50
      doc.setDrawColor(226, 232, 240)
      doc.roundedRect(14, y, 182, 34, 3, 3, 'FD')

      doc.setTextColor(13, 16, 96)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('TOTAL INVESTMENT', 22, y + 12)

      doc.setTextColor(192, 39, 45) // NETS Red
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text(totalCost, 188, y + 14, { align: 'right' })

      doc.setTextColor(100, 116, 139)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text('Includes: Executive Vehicle, Certified Professional Driver, Fuel Allowance, Dispatch Support & Insurance', 22, y + 25)

      // Terms & Operational Standards
      y += 44
      doc.setTextColor(30, 41, 59)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('NETS OPERATIONAL STANDARDS', 14, y)
      doc.line(14, y + 2, 196, y + 2)

      y += 8
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(71, 85, 105)
      doc.text('• All vehicles undergo rigorous multi-point safety inspections prior to dispatch.', 14, y)
      doc.text('• Drivers are fully vetted, certified, and trained in defensive driving & executive protocol.', 14, y + 5)
      doc.text('• 24/7 Control Center monitoring ensures punctual arrival and real-time route optimization.', 14, y + 10)

      // Footer Line & Copyright
      doc.setDrawColor(226, 232, 240)
      doc.line(14, 280, 196, 280)
      doc.setFontSize(8)
      doc.setTextColor(148, 163, 184)
      doc.text('New Era Transport Services Ltd. — Official Computer-Generated Document', 105, 285, { align: 'center' })

      // Save PDF file to trigger download
      doc.save(`NETS-Quotation-${ref}.pdf`)
      console.log('📄 [PDF SERVICE] PDF generated and downloaded successfully.')
    } catch (err) {
      console.error('❌ [PDF SERVICE] Error generating PDF document:', err)
    }
  }
}

export const pdfService = new PDFService()
