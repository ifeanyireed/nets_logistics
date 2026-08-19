package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"nets-logistics-backend/internal/database"
	"nets-logistics-backend/internal/models"
	"nets-logistics-backend/internal/response"
)

type LeadHandler struct{}

func NewLeadHandler() *LeadHandler {
	return &LeadHandler{}
}

// Store POST /api/v1/leads
func (h *LeadHandler) Store(w http.ResponseWriter, r *http.Request) {
	var payload map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid JSON payload provided.")
		return
	}

	// Generate Lead Reference
	randomBytes := make([]byte, 3)
	rand.Read(randomBytes)
	ref := fmt.Sprintf("NETS-LEAD-%s", strings.ToUpper(hex.EncodeToString(randomBytes)))

	// Parse fields from payload
	cust, _ := payload["customerInformation"].(map[string]interface{})
	journey, _ := payload["journeyInformation"].(map[string]interface{})
	invest, _ := payload["estimatedInvestment"].(map[string]interface{})

	customerName, _ := cust["name"].(string)
	if customerName == "" {
		customerName = "Unknown"
	}
	customerEmail, _ := cust["email"].(string)
	customerPhone, _ := cust["phone"].(string)
	company, _ := cust["company"].(string)
	heardAboutUs, _ := cust["heardAboutUs"].(string)

	journeyType, _ := journey["journeyType"].(string)
	if journeyType == "" {
		journeyType = "One-Way"
	}

	origin, _ := journey["pickupLocation"].(string)
	if origin == "" {
		origin, _ = journey["pickupState"].(string)
	}
	if origin == "" {
		if pickupMap, ok := journey["pickup"].(map[string]interface{}); ok {
			origin, _ = pickupMap["address"].(string)
		}
	}

	destination, _ := journey["destinationLocation"].(string)
	if destination == "" {
		destination, _ = journey["destinationState"].(string)
	}
	if destination == "" {
		if destMap, ok := journey["destination"].(map[string]interface{}); ok {
			destination, _ = destMap["address"].(string)
		}
	}

	var minEst, maxEst float64
	if v, ok := invest["minimumEstimate"].(float64); ok {
		minEst = v
	}
	if v, ok := invest["maximumEstimate"].(float64); ok {
		maxEst = v
	}
	if v, ok := invest["total"].(float64); ok {
		if minEst == 0 {
			minEst = v
		}
		if maxEst == 0 {
			maxEst = v
		}
	}

	payloadBytes, _ := json.Marshal(payload)

	status := "pending"
	if payInfo, ok := payload["paymentInformation"].(map[string]interface{}); ok {
		if s, ok := payInfo["status"].(string); ok && s != "" {
			status = s
		}
	}

	lead := models.Lead{
		LeadReference:          ref,
		CustomerName:           customerName,
		CustomerEmail:          customerEmail,
		CustomerPhone:          customerPhone,
		Company:                company,
		HeardAboutUs:           heardAboutUs,
		JourneyType:            journeyType,
		Origin:                 origin,
		Destination:            destination,
		EstimatedInvestmentMin: minEst,
		EstimatedInvestmentMax: maxEst,
		Status:                 status,
		PayloadJSON:            string(payloadBytes),
	}

	db := database.DB
	if db != nil {
		var closer models.User
		if err := db.Where("role = ?", "sales_closer").Order("RAND()").First(&closer).Error; err == nil {
			lead.AssignedTo = closer.ID
		}
		
		if err := db.Create(&lead).Error; err != nil {
			response.Error(w, http.StatusInternalServerError, fmt.Sprintf("Failed to store lead in DB: %v", err))
			return
		}
	}

	leadData := map[string]interface{}{
		"id":            lead.ID,
		"leadId":        ref,
		"leadReference": ref,
		"status":        "pending",
		"customerName":  customerName,
		"customerEmail": customerEmail,
		"createdAt":     time.Now().Format(time.RFC3339),
	}

	response.JSON(w, http.StatusCreated, map[string]interface{}{
		"message": "Lead created successfully",
		"lead":    leadData,
	})
}

// Index GET /api/v1/leads
func (h *LeadHandler) Index(w http.ResponseWriter, r *http.Request) {
	db := database.DB
	if db == nil {
		response.JSON(w, http.StatusOK, map[string]interface{}{"leads": []models.Lead{}})
		return
	}

	var leads []models.Lead
	if err := db.Order("id desc").Limit(50).Find(&leads).Error; err != nil {
		response.Error(w, http.StatusInternalServerError, fmt.Sprintf("Failed to fetch leads: %v", err))
		return
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"leads": leads,
	})
}

// Show GET /api/v1/leads/{id}
func (h *LeadHandler) Show(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/api/v1/leads/")

	db := database.DB
	if db == nil || idStr == "" {
		response.Error(w, http.StatusNotFound, "Lead not found.")
		return
	}

	var lead models.Lead
	if err := db.Where("id = ? OR lead_reference = ?", idStr, idStr).First(&lead).Error; err != nil {
		response.Error(w, http.StatusNotFound, "Lead not found.")
		return
	}

	if lead.PayloadJSON != "" {
		var payloadData interface{}
		if json.Unmarshal([]byte(lead.PayloadJSON), &payloadData) == nil {
			lead.Payload = payloadData
		}
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"lead": lead,
	})
}

// Update PUT /api/v1/leads/{id}
func (h *LeadHandler) Update(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/api/v1/leads/")

	db := database.DB
	if db == nil || idStr == "" {
		response.Error(w, http.StatusNotFound, "Lead not found.")
		return
	}

	var body struct {
		Status    string `json:"status"`
		CrmStatus string `json:"crmStatus"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid JSON payload")
		return
	}

	var lead models.Lead
	if err := db.Where("id = ? OR lead_reference = ?", idStr, idStr).First(&lead).Error; err != nil {
		response.Error(w, http.StatusNotFound, "Lead not found.")
		return
	}

	updates := make(map[string]interface{})
	if body.Status != "" {
		lead.Status = body.Status
		updates["status"] = body.Status
	}
	if body.CrmStatus != "" {
		lead.CrmStatus = body.CrmStatus
		updates["crm_status"] = body.CrmStatus
	}

	if len(updates) > 0 {
		db.Model(&lead).Updates(updates)
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"message": "Lead status updated successfully",
		"lead":    lead,
	})
}

// Delete DELETE /api/v1/leads/{id}
func (h *LeadHandler) Delete(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/api/v1/leads/")

	db := database.DB
	if db == nil || idStr == "" {
		response.Error(w, http.StatusNotFound, "Lead not found.")
		return
	}

	var lead models.Lead
	if err := db.Where("id = ? OR lead_reference = ?", idStr, idStr).First(&lead).Error; err != nil {
		response.Error(w, http.StatusNotFound, "Lead not found.")
		return
	}

	if err := db.Delete(&lead).Error; err != nil {
		response.Error(w, http.StatusInternalServerError, "Failed to delete lead")
		return
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"message": "Lead deleted successfully",
	})
}
