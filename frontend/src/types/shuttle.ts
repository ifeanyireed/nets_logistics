export interface ShuttleStop {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  timeOffsetMins: number
}

export interface ShuttleRoute {
  id: string
  name: string
  code: string
  category: 'Urban Express' | 'Intercity' | 'Airport Link'
  origin: string
  destination: string
  durationText: string
  durationMins: number
  startingFare: number
  nextDeparture: string
  frequency: string
  rating: number
  stops: ShuttleStop[]
}

export interface ShuttleTrip {
  id: string
  routeId: string
  departureTime: string
  arrivalTime: string
  vehicleType: string
  vehiclePlate: string
  driverName: string
  driverPhone: string
  driverRating: number
  seatsTotal: number
  seatsRemaining: number
  farePerSeat: number
}

export interface SavedPassenger {
  id: string
  fullName: string
  email: string
  phone: string
  relationship: string
}

export interface ShuttleBooking {
  id: string
  bookingRef: string
  routeId: string
  routeName: string
  origin: string
  destination: string
  pickupStop: ShuttleStop
  dropoffStop: ShuttleStop
  travelDate: string
  departureTime: string
  arrivalTime: string
  vehicleType: string
  vehiclePlate: string
  driverName: string
  driverPhone: string
  passengerName: string
  passengerPhone: string
  passengerEmail: string
  seatCount: number
  baseFare: number
  discount: number
  totalFare: number
  paymentMethod: 'wallet' | 'card' | 'paystack'
  status: 'confirmed' | 'in_transit' | 'completed' | 'cancelled'
  qrCodeUrl: string
  createdAt: string
}

export interface WalletTransaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  timestamp: string
}
