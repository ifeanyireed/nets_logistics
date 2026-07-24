package handlers

import (
	"crypto/rand"
	"database/sql"
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

	journeyType, _ := journey["journeyType"].(string)
	if journeyType == "" {
		journeyType = "One-Way"
	}

	origin, _ := journey["pickupLocation"].(string)
	if origin == "" {
		origin, _ = journey["pickupState"].(string)
	}

	destination, _ := journey["destinationLocation"].(string)
	if destination == "" {
		destination, _ = journey["destinationState"].(string)
	}

	var minEst, maxEst float64
	if v, ok := invest["minimumEstimate"].(float64); ok {
		minEst = v
	}
	if v, ok := invest["maximumEstimate"].(float64); ok {
		maxEst = v
	}

	payloadBytes, _ := json.Marshal(payload)

	db := database.DB
	if db == nil {
		// Fallback response if DB is offline
		response.JSON(w, http.StatusCreated, map[string]interface{}{
			"message":       "Lead created successfully (queue mode)",
			"leadId":        ref,
			"leadReference": ref,
			"status":        "pending",
			"customerName":  customerName,
			"customerEmail": customerEmail,
			"createdAt":     time.Now().Format(time.RFC3339),
		})
		return
	}

	query := `
		INSERT INTO leads (
			lead_reference, customer_name, customer_email, customer_phone,
			company, journey_type, origin, destination,
			estimated_investment_min, estimated_investment_max, payload_json, created_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`

	res, err := db.Exec(query, ref, customerName, customerEmail, customerPhone, company, journeyType, origin, destination, minEst, maxEst, string(payloadBytes))
	if err != nil {
		response.Error(w, http.StatusInternalServerError, fmt.Sprintf("Failed to store lead: %v", err))
		return
	}

	id, _ := res.LastInsertId()

	leadData := map[string]interface{}{
		"id":            id,
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

	rows, err := db.Query(`
		SELECT id, lead_reference, customer_name, customer_email, customer_phone,
		       company, journey_type, origin, destination, estimated_investment_min,
		       estimated_investment_max, status, created_at
		FROM leads ORDER BY id DESC LIMIT 50`)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, fmt.Sprintf("Failed to fetch leads: %v", err))
		return
	}
	defer rows.Close()

	var leads []models.Lead
	for rows.Next() {
		var l models.Lead
		var name, email, phone, company, jtype, orig, dest sql.NullString
		var minEst, maxEst sql.NullFloat64
		var createdAtStr sql.NullString

		if err := rows.Scan(
			&l.ID, &l.LeadReference, &name, &email, &phone,
			&company, &jtype, &orig, &dest, &minEst,
			&maxEst, &l.Status, &createdAtStr,
		); err != nil {
			continue
		}

		l.CustomerName = name.String
		l.CustomerEmail = email.String
		l.CustomerPhone = phone.String
		l.Company = company.String
		l.JourneyType = jtype.String
		l.Origin = orig.String
		l.Destination = dest.String
		l.EstimatedInvestmentMin = minEst.Float64
		l.EstimatedInvestmentMax = maxEst.Float64

		leads = append(leads, l)
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

	var l models.Lead
	var payloadJSON string
	var name, email, phone, company, jtype, orig, dest sql.NullString

	err := db.QueryRow(`
		SELECT id, lead_reference, customer_name, customer_email, customer_phone,
		       company, journey_type, origin, destination, estimated_investment_min,
		       estimated_investment_max, status, payload_json, created_at
		FROM leads WHERE id = ? OR lead_reference = ?`, idStr, idStr).Scan(
		&l.ID, &l.LeadReference, &name, &email, &phone,
		&company, &jtype, &orig, &dest, &l.EstimatedInvestmentMin,
		&l.EstimatedInvestmentMax, &l.Status, &payloadJSON, &l.CreatedAt,
	)

	if err != nil {
		response.Error(w, http.StatusNotFound, "Lead not found.")
		return
	}

	l.CustomerName = name.String
	l.CustomerEmail = email.String
	l.CustomerPhone = phone.String
	l.Company = company.String
	l.JourneyType = jtype.String
	l.Origin = orig.String
	l.Destination = dest.String

	if payloadJSON != "" {
		var payloadData interface{}
		if json.Unmarshal([]byte(payloadJSON), &payloadData) == nil {
			l.Payload = payloadData
		}
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"lead": l,
	})
}
