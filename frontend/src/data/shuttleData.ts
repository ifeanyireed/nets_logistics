import type { ShuttleRoute, ShuttleTrip, SavedPassenger, ShuttleBooking, WalletTransaction } from '../types/shuttle'

export const mockShuttleRoutes: ShuttleRoute[] = [
  {
    id: 'route-1',
    name: 'Lekki – Victoria Island – Marina Express',
    code: 'NETS-LVM',
    category: 'Urban Express',
    origin: 'Lekki Phase 1 Gate',
    destination: 'Marina Bus Terminal',
    durationText: '45 mins',
    durationMins: 45,
    startingFare: 1500,
    nextDeparture: '07:30 AM',
    frequency: 'Every 20 mins',
    rating: 4.9,
    stops: [
      { id: 'stop-101', name: 'Lekki Phase 1 Gate', address: 'Admiralty Way, Lekki', lat: 6.4474, lng: 3.4723, timeOffsetMins: 0 },
      { id: 'stop-102', name: 'Lekki Toll Gate', address: 'Lekki Express Way', lat: 6.4385, lng: 3.4560, timeOffsetMins: 10 },
      { id: 'stop-103', name: 'Victoria Island (Adetokunbo Ademola)', address: 'VI Center, Lagos', lat: 6.4281, lng: 3.4219, timeOffsetMins: 25 },
      { id: 'stop-104', name: 'Onikan (TBS)', address: 'Tafawa Balewa Square', lat: 6.4442, lng: 3.4022, timeOffsetMins: 35 },
      { id: 'stop-105', name: 'Marina Bus Terminal', address: 'Marina Lagos Island', lat: 6.4531, lng: 3.3882, timeOffsetMins: 45 }
    ]
  },
  {
    id: 'route-2',
    name: 'Ikeja Airport – Maryland – Lekki Express',
    code: 'NETS-AML',
    category: 'Airport Link',
    origin: 'MM2 Airport Ikeja',
    destination: 'Lekki Conservation Center',
    durationText: '1 hr 10 mins',
    durationMins: 70,
    startingFare: 3500,
    nextDeparture: '08:00 AM',
    frequency: 'Every 30 mins',
    rating: 4.8,
    stops: [
      { id: 'stop-201', name: 'MM2 Airport Ikeja', address: 'Murtala Muhammed Airport', lat: 6.5774, lng: 3.3370, timeOffsetMins: 0 },
      { id: 'stop-202', name: 'Maryland Mall', address: 'Ikorodu Road, Maryland', lat: 6.5615, lng: 3.3664, timeOffsetMins: 20 },
      { id: 'stop-203', name: 'Third Mainland Interchange', address: 'Gbagada Expressway', lat: 6.5412, lng: 3.3891, timeOffsetMins: 35 },
      { id: 'stop-204', name: 'Ikoyi Link Bridge', address: 'Admiralty Link Bridge', lat: 6.4520, lng: 3.4410, timeOffsetMins: 55 },
      { id: 'stop-205', name: 'Lekki Conservation Center', address: 'Lekki Epe Expressway', lat: 6.4401, lng: 3.5350, timeOffsetMins: 70 }
    ]
  },
  {
    id: 'route-3',
    name: 'Lagos Island – Ibadan Intercity Express',
    code: 'NETS-LIB',
    category: 'Intercity',
    origin: 'Oshodi Transport Interchange',
    destination: 'Ibadan Challenge Terminal',
    durationText: '1 hr 45 mins',
    durationMins: 105,
    startingFare: 6500,
    nextDeparture: '09:00 AM',
    frequency: 'Hourly',
    rating: 4.9,
    stops: [
      { id: 'stop-301', name: 'Oshodi Interchange', address: 'Oshodi Terminal 1', lat: 6.5540, lng: 3.3510, timeOffsetMins: 0 },
      { id: 'stop-302', name: 'Berger Bus Stop', address: 'Lagos-Ibadan Expressway', lat: 6.6430, lng: 3.3710, timeOffsetMins: 25 },
      { id: 'stop-303', name: 'Redeemed Camp Interchange', address: 'Km 46 Lagos-Ibadan Exp', lat: 6.7820, lng: 3.4210, timeOffsetMins: 45 },
      { id: 'stop-304', name: 'Ogere Hub', address: 'Ogere Remo', lat: 6.9110, lng: 3.6120, timeOffsetMins: 70 },
      { id: 'stop-305', name: 'Ibadan Challenge Terminal', address: 'Challenge Roundabout Ibadan', lat: 7.3510, lng: 3.8740, timeOffsetMins: 105 }
    ]
  },
  {
    id: 'route-4',
    name: 'Abuja Central – Gwarinpa – Kubwa Shuttle',
    code: 'NETS-AGK',
    category: 'Urban Express',
    origin: 'Central Business District (CBD) Abuja',
    destination: 'Kubwa Train Station',
    durationText: '40 mins',
    durationMins: 40,
    startingFare: 2000,
    nextDeparture: '07:15 AM',
    frequency: 'Every 15 mins',
    rating: 4.9,
    stops: [
      { id: 'stop-401', name: 'CBD Eagle Square', address: 'Central Area, Abuja', lat: 9.0601, lng: 7.4951, timeOffsetMins: 0 },
      { id: 'stop-402', name: 'Wuse II Plaza', address: 'Aminu Kano Crescent, Wuse 2', lat: 9.0792, lng: 7.4720, timeOffsetMins: 12 },
      { id: 'stop-403', name: 'Gwarinpa 1st Avenue', address: 'Gwarinpa Estate, Abuja', lat: 9.1120, lng: 7.4101, timeOffsetMins: 25 },
      { id: 'stop-404', name: 'Kubwa Train Station', address: 'Kubwa Expressway, Abuja', lat: 9.1550, lng: 7.3320, timeOffsetMins: 40 }
    ]
  }
]

