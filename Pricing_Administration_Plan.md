# Dynamic Pricing Engine Calculation Plan

This document outlines how the Journey Planner form variables will interact with the Pricing Administration variables to generate a dynamic, real-time quote for the user.

## 1. Input Variables

### From the Journey Planner Form:
- **`distanceKm`**: The total routing distance in kilometers.
- **`numberOfDays`**: Derived from `tripType` (One Way, Return, Multi-Day, Recurring) and the selected dates/itinerary.
- **`selectedVehicleId`** / **`additionalVehicleIds`**: The exact vehicle(s) chosen by the customer.
- **`pickup` / `destination`**: To detect specific zone triggers (e.g., Airports).
- **`intent`**: Journey purpose (e.g., "Corporate Staff" might trigger corporate rates).

### From the Pricing Administration Dashboard:
- `fuelPricePerLitre`
- `driverDailyAllowance`
- `driverOutstationAllowance`
- `maintenanceCostPerKm`
- `minimumChargeHiace` / `minimumChargeCoaster`
- `hiaceMarkupPercent` / `coasterMarkupPercent`
- `airportSurcharge`
- `waitingChargePerHour`
- `overnightChargePerNight`
- `longDistanceThresholdKm`
- `longDistanceSurchargePercent`
- `corporateDiscountPercent`

---

## 2. Calculation Formula (Per Vehicle)

For each vehicle requested (primary + additional vehicles), the pricing engine will execute the following steps:

### Step 1: Base Operating Costs
* **Fuel Cost** = `(distanceKm / 100) × vehicleFuelEfficiency × fuelPricePerLitre`
  *(Note: Each vehicle model will have an internal benchmark for liters/100km, e.g., HiAce = 8L/100km).*
* **Maintenance Cost** = `distanceKm × maintenanceCostPerKm`
* **Driver Cost** = 
  * If Local / Single-Day: `driverDailyAllowance × numberOfDays`
  * If Outstation / Multi-Day: `driverOutstationAllowance × numberOfDays`

**`Base Cost`** = `Fuel Cost` + `Maintenance Cost` + `Driver Cost`

### Step 2: Margin & Floor Price
* **Marked-up Price** = `Base Cost × (1 + VehicleMarkupPercent / 100)`
* **Floor Price Enforcement** = `Max(Marked-up Price, VehicleMinimumCharge × numberOfDays)`

### Step 3: Event-Driven Surcharges
* **Long Distance Surcharge**: 
  If `distanceKm > longDistanceThresholdKm`, add `Floor Price × (longDistanceSurchargePercent / 100)`.
* **Airport Surcharge**: 
  If the pickup or destination string contains "Airport", "Terminal", or known IATA codes, add `airportSurcharge`.
* **Overnight Accommodations**: 
  If `numberOfDays > 1`, add `overnightChargePerNight × (numberOfDays - 1)`.

**`Subtotal`** = `Floor Price` + `Surcharges`

### Step 4: Final Modifiers
* **Corporate Rate**: 
  If the Journey Intent is "Corporate Staff" or the user is verified as a B2B partner, subtract `Subtotal × (corporateDiscountPercent / 100)`.

**`Total Vehicle Cost`** = `Subtotal` - `Discounts`

---

## 3. Journey Grand Total
If the customer has selected multiple vehicles (e.g., because passenger count exceeds one vehicle's capacity), the engine will loop through **Steps 1 to 4** for every vehicle in the array. 

**`Grand Total`** = `Sum(Total Vehicle Cost for all selected vehicles)`
