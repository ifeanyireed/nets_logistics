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
	defaultVehicles := []models.Vehicle{
		{
			ID:              "suv",
			Name:            "Executive SUV",
			Slug:            "executive-suv",
			Category:        "Luxury",
			Capacity:        4,
			BestFor:         "VIP Transport · Executive Travel · Airport Pickups",
			ImageURL:        "/vehicles/suv.png",
			FeaturesJSON:    mustJSON([]string{"Leather Interior", "Air Conditioning", "Professional Driver", "Privacy Glass"}),
			Available:       true,
			ComfortRating:   "Ultra Luxury",
			LuggageSpace:    "Standard (Large boot for multiple suitcases)",
			AirConditioning: "Multi-Zone Automatic Climate Control",
		},
		{
			ID:              "hiace",
			Name:            "Toyota HiAce",
			Slug:            "toyota-hiace",
			Category:        "Standard",
			Capacity:        14,
			BestFor:         "Airport Transfers · Executive Teams · Short Routes",
			ImageURL:        "/vehicles/hiace.jpg",
			FeaturesJSON:    mustJSON([]string{"Air Conditioning", "Tinted Windows", "Professional Driver", "GPS Tracked"}),
			Available:       true,
			ComfortRating:   "Standard",
			LuggageSpace:    "Moderate (Suitable for day trips and cabin baggage)",
			AirConditioning: "Dual-Zone Air Conditioning",
		},
		{
			ID:              "coaster",
			Name:            "Toyota Coaster",
			Slug:            "toyota-coaster",
			Category:        "Executive",
			Capacity:        30,
			BestFor:         "Corporate Events · School Runs · Group Travel",
			ImageURL:        "/vehicles/coaster.jpg",
			FeaturesJSON:    mustJSON([]string{"Air Conditioning", "Reclining Seats", "Professional Driver", "GPS Tracked"}),
			Available:       true,
			ComfortRating:   "Executive",
			LuggageSpace:    "Generous (Rear compartment + overhead parcel racks)",
			AirConditioning: "High-Capacity Climate Control",
		},
	}

	for _, v := range defaultVehicles {
		var existing models.Vehicle
		if db.Where("id = ? OR slug = ?", v.ID, v.Slug).First(&existing).Error == nil {
			// Update existing record
			db.Model(&existing).Updates(map[string]interface{}{
				"id":               v.ID,
				"name":             v.Name,
				"slug":             v.Slug,
				"category":         v.Category,
				"capacity":         v.Capacity,
				"best_for":         v.BestFor,
				"image_url":        v.ImageURL,
				"features_json":    v.FeaturesJSON,
				"available":        v.Available,
				"comfort_rating":   v.ComfortRating,
				"luggage_space":    v.LuggageSpace,
				"air_conditioning": v.AirConditioning,
			})
		} else {
			// Insert missing vehicle
			db.Create(&v)
		}
	}

	// Legacy image path cleanup
	db.Model(&models.Vehicle{}).Where("image_url LIKE ?", "%suv.jpg").Update("image_url", "/vehicles/suv.png")
	db.Model(&models.Vehicle{}).Where("image_url LIKE ?", "%/images/%").Update("image_url", gorm.Expr("REPLACE(image_url, '/images/vehicles/', '/vehicles/')"))

	log.Println("🚗 Verified & synchronized vehicle catalog in MySQL database.")
}

func mustJSON(v interface{}) string {
	b, _ := json.Marshal(v)
	return string(b)
}