export const mockShuttleTrips: Record<string, ShuttleTrip[]> = {
  'route-1': [
    {
      id: 'trip-101',
      routeId: 'route-1',
      departureTime: '07:30 AM',
      arrivalTime: '08:15 AM',
      vehicleType: 'Toyota HiAce Executive (Luxury 14-Seater)',
      vehiclePlate: 'LSD-482-XY',
      driverName: 'Emeka Chukwu',
      driverPhone: '+234 803 111 2233',
      driverRating: 4.9,
      seatsTotal: 14,
      seatsRemaining: 4,
      farePerSeat: 1500
    },
    {
      id: 'trip-102',
      routeId: 'route-1',
      departureTime: '08:00 AM',
      arrivalTime: '08:45 AM',
      vehicleType: 'Toyota Coaster Executive (30-Seater)',
      vehiclePlate: 'KJA-910-AB',
      driverName: 'Babajide Ogundele',
      driverPhone: '+234 802 333 4455',
      driverRating: 4.8,
      seatsTotal: 30,
      seatsRemaining: 12,
      farePerSeat: 1500
    },
    {
      id: 'trip-103',
      routeId: 'route-1',
      departureTime: '08:30 AM',
      arrivalTime: '09:15 AM',
      vehicleType: 'Toyota HiAce Executive (Luxury 14-Seater)',
      vehiclePlate: 'EKY-772-MN',
      driverName: 'Usman Garba',
      driverPhone: '+234 805 777 8899',
      driverRating: 4.95,
      seatsTotal: 14,
      seatsRemaining: 7,
      farePerSeat: 1500
    }
  ],
  'route-2': [
    {
      id: 'trip-201',
      routeId: 'route-2',
      departureTime: '08:00 AM',
      arrivalTime: '09:10 AM',
      vehicleType: 'Toyota Coaster Executive (30-Seater)',
      vehiclePlate: 'SMK-114-ZZ',
      driverName: 'Seyi Adebayo',
      driverPhone: '+234 809 444 5566',
      driverRating: 4.9,
      seatsTotal: 30,
      seatsRemaining: 8,
      farePerSeat: 3500
    },
    {
      id: 'trip-202',
      routeId: 'route-2',
      departureTime: '09:00 AM',
      arrivalTime: '10:10 AM',
      vehicleType: 'Toyota HiAce Executive (Luxury 14-Seater)',
      vehiclePlate: 'GGE-331-AA',
      driverName: 'Kelechi Okafor',
      driverPhone: '+234 802 999 0011',
      driverRating: 4.85,
      seatsTotal: 14,
      seatsRemaining: 3,
      farePerSeat: 3500
    }
  ],
  'route-3': [
    {
      id: 'trip-301',
      routeId: 'route-3',
      departureTime: '09:00 AM',
      arrivalTime: '10:45 AM',
      vehicleType: 'Executive Intercity Bus (18-Seater)',
      vehiclePlate: 'FST-882-QQ',
      driverName: 'Tunde Lawal',
      driverPhone: '+234 803 222 3344',
      driverRating: 4.92,
      seatsTotal: 18,
      seatsRemaining: 5,
      farePerSeat: 6500
    }
  ],
  'route-4': [
    {
      id: 'trip-401',
      routeId: 'route-4',
      departureTime: '07:15 AM',
      arrivalTime: '07:55 AM',
      vehicleType: 'Toyota HiAce Executive (14-Seater)',
      vehiclePlate: 'RBC-901-FC',
      driverName: 'Ibrahim Danjuma',
      driverPhone: '+234 806 555 6677',
      driverRating: 4.88,
      seatsTotal: 14,
      seatsRemaining: 6,
      farePerSeat: 2000
    }
  ]
}

