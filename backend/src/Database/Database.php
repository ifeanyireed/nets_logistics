<?php

namespace App\Database;

use PDO;
use PDOException;

class Database
{
    private static ?PDO $instance = null;

    /**
     * Get or create PDO Database connection.
     */
    public static function getConnection(): PDO
    {
        if (self::$instance === null) {
            $dbPath = __DIR__ . '/../../' . ($_ENV['DB_DATABASE'] ?? 'storage/database.sqlite');
            $dir = dirname($dbPath);
            
            if (!is_dir($dir)) {
                mkdir($dir, 0755, true);
            }

            try {
                self::$instance = new PDO("sqlite:" . $dbPath);
                self::$instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                self::$instance->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

                self::migrate();
            } catch (PDOException $e) {
                throw new \RuntimeException("Database Connection Error: " . $e->getMessage());
            }
        }

        return self::$instance;
    }

    /**
     * Run lightweight automatic schema migration.
     */
    private static function migrate(): void
    {
        $pdo = self::$instance;

        // Leads Table
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lead_reference TEXT UNIQUE NOT NULL,
                customer_name TEXT,
                customer_email TEXT,
                customer_phone TEXT,
                company TEXT,
                journey_type TEXT,
                origin TEXT,
                destination TEXT,
                estimated_investment_min REAL,
                estimated_investment_max REAL,
                status TEXT DEFAULT 'pending',
                payload_json TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ");

        // Contact Inquiries Table
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                subject TEXT,
                message TEXT NOT NULL,
                status TEXT DEFAULT 'unread',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ");

        // Vehicles Cache / Catalog Table
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS vehicles (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                slug TEXT UNIQUE NOT NULL,
                capacity INTEGER,
                category TEXT,
                best_for TEXT,
                image_url TEXT,
                features_json TEXT,
                available INTEGER DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ");
    }
}
