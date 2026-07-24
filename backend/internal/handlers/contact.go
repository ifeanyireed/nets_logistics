package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"nets-logistics-backend/internal/database"
	"nets-logistics-backend/internal/models"
	"nets-logistics-backend/internal/response"
)

type ContactHandler struct{}

func NewContactHandler() *ContactHandler {
	return &ContactHandler{}
}

// Store POST /api/v1/contact
func (h *ContactHandler) Store(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		Name    string `json:"name"`
		Email   string `json:"email"`
		Phone   string `json:"phone"`
		Subject string `json:"subject"`
		Message string `json:"message"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		r.ParseForm()
		payload.Name = r.FormValue("name")
		payload.Email = r.FormValue("email")
		payload.Phone = r.FormValue("phone")
		payload.Subject = r.FormValue("subject")
		payload.Message = r.FormValue("message")
	}

	payload.Name = strings.TrimSpace(payload.Name)
	payload.Email = strings.TrimSpace(payload.Email)
	payload.Message = strings.TrimSpace(payload.Message)

	if payload.Name == "" || payload.Email == "" || payload.Message == "" {
		response.Error(w, http.StatusUnprocessableEntity, "Name, email, and message are required.")
		return
	}

	if payload.Subject == "" {
		payload.Subject = "General Inquiry"
	}

	db := database.DB
	if db == nil {
		response.JSON(w, http.StatusCreated, map[string]interface{}{
			"message": "Your message has been received. Our team will get back to you shortly.",
			"contact": map[string]interface{}{
				"name":      payload.Name,
				"email":     payload.Email,
				"subject":   payload.Subject,
				"status":    "unread",
				"createdAt": time.Now().Format(time.RFC3339),
			},
		})
		return
	}

	query := `INSERT INTO contacts (name, email, phone, subject, message, created_at) VALUES (?, ?, ?, ?, ?, NOW())`
	res, err := db.Exec(query, payload.Name, payload.Email, payload.Phone, payload.Subject, payload.Message)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, fmt.Sprintf("Failed to store contact: %v", err))
		return
	}

	id, _ := res.LastInsertId()

	contactData := map[string]interface{}{
		"id":        id,
		"name":      payload.Name,
		"email":     payload.Email,
		"subject":   payload.Subject,
		"status":    "unread",
		"createdAt": time.Now().Format(time.RFC3339),
	}

	response.JSON(w, http.StatusCreated, map[string]interface{}{
		"message": "Your message has been received. Our team will get back to you shortly.",
		"contact": contactData,
	})
}

// Index GET /api/v1/contact
func (h *ContactHandler) Index(w http.ResponseWriter, r *http.Request) {
	db := database.DB
	if db == nil {
		response.JSON(w, http.StatusOK, map[string]interface{}{"contacts": []models.Contact{}})
		return
	}

	rows, err := db.Query(`SELECT id, name, email, phone, subject, message, status, created_at FROM contacts ORDER BY id DESC LIMIT 50`)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, fmt.Sprintf("Failed to fetch contact messages: %v", err))
		return
	}
	defer rows.Close()

	var contacts []models.Contact
	for rows.Next() {
		var c models.Contact
		var phone, subject sql.NullString
		var createdAtStr sql.NullString

		if err := rows.Scan(&c.ID, &c.Name, &c.Email, &phone, &subject, &c.Message, &c.Status, &createdAtStr); err != nil {
			continue
		}

		c.Phone = phone.String
		c.Subject = subject.String
		contacts = append(contacts, c)
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"contacts": contacts,
	})
}