export const mockSavedPassengers: SavedPassenger[] = [
  { id: 'pax-1', fullName: 'Self (Primary Account Holder)', email: 'customer@netstransport.com', phone: '+234 916 791 9439', relationship: 'Self' },
  { id: 'pax-2', fullName: 'Chioma Adebayo', email: 'chioma.a@gmail.com', phone: '+234 802 123 4567', relationship: 'Family Member' },
  { id: 'pax-3', fullName: 'Oluwaseun Bakare', email: 'seun.bakare@company.ng', phone: '+234 803 987 6543', relationship: 'Colleague' }
]

export const mockWalletTransactions: WalletTransaction[] = [
  { id: 'tx-1', type: 'credit', amount: 25000, description: 'Wallet Auto-Topup via Card', timestamp: '2026-08-10 10:30 AM' },
  { id: 'tx-2', type: 'debit', amount: 3000, description: 'Shuttle Booking #NETS-SHUTTLE-771', timestamp: '2026-08-11 08:15 AM' },
  { id: 'tx-3', type: 'debit', amount: 6500, description: 'Shuttle Booking #NETS-SHUTTLE-812', timestamp: '2026-08-12 04:45 PM' }
]

export const mockInitialBookings: ShuttleBooking[] = [
  {
    id: 'book-8942',
    bookingRef: 'NETS-SHUTTLE-8942',
    routeId: 'route-1',
    routeName: 'Lekki – Victoria Island – Marina Express',
    origin: 'Lekki Phase 1 Gate',
    destination: 'Marina Bus Terminal',
    pickupStop: mockShuttleRoutes[0].stops[0],
    dropoffStop: mockShuttleRoutes[0].stops[4],
    travelDate: '2026-08-13',
    departureTime: '07:30 AM',
    arrivalTime: '08:15 AM',
    vehicleType: 'Toyota HiAce Executive (Luxury 14-Seater)',
    vehiclePlate: 'LSD-482-XY',
    driverName: 'Emeka Chukwu',
    driverPhone: '+234 803 111 2233',
    passengerName: 'Self (Primary Account Holder)',
    passengerPhone: '+234 916 791 9439',
    passengerEmail: 'customer@netstransport.com',
    seatCount: 1,
    baseFare: 1500,
    discount: 0,
    totalFare: 1500,
    paymentMethod: 'wallet',
    status: 'confirmed',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=NETS-SHUTTLE-8942',
    createdAt: '2026-08-13 06:45 AM'
  }
]

export const PROMO_CODES: Record<string, number> = {
  'NETSFIRST': 0.15, // 15% off
  'SHUTTLE2026': 0.20, // 20% off
  'EXPRESS10': 0.10 // 10% off
}
