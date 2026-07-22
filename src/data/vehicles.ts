import type { Vehicle } from '@/types'

// Professional Unsplash photos — bus/coach/transport
export const vehicles: Vehicle[] = [
  {
    id: 'hiace',
    name: 'Toyota HiAce',
    slug: 'toyota-hiace',
    capacity: 14,
    category: 'Standard',
    bestFor: 'Airport Transfers · Executive Teams · Short Routes',
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&q=80',
    features: ['Air Conditioning', 'Tinted Windows', 'Professional Driver', 'GPS Tracked'],
    available: true,
    editorialStory: 'The Toyota HiAce is the backbone of Nigerian corporate mobility. Compact enough to navigate busy city centres yet spacious enough to comfortably seat 14 passengers, it is the definitive choice for daily staff movement, quick airport transfers, and short intercity routes. It balances supreme reliability with cost-effectiveness without compromising on passenger safety.',
    comfortRating: 'Standard',
    luggageSpace: 'Moderate (Suitable for day trips and cabin baggage)',
    airConditioning: 'Dual-Zone Air Conditioning',
    recommendedFor: ['Corporate Staff Transportation', 'Airport Transfers', 'Short Excursions'],
    gallery: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&q=80',
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
    ]
  },
  {
    id: 'coaster',
    name: 'Toyota Coaster',
    slug: 'toyota-coaster',
    capacity: 30,
    category: 'Executive',
    bestFor: 'Corporate Events · School Runs · Group Travel',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80',
    features: ['Air Conditioning', 'Reclining Seats', 'Professional Driver', 'GPS Tracked'],
    available: true,
    editorialStory: 'The benchmark for medium-scale group transportation. The Toyota Coaster delivers an executive travel experience for up to 30 passengers. With elevated seating, panoramic windows, and robust air conditioning designed for the Nigerian climate, it is the preferred vehicle for school fleets, factory staff, and corporate event shuttles.',
    comfortRating: 'Executive',
    luggageSpace: 'Generous (Rear compartment + overhead parcel racks)',
    airConditioning: 'High-Capacity Climate Control',
    recommendedFor: ['Corporate Staff Transportation', 'School Excursions', 'Weddings', 'Conferences'],
    gallery: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80',
      'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&q=80'
    ]
  },
  {
    id: 'midibus-18',
    name: '18-Seater Executive Shuttle',
    slug: '18-seater-shuttle',
    capacity: 18,
    category: 'Executive',
    bestFor: 'Staff Transportation · Hotel Shuttles · Church Groups',
    imageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1200&q=80',
    features: ['Air Conditioning', 'USB Charging', 'Professional Driver', 'GPS Tracked'],
    available: true,
    editorialStory: 'Designed for discerning groups who require slightly more space than a standard minibus but don\'t need a full coach. The 18-Seater Executive Shuttle bridges the gap perfectly, offering upgraded upholstery, personal USB charging ports, and excellent suspension for a smooth, premium journey across long distances or inner-city traffic.',
    comfortRating: 'Executive Plus',
    luggageSpace: 'Moderate (Dedicated rear storage)',
    airConditioning: 'Individual Air Vents & Dual-Zone Control',
    recommendedFor: ['Executive Events', 'Tourism', 'Private Hire', 'Hotel Shuttles'],
    gallery: [
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1200&q=80',
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80'
    ]
  },
  {
    id: 'coach-50',
    name: '50-Seater Luxury Coach',
    slug: '50-seater-coach',
    capacity: 50,
    category: 'Luxury',
    bestFor: 'Conferences · Pilgrimages · Long Haul · Large Groups',
    imageUrl: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=1200&q=80',
    features: ['Air Conditioning', 'PA System', 'Luggage Hold', 'Professional Driver', 'GPS Tracked'],
    available: true,
    editorialStory: 'Our flagship offering for large-scale movement. The 50-Seater Luxury Coach is an inter-city fortress designed for maximum passenger comfort over long durations. Featuring deep reclining seats, on-board entertainment systems, a PA system for guides or team leaders, and massive undercarriage luggage bays, it is the ultimate vehicle for major conferences, tourism, and interstate travel.',
    comfortRating: 'Luxury',
    luggageSpace: 'Maximum (Massive undercarriage storage bays)',
    airConditioning: 'Advanced Full-Cabin Climate Control',
    recommendedFor: ['Conferences', 'Tourism', 'Religious Events', 'Interstate Travel'],
    gallery: [
      'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=1200&q=80',
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80'
    ]
  },
  {
    id: 'suv',
    name: 'Executive SUV',
    slug: 'executive-suv',
    capacity: 4,
    category: 'Luxury',
    bestFor: 'VIP Transport · Executive Travel · Airport Pickups',
    imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80',
    features: ['Leather Interior', 'Air Conditioning', 'Professional Driver', 'Privacy Glass'],
    available: true,
    editorialStory: 'Commanding presence meets unparalleled comfort. Our Executive SUVs are reserved for VIPs, C-suite executives, and high-profile delegates requiring secure, discreet, and deeply comfortable transportation. With premium leather interiors, advanced sound insulation, and privacy glass, it provides a quiet sanctuary on the move.',
    comfortRating: 'Ultra Luxury',
    luggageSpace: 'Standard (Large boot for multiple suitcases)',
    airConditioning: 'Multi-Zone Automatic Climate Control',
    recommendedFor: ['VIP Transport', 'Airport Pickups', 'Executive Travel', 'Weddings'],
    gallery: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80',
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80'
    ]
  },
  {
    id: 'sedan',
    name: 'Executive Sedan',
    slug: 'executive-sedan',
    capacity: 3,
    category: 'Luxury',
    bestFor: 'CEO Transport · Point-to-Point · Airport Transfers',
    imageUrl: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200&q=80',
    features: ['Premium Leather', 'Air Conditioning', 'Professional Chauffeur', 'GPS Tracked'],
    available: true,
    editorialStory: 'The classic choice for executive mobility. The Executive Sedan provides a smooth, elegant, and highly professional point-to-point travel experience. Perfect for navigating the business districts of Lagos or Abuja, it offers executives a quiet space to prepare for meetings or decompress after a long flight.',
    comfortRating: 'Luxury',
    luggageSpace: 'Standard (Suitable for two large suitcases)',
    airConditioning: 'Dual-Zone Automatic Climate Control',
    recommendedFor: ['Airport Transfers', 'CEO Transport', 'Point-to-Point Corporate'],
    gallery: [
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200&q=80',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80'
    ]
  },
]
