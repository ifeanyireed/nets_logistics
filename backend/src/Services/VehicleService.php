<?php

namespace App\Services;

class VehicleService
{
    public static function getVehicles(): array
    {
        return [
            [
                'id' => 'sedan-executive',
                'name' => 'Executive Sedan',
                'slug' => 'executive-sedan',
                'category' => 'Executive & VIP Transport',
                'capacity' => 4,
                'bestFor' => 'Corporate VIPs, airport transfers, executive city travel',
                'imageUrl' => '/images/vehicles/sedan.jpg',
                'features' => ['Leather Interior', 'Climate Control AC', 'Privacy Glass', 'WiFi'],
                'available' => true,
                'comfortRating' => '5 Stars',
                'luggageSpace' => '2 Large Suitcases',
                'airConditioning' => 'Dual-Zone Automatic',
            ],
            [
                'id' => 'suv-premium',
                'name' => 'Premium SUV',
                'slug' => 'premium-suv',
                'category' => 'Executive & VIP Transport',
                'capacity' => 6,
                'bestFor' => 'Executive travel, diplomatic missions, high-security escort',
                'imageUrl' => '/images/vehicles/suv.jpg',
                'features' => ['All-Wheel Drive', 'Bulletproof Option', 'Leather Recliners', 'Satellite Comm'],
                'available' => true,
                'comfortRating' => '5 Stars',
                'luggageSpace' => '4 Large Suitcases',
                'airConditioning' => 'Multi-Zone Executive AC',
            ],
            [
                'id' => 'coaster-bus',
                'name' => 'Toyota Coaster Bus',
                'slug' => 'toyota-coaster',
                'category' => 'Group & Intercity Logistics',
                'capacity' => 30,
                'bestFor' => 'Corporate team transit, event shuttles, intercity group delegation',
                'imageUrl' => '/images/vehicles/coaster.jpg',
                'features' => ['High Capacity AC', 'Reclining Seats', 'Public Address System', 'Luggage Compartment'],
                'available' => true,
                'comfortRating' => '4 Stars',
                'luggageSpace' => '30 Overhead & Rear Luggage Space',
                'airConditioning' => 'Dual Roof-Mounted AC Units',
            ],
            [
                'id' => 'truck-heavy',
                'name' => 'Heavy Freight Truck (30-Ton)',
                'slug' => 'heavy-freight-truck',
                'category' => 'Freight & Heavy Haulage',
                'capacity' => 30000,
                'bestFor' => 'Bulk industrial cargo, nationwide haulage, container transport',
                'imageUrl' => '/images/vehicles/truck.jpg',
                'features' => ['GPS Real-time Tracking', 'Air Suspension', 'Hydraulic Liftgate', 'Escort Ready'],
                'available' => true,
                'comfortRating' => 'N/A',
                'luggageSpace' => '30 Tons Bulk Capacity',
                'airConditioning' => 'Driver Cabin AC',
            ]
        ];
    }
}
