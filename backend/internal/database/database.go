package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
	"nets-logistics-backend/internal/config"
)

var DB *sql.DB

func InitDB(cfg *config.Config) (*sql.DB, error) {
	dsn := cfg.GetFormattedDSN()

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database connection: %w", err)
	}

	if err := db.Ping(); err != nil {
		log.Printf("⚠️ Warning: Initial DB Ping failed (will retry on requests): %v", err)
	} else {
		log.Println("✅ Database connection established successfully.")
	}

	DB = db

	if err := Migrate(db); err != nil {
		log.Printf("⚠️ Migration warning: %v", err)
	}

	return db, nil
}

func Migrate(db *sql.DB) error {
	leadsTable := `
	CREATE TABLE IF NOT EXISTS leads (
		id INT AUTO_INCREMENT PRIMARY KEY,
		lead_reference VARCHAR(64) NOT NULL,
		customer_name VARCHAR(255),
		customer_email VARCHAR(255),
		customer_phone VARCHAR(64),
		company VARCHAR(255),
		journey_type VARCHAR(64),
		origin VARCHAR(255),
		destination VARCHAR(255),
		estimated_investment_min DOUBLE DEFAULT 0,
		estimated_investment_max DOUBLE DEFAULT 0,
		status VARCHAR(64) DEFAULT 'pending',
		payload_json TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		UNIQUE KEY idx_lead_ref (lead_reference)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

	if _, err := db.Exec(leadsTable); err != nil {
		return fmt.Errorf("error creating leads table: %w", err)
	}

	contactsTable := `
	CREATE TABLE IF NOT EXISTS contacts (
		id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		email VARCHAR(255) NOT NULL,
		phone VARCHAR(64),
		subject VARCHAR(255),
		message TEXT NOT NULL,
		status VARCHAR(64) DEFAULT 'unread',
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

	if _, err := db.Exec(contactsTable); err != nil {
		return fmt.Errorf("error creating contacts table: %w", err)
	}

	vehiclesTable := `
	CREATE TABLE IF NOT EXISTS vehicles (
		id VARCHAR(64) PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		slug VARCHAR(255) NOT NULL,
		capacity INT,
		category VARCHAR(255),
		best_for TEXT,
		image_url VARCHAR(255),
		features_json TEXT,
		available INT DEFAULT 1,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		UNIQUE KEY idx_slug (slug)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

	if _, err := db.Exec(vehiclesTable); err != nil {
		return fmt.Errorf("error creating vehicles table: %w", err)
	}

	log.Println("✅ Database tables verified/migrated.")
	return nil
}
