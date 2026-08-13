import { create } from 'zustand'
import type { ShuttleRoute, ShuttleStop, ShuttleTrip, SavedPassenger, ShuttleBooking, WalletTransaction } from '../types/shuttle'
import { mockShuttleRoutes, mockShuttleTrips, mockSavedPassengers, mockInitialBookings, mockWalletTransactions, PROMO_CODES } from '../data/shuttleData'

interface ShuttleState {
  // Routes & Search
  routes: ShuttleRoute[]
  searchQuery: string
  selectedCategory: string
  setSearchQuery: (query: string) => void
  setSelectedCategory: (cat: string) => void

  // Booking Flow State
  selectedRoute: ShuttleRoute | null
  setSelectedRoute: (route: ShuttleRoute | null) => void

  pickupStop: ShuttleStop | null
  setPickupStop: (stop: ShuttleStop | null) => void

  dropoffStop: ShuttleStop | null
  setDropoffStop: (stop: ShuttleStop | null) => void

  travelDate: string
  setTravelDate: (date: string) => void

  selectedTrip: ShuttleTrip | null
  setSelectedTrip: (trip: ShuttleTrip | null) => void

  seatCount: number
  setSeatCount: (count: number) => void

  // Passenger selection
  selectedPassengerId: string
  customPassengerName: string
  customPassengerPhone: string
  customPassengerEmail: string
  setSelectedPassengerId: (id: string) => void
  setCustomPassengerDetails: (details: { name?: string; phone?: string; email?: string }) => void

  // Promo Code
  promoCode: string
  promoDiscountRatio: number
  promoError: string | null
  applyPromoCode: (code: string) => boolean
  clearPromoCode: () => void

  // Payment
  paymentMethod: 'wallet' | 'card' | 'paystack'
  setPaymentMethod: (method: 'wallet' | 'card' | 'paystack') => void
  walletBalance: number
  walletTransactions: WalletTransaction[]
  topUpWallet: (amount: number) => void

  // Bookings & Extras
  bookings: ShuttleBooking[]
  favoriteRouteIds: string[]
  savedPassengers: SavedPassenger[]
  toggleFavoriteRoute: (routeId: string) => void
  addSavedPassenger: (pax: Omit<SavedPassenger, 'id'>) => void
  removeSavedPassenger: (id: string) => void

  // Current active booking created
  latestBooking: ShuttleBooking | null
  confirmBooking: () => ShuttleBooking

  // Live Trip Simulation State
  liveVehicleEtaMins: number
  liveVehicleProgressPct: number
  notifyBeforeStop: boolean
  setNotifyBeforeStop: (notify: boolean) => void
  isSosModalOpen: boolean
  setIsSosModalOpen: (open: boolean) => void
  advanceLiveVehicle: () => void

  // Rating & Review State
  submitDriverRating: (bookingId: string, rating: number, feedback: string) => void
  submitIssueReport: (bookingId: string, issueType: string, description: string) => void
}

