package handlers

import (
	"net/http"

	"nets-logistics-backend/internal/models"
	"nets-logistics-backend/internal/response"
)

type VehicleHandler struct{}

func NewVehicleHandler() *VehicleHandler {
	return &VehicleHandler{}
}

func (h *VehicleHandler) Index(w http.ResponseWriter, r *http.Request) {
	vehicles := []models.Vehicle{
		{
			ID:              "sedan-executive",
			Name:            "Executive Sedan",
			Slug:            "executive-sedan",
			Category:        "Executive & VIP Transport",
			Capacity:        4,
			BestFor:         "Corporate VIPs, airport transfers, executive city travel",
			ImageURL:        "/images/vehicles/sedan.jpg",
			Features:        []string{"Leather Interior", "Climate Control AC", "Privacy Glass", "WiFi"},
			Available:       true,
			ComfortRating:   "5 Stars",
			LuggageSpace:    "2 Large Suitcases",
			AirConditioning: "Dual-Zone Automatic",
		},
		{
			ID:              "suv-premium",
			Name:            "Premium SUV",
			Slug:            "premium-suv",
			Category:        "Executive & VIP Transport",
			Capacity:        6,
			BestFor:         "Executive travel, diplomatic missions, high-security escort",
			ImageURL:        "/images/vehicles/suv.jpg",
			Features:        []string{"All-Wheel Drive", "Bulletproof Option", "Leather Recliners", "Satellite Comm"},
			Available:       true,
			ComfortRating:   "5 Stars",
			LuggageSpace:    "4 Large Suitcases",
			AirConditioning: "Multi-Zone Executive AC",
		},
		{
			ID:              "coaster-bus",
			Name:            "Toyota Coaster Bus",
			Slug:            "toyota-coaster",
			Category:        "Group & Intercity Logistics",
			Capacity:        30,
			BestFor:         "Corporate team transit, event shuttles, intercity group delegation",
			ImageURL:        "/images/vehicles/coaster.jpg",
			Features:        []string{"High Capacity AC", "Reclining Seats", "Public Address System", "Luggage Compartment"},
			Available:       true,
			ComfortRating:   "4 Stars",
			LuggageSpace:    "30 Overhead & Rear Luggage Space",
			AirConditioning: "Dual Roof-Mounted AC Units",
		},
		{
			ID:              "truck-heavy",
			Name:            "Heavy Freight Truck (30-Ton)",
			Slug:            "heavy-freight-truck",
			Category:        "Freight & Heavy Haulage",
			Capacity:        30000,
			BestFor:         "Bulk industrial cargo, nationwide haulage, container transport",
			ImageURL:        "/images/vehicles/truck.jpg",
			Features:        []string{"GPS Real-time Tracking", "Air Suspension", "Hydraulic Liftgate", "Escort Ready"},
			Available:       true,
			ComfortRating:   "N/A",
			LuggageSpace:    "30 Tons Bulk Capacity",
			AirConditioning: "Driver Cabin AC",
		},
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"count":    len(vehicles),
		"vehicles": vehicles,
	})
}
