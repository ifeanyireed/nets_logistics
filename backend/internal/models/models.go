package models

import "time"

type Lead struct {
	ID                     uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	LeadReference          string    `json:"leadReference" gorm:"uniqueIndex;type:varchar(64);not null"`
	CustomerName           string    `json:"customerName" gorm:"type:varchar(255)"`
	CustomerEmail          string    `json:"customerEmail" gorm:"type:varchar(255)"`
	CustomerPhone          string    `json:"customerPhone" gorm:"type:varchar(64)"`
	Company                string    `json:"company" gorm:"type:varchar(255)"`
	JourneyType            string    `json:"journeyType" gorm:"type:varchar(64)"`
	Origin                 string    `json:"origin" gorm:"type:varchar(255)"`
	Destination            string    `json:"destination" gorm:"type:varchar(255)"`
	EstimatedInvestmentMin float64   `json:"estimatedInvestmentMin" gorm:"default:0"`
	EstimatedInvestmentMax float64   `json:"estimatedInvestmentMax" gorm:"default:0"`
	Status                 string    `json:"status" gorm:"type:varchar(64);default:'pending'"`
	PayloadJSON            string    `json:"-" gorm:"type:longtext"`
	Payload                any       `json:"payload,omitempty" gorm:"-"`
	CreatedAt              time.Time `json:"createdAt"`
	UpdatedAt              time.Time `json:"updatedAt"`
}

type Contact struct {
	ID        uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	Name      string    `json:"name" gorm:"type:varchar(255);not null"`
	Email     string    `json:"email" gorm:"type:varchar(255);not null"`
	Phone     string    `json:"phone" gorm:"type:varchar(64)"`
	Subject   string    `json:"subject" gorm:"type:varchar(255)"`
	Message   string    `json:"message" gorm:"type:text;not null"`
	Status    string    `json:"status" gorm:"type:varchar(64);default:'unread'"`
	CreatedAt time.Time `json:"createdAt"`
}

type Vehicle struct {
	ID              string    `json:"id" gorm:"primaryKey;type:varchar(64)"`
	Name            string    `json:"name" gorm:"type:varchar(255);not null"`
	Slug            string    `json:"slug" gorm:"uniqueIndex;type:varchar(255);not null"`
	Category        string    `json:"category" gorm:"type:varchar(255)"`
	Capacity        int       `json:"capacity"`
	BestFor         string    `json:"bestFor" gorm:"type:text"`
	ImageURL        string    `json:"imageUrl" gorm:"type:varchar(255)"`
	Features        []string  `json:"features" gorm:"-"`
	FeaturesJSON    string    `json:"-" gorm:"type:text"`
	Available       bool      `json:"available" gorm:"default:true"`
	ComfortRating   string    `json:"comfortRating" gorm:"type:varchar(64)"`
	LuggageSpace    string    `json:"luggageSpace" gorm:"type:varchar(255)"`
	AirConditioning string    `json:"airConditioning" gorm:"type:varchar(255)"`
	CreatedAt       time.Time `json:"createdAt"`
}
