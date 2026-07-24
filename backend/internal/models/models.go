package models

import "time"

type Lead struct {
	ID                     int64     `json:"id" db:"id"`
	LeadReference          string    `json:"leadReference" db:"lead_reference"`
	CustomerName           string    `json:"customerName" db:"customer_name"`
	CustomerEmail          string    `json:"customerEmail" db:"customer_email"`
	CustomerPhone          string    `json:"customerPhone" db:"customer_phone"`
	Company                string    `json:"company" db:"company"`
	JourneyType            string    `json:"journeyType" db:"journey_type"`
	Origin                 string    `json:"origin" db:"origin"`
	Destination            string    `json:"destination" db:"destination"`
	EstimatedInvestmentMin float64   `json:"estimatedInvestmentMin" db:"estimated_investment_min"`
	EstimatedInvestmentMax float64   `json:"estimatedInvestmentMax" db:"estimated_investment_max"`
	Status                 string    `json:"status" db:"status"`
	PayloadJSON            string    `json:"-" db:"payload_json"`
	Payload                any       `json:"payload,omitempty" db:"-"`
	CreatedAt              time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt              time.Time `json:"updatedAt" db:"updated_at"`
}

type Contact struct {
	ID        int64     `json:"id" db:"id"`
	Name      string    `json:"name" db:"name"`
	Email     string    `json:"email" db:"email"`
	Phone     string    `json:"phone" db:"phone"`
	Subject   string    `json:"subject" db:"subject"`
	Message   string    `json:"message" db:"message"`
	Status    string    `json:"status" db:"status"`
	CreatedAt time.Time `json:"createdAt" db:"created_at"`
}

type Vehicle struct {
	ID              string   `json:"id" db:"id"`
	Name            string   `json:"name" db:"name"`
	Slug            string   `json:"slug" db:"slug"`
	Category        string   `json:"category" db:"category"`
	Capacity        int      `json:"capacity" db:"capacity"`
	BestFor         string   `json:"bestFor" db:"best_for"`
	ImageURL        string   `json:"imageUrl" db:"image_url"`
	Features        []string `json:"features" db:"-"`
	FeaturesJSON    string   `json:"-" db:"features_json"`
	Available       bool     `json:"available" db:"available"`
	ComfortRating   string   `json:"comfortRating" db:"comfort_rating"`
	LuggageSpace    string   `json:"luggageSpace" db:"luggage_space"`
	AirConditioning string   `json:"airConditioning" db:"air_conditioning"`
}
