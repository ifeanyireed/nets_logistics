package database

import (
	"encoding/json"
	"fmt"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"nets-logistics-backend/internal/config"
	"nets-logistics-backend/internal/models"
)

var DB *gorm.DB

func InitDB(cfg *config.Config) (*gorm.DB, error) {
	dsn := cfg.GetFormattedDSN()

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Printf("⚠️ Warning: Initial GORM connection failed: %v", err)
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	log.Println("✅ GORM Database connection established successfully.")

	DB = db

	if err := AutoMigrate(db); err != nil {
		log.Printf("⚠️ Migration warning: %v", err)
	}

	SeedVehicles(db)

	return db, nil
}

func AutoMigrate(db *gorm.DB) error {
	err := db.AutoMigrate(
		&models.Lead{},
		&models.Contact{},
		&models.Vehicle{},
	)
	if err != nil {
		return fmt.Errorf("failed GORM auto migration: %w", err)
	}

	log.Println("✅ GORM AutoMigrate completed successfully (Leads, Contacts, Vehicles tables verified).")
	return nil
}

func SeedVehicles(db *gorm.DB) {
	var count int64
	db.Model(&models.Vehicle{}).Count(&count)
	if count > 0 {
		return
	}

	defaultVehicles := []models.Vehicle{
		{
			ID:              "sedan-executive",
			Name:            "Executive Sedan",
			Slug:            "executive-sedan",
			Category:        "Executive & VIP Transport",
			Capacity:        4,
			BestFor:         "Corporate VIPs, airport transfers, executive city travel",
			ImageURL:        "/images/vehicles/sedan.jpg",
			FeaturesJSON:    mustJSON([]string{"Leather Interior", "Climate Control AC", "Privacy Glass", "WiFi"}),
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
			FeaturesJSON:    mustJSON([]string{"All-Wheel Drive", "Bulletproof Option", "Leather Recliners", "Satellite Comm"}),
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
			FeaturesJSON:    mustJSON([]string{"High Capacity AC", "Reclining Seats", "Public Address System", "Luggage Compartment"}),
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
			FeaturesJSON:    mustJSON([]string{"GPS Real-time Tracking", "Air Suspension", "Hydraulic Liftgate", "Escort Ready"}),
			Available:       true,
			ComfortRating:   "N/A",
			LuggageSpace:    "30 Tons Bulk Capacity",
			AirConditioning: "Driver Cabin AC",
		},
	}

	for _, v := range defaultVehicles {
		db.Create(&v)
	}
	log.Println("🚗 Seeded initial vehicle catalog into MySQL database.")
}

func mustJSON(v interface{}) string {
	b, _ := json.Marshal(v)
	return string(b)
}
