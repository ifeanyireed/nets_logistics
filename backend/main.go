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
	adminHandler := handlers.NewAdminHandler()

	// Root Route & Dynamic Sub-routes
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path
		if path == "/" {
			response.JSON(w, http.StatusOK, map[string]interface{}{
				"message":       "Welcome to NETS Logistics REST API (Go Backend)",
				"documentation": "/api/v1/health",
				"version":       "1.0.0",
			})
			return
		}

		if strings.HasPrefix(path, "/api/v1/leads/") {
			switch r.Method {
			case http.MethodGet:
				leadHandler.Show(w, r)
			case http.MethodPut, http.MethodPatch:
				leadHandler.Update(w, r)
			default:
				response.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
			}
			return
		}

		if strings.HasPrefix(path, "/api/v1/vehicles/") {
			switch r.Method {
			case http.MethodGet:
				vehicleHandler.Show(w, r)
			case http.MethodPut, http.MethodPatch:
				vehicleHandler.Update(w, r)
			case http.MethodDelete:
				vehicleHandler.Delete(w, r)
			default:
				response.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
			}
			return
		}

		response.Error(w, http.StatusNotFound, "Requested endpoint not found.")
	})

	// API v1 Routes
	mux.HandleFunc("/api/v1/health", healthHandler.HealthCheck)
	mux.HandleFunc("/api/v1/admin/stats", adminHandler.GetStats)

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
		switch r.Method {
		case http.MethodGet:
			vehicleHandler.Index(w, r)
		case http.MethodPost:
			vehicleHandler.Store(w, r)
		default:
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
