package database

import (
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
