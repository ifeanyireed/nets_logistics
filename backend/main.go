package main

import (
	"log"
	"net/http"
	"strings"

	"nets-logistics-backend/internal/config"
	"nets-logistics-backend/internal/database"
	"nets-logistics-backend/internal/handlers"
	"nets-logistics-backend/internal/middleware"
	"nets-logistics-backend/internal/response"
)

func main() {
	cfg := config.LoadConfig()

	log.Printf("🚀 Starting %s in [%s] mode...", cfg.AppName, cfg.Env)

	// Initialize MySQL / DB Connection
	_, err := database.InitDB(cfg)
	if err != nil {
		log.Printf("⚠️ Database warning: %v", err)
	}

	mux := http.NewServeMux()

	healthHandler := handlers.NewHealthHandler(cfg)
	leadHandler := handlers.NewLeadHandler()
	contactHandler := handlers.NewContactHandler()
	vehicleHandler := handlers.NewVehicleHandler()

	// Root Route
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			if strings.HasPrefix(r.URL.Path, "/api/v1/leads/") {
				leadHandler.Show(w, r)
				return
			}
			response.Error(w, http.StatusNotFound, "Requested endpoint not found.")
			return
		}
		response.JSON(w, http.StatusOK, map[string]interface{}{
			"message":       "Welcome to NETS Logistics REST API (Go Backend)",
			"documentation": "/api/v1/health",
			"version":       "1.0.0",
		})
	})

	// API v1 Routes
	mux.HandleFunc("/api/v1/health", healthHandler.HealthCheck)
	
	mux.HandleFunc("/api/v1/leads", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			leadHandler.Store(w, r)
		case http.MethodGet:
			leadHandler.Index(w, r)
		default:
			response.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		}
	})

	mux.HandleFunc("/api/v1/contact", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			contactHandler.Store(w, r)
		case http.MethodGet:
			contactHandler.Index(w, r)
		default:
			response.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		}
	})

	mux.HandleFunc("/api/v1/vehicles", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			vehicleHandler.Index(w, r)
		} else {
			response.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		}
	})

	// Apply CORS Middleware
	handler := middleware.CORSMiddleware(cfg.CORSAllowedOrigins, mux)

	log.Printf("🌐 Go HTTP Server listening on port %s", cfg.Port)
	if err := http.ListenAndServe(cfg.Port, handler); err != nil {
		log.Fatalf("❌ Server error: %v", err)
	}
}