export const useShuttleStore = create<ShuttleState>((set, get) => ({
  routes: mockShuttleRoutes,
  searchQuery: '',
  selectedCategory: 'All',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

  selectedRoute: mockShuttleRoutes[0],
  setSelectedRoute: (selectedRoute) => {
    if (!selectedRoute) {
      set({ selectedRoute: null, pickupStop: null, dropoffStop: null, selectedTrip: null })
      return
    }
    const stops = selectedRoute.stops
    set({
      selectedRoute,
      pickupStop: stops[0] || null,
      dropoffStop: stops[stops.length - 1] || null,
      selectedTrip: (mockShuttleTrips[selectedRoute.id] || [])[0] || null
    })
  },

  pickupStop: mockShuttleRoutes[0].stops[0],
  setPickupStop: (pickupStop) => set({ pickupStop }),

  dropoffStop: mockShuttleRoutes[0].stops[mockShuttleRoutes[0].stops.length - 1],
  setDropoffStop: (dropoffStop) => set({ dropoffStop }),

  travelDate: new Date().toISOString().split('T')[0],
  setTravelDate: (travelDate) => set({ travelDate }),

  selectedTrip: mockShuttleTrips['route-1'][0],
  setSelectedTrip: (selectedTrip) => set({ selectedTrip }),

  seatCount: 1,
  setSeatCount: (seatCount) => set({ seatCount }),

  selectedPassengerId: 'pax-1',
  customPassengerName: '',
  customPassengerPhone: '',
  customPassengerEmail: '',
  setSelectedPassengerId: (selectedPassengerId) => set({ selectedPassengerId }),
  setCustomPassengerDetails: (details) => set((state) => ({
    customPassengerName: details.name !== undefined ? details.name : state.customPassengerName,
    customPassengerPhone: details.phone !== undefined ? details.phone : state.customPassengerPhone,
    customPassengerEmail: details.email !== undefined ? details.email : state.customPassengerEmail,
  })),

  promoCode: '',
  promoDiscountRatio: 0,
  promoError: null,
  applyPromoCode: (code: string) => {
    const clean = code.trim().toUpperCase()
    if (PROMO_CODES[clean]) {
      set({ promoCode: clean, promoDiscountRatio: PROMO_CODES[clean], promoError: null })
      return true
    }
    set({ promoError: 'Invalid promo code' })
    return false
  },
  clearPromoCode: () => set({ promoCode: '', promoDiscountRatio: 0, promoError: null }),

  paymentMethod: 'wallet',
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  walletBalance: 45000,
  walletTransactions: mockWalletTransactions,
  topUpWallet: (amount: number) => set((state) => ({
    walletBalance: state.walletBalance + amount,
    walletTransactions: [
      {
        id: `tx-${Date.now()}`,
        type: 'credit',
        amount,
        description: 'Wallet Top-up via Card',
        timestamp: new Date().toLocaleString()
      },
      ...state.walletTransactions
    ]
  })),

  bookings: mockInitialBookings,
  favoriteRouteIds: ['route-1'],
  savedPassengers: mockSavedPassengers,
  toggleFavoriteRoute: (routeId: string) => set((state) => ({
    favoriteRouteIds: state.favoriteRouteIds.includes(routeId)
      ? state.favoriteRouteIds.filter(id => id !== routeId)
      : [...state.favoriteRouteIds, routeId]
  })),
  addSavedPassenger: (pax) => set((state) => ({
    savedPassengers: [...state.savedPassengers, { ...pax, id: `pax-${Date.now()}` }]
  })),
  removeSavedPassenger: (id) => set((state) => ({
    savedPassengers: state.savedPassengers.filter(p => p.id !== id)
  })),

  latestBooking: mockInitialBookings[0],

  confirmBooking: () => {
    const state = get()
    const route = state.selectedRoute || mockShuttleRoutes[0]
    const pickup = state.pickupStop || route.stops[0]
    const dropoff = state.dropoffStop || route.stops[route.stops.length - 1]
    const trip = state.selectedTrip || (mockShuttleTrips[route.id] || [])[0]

    let passengerName = 'Self (Primary Account Holder)'
    let passengerPhone = '+234 916 791 9439'
    let passengerEmail = 'customer@netstransport.com'

    if (state.selectedPassengerId === 'custom') {
      passengerName = state.customPassengerName || 'Guest Passenger'
      passengerPhone = state.customPassengerPhone || '+234 800 000 0000'
      passengerEmail = state.customPassengerEmail || 'passenger@nets.ng'
    } else {
      const found = state.savedPassengers.find(p => p.id === state.selectedPassengerId)
      if (found) {
        passengerName = found.fullName
        passengerPhone = found.phone
        passengerEmail = found.email
      }
    }

    const fareUnit = trip ? trip.farePerSeat : route.startingFare
    const rawFare = fareUnit * state.seatCount
    const discountAmt = Math.round(rawFare * state.promoDiscountRatio)
    const finalFare = rawFare - discountAmt

    const randId = Math.floor(1000 + Math.random() * 9000)
    const bookingRef = `NETS-SHUTTLE-${randId}`

    const newBooking: ShuttleBooking = {
      id: `book-${randId}`,
      bookingRef,
      routeId: route.id,
      routeName: route.name,
      origin: route.origin,
      destination: route.destination,
      pickupStop: pickup,
      dropoffStop: dropoff,
      travelDate: state.travelDate,
      departureTime: trip ? trip.departureTime : '08:00 AM',
      arrivalTime: trip ? trip.arrivalTime : '08:45 AM',
      vehicleType: trip ? trip.vehicleType : 'Toyota HiAce Executive (14-Seater)',
      vehiclePlate: trip ? trip.vehiclePlate : 'LSD-482-XY',
      driverName: trip ? trip.driverName : 'Emeka Chukwu',
      driverPhone: trip ? trip.driverPhone : '+234 803 111 2233',
      passengerName,
      passengerPhone,
      passengerEmail,
      seatCount: state.seatCount,
      baseFare: rawFare,
      discount: discountAmt,
      totalFare: finalFare,
      paymentMethod: state.paymentMethod,
      status: 'confirmed',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${bookingRef}`,
      createdAt: new Date().toLocaleString()
    }

    // Deduct wallet if wallet payment
    let newWallet = state.walletBalance
    let updatedTx = state.walletTransactions
    if (state.paymentMethod === 'wallet') {
      newWallet = Math.max(0, state.walletBalance - finalFare)
      updatedTx = [
        {
          id: `tx-${Date.now()}`,
          type: 'debit',
          amount: finalFare,
          description: `Shuttle Booking #${bookingRef}`,
          timestamp: new Date().toLocaleString()
        },
        ...state.walletTransactions
      ]
    }

    set({
      bookings: [newBooking, ...state.bookings],
      latestBooking: newBooking,
      walletBalance: newWallet,
      walletTransactions: updatedTx,
      liveVehicleEtaMins: 12,
      liveVehicleProgressPct: 25,
    })

    return newBooking
  },

  // Live Vehicle Simulation
  liveVehicleEtaMins: 12,
  liveVehicleProgressPct: 25,
  notifyBeforeStop: true,
  setNotifyBeforeStop: (notifyBeforeStop) => set({ notifyBeforeStop }),
  isSosModalOpen: false,
  setIsSosModalOpen: (isSosModalOpen) => set({ isSosModalOpen }),
  advanceLiveVehicle: () => set((state) => {
    const nextPct = Math.min(100, state.liveVehicleProgressPct + 15)
    const nextEta = Math.max(0, state.liveVehicleEtaMins - 2)
    return {
      liveVehicleProgressPct: nextPct,
      liveVehicleEtaMins: nextEta
    }
  }),

  // Review & Rating
  submitDriverRating: (bookingId, rating, feedback) => set((state) => ({
    bookings: state.bookings.map(b => b.id === bookingId ? { ...b, status: 'completed' } : b)
  })),
  submitIssueReport: (bookingId, issueType, description) => {
    console.log(`Issue reported for booking ${bookingId}: ${issueType} - ${description}`)
  }
}))
