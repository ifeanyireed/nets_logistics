package handlers

import (
	"encoding/json"
	"net/http"

	"nets-logistics-backend/internal/database"
	"nets-logistics-backend/internal/models"
	"nets-logistics-backend/internal/response"
)

type PricingHandler struct{}

func NewPricingHandler() *PricingHandler {
	return &PricingHandler{}
}

// Get the latest pricing config
func (h *PricingHandler) GetConfig(w http.ResponseWriter, r *http.Request) {
	var config models.PricingConfig
	// Fetch the first/latest row
	if err := database.DB.Order("id desc").First(&config).Error; err != nil {
		// If not found, return empty JSON object, frontend will use defaults
		response.JSON(w, http.StatusOK, map[string]interface{}{
			"data": nil,
		})
		return
	}

	// Parse JSON string to return as actual JSON
	var parsedConfig map[string]interface{}
	if err := json.Unmarshal([]byte(config.ConfigJSON), &parsedConfig); err != nil {
		response.Error(w, http.StatusInternalServerError, "Failed to parse pricing config")
		return
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"data": parsedConfig,
	})
}

// Update the pricing config
func (h *PricingHandler) UpdateConfig(w http.ResponseWriter, r *http.Request) {
	var payload map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid JSON payload")
		return
	}

	// Convert back to string to store
	jsonBytes, err := json.Marshal(payload)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Failed to encode pricing config")
		return
	}

	newConfig := models.PricingConfig{
		ConfigJSON: string(jsonBytes),
	}

	if err := database.DB.Create(&newConfig).Error; err != nil {
		response.Error(w, http.StatusInternalServerError, "Failed to save pricing config")
		return
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"message": "Pricing config updated successfully",
		"data":    payload,
	})
}
