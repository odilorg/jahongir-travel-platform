# Dual Booking Modes - API Contract

## Overview

Tours can operate in two booking modes:
- **instant**: Prices shown, direct booking with date selection
- **inquiry**: Prices hidden, users submit inquiry form

---

## Tour Response Contract

### GET /api/tours/:slug

```json
{
  "id": "clxxx123",
  "bookingMode": "instant | inquiry",

  "price": 1500.00,
  "discountedPrice": 1200.00,
  "showPrice": true,

  "pricingTiers": [
    {
      "id": "tier1",
      "minGuests": 1,
      "maxGuests": 2,
      "pricePerPerson": 1500.00,
      "label": "1-2 guests"
    }
  ],

  "departures": [
    {
      "id": "dep1",
      "startDate": "2026-03-15",
      "endDate": "2026-03-22",
      "spotsRemaining": 8,
      "status": "available"
    }
  ],

  "title": "Silk Road Adventure",
  "slug": "silk-road-adventure",
  "duration": 7,
  "images": [],
  "category": {},
  "itinerary": [],
  "faqs": []
}
```

---

## Inquiry Submission Contract

### POST /api/inquiries

**Request Body:**
```json
{
  "tourId": "clxxx123",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+998901234567",
  "travelDateFrom": "2026-04-01",
  "travelDateTo": "2026-04-10",
  "numberOfPeople": 4,
  "message": "We are interested..."
}
```

**Response (201 Created):**
```json
{
  "id": "inq_abc123",
  "status": "new",
  "message": "Thank you! We will contact you within 24 hours.",
  "createdAt": "2026-01-05T12:00:00Z"
}
```

**Validation Errors (400):**
```json
{
  "statusCode": 400,
  "message": [
    "name should not be empty",
    "email must be a valid email",
    "phone should not be empty",
    "travelDateFrom is required",
    "numberOfPeople must be at least 1"
  ],
  "error": "Bad Request"
}
```

---

## Booking Submission Contract (Instant Mode)

### POST /api/bookings

**Request Body:**
```json
{
  "tourId": "clxxx123",
  "departureId": "dep1",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+998901234567",
  "numberOfPeople": 2,
  "specialRequests": "Vegetarian meals"
}
```

**Response (201 Created):**
```json
{
  "id": "book_xyz789",
  "tourId": "clxxx123",
  "status": "pending",
  "totalPrice": 3000.00,
  "createdAt": "2026-01-05T12:00:00Z"
}
```

---

## Admin API - Update Booking Mode

### PATCH /api/tours/:id

**Request Body:**
```json
{
  "bookingMode": "inquiry"
}
```

---

## Database Schema Changes

### Tour Model Addition
```prisma
enum BookingMode {
  instant
  inquiry
}

model Tour {
  bookingMode  BookingMode @default(instant)
}
```

### TourInquiry Model Update
```prisma
model TourInquiry {
  travelDateFrom  DateTime?
  travelDateTo    DateTime?
}
```

---

## Frontend Behavior

### When bookingMode = "instant"
- Show price prominently
- Show pricing tiers table
- Show available departures calendar
- Show "Book Now" button -> opens booking form

### When bookingMode = "inquiry"
- Hide all price information
- Show "Request Quote" or "Inquire" button
- Inquiry form: name, email, phone, dates, travelers, message

---

## Validation Rules Summary

| Field | Inquiry Mode | Instant Booking |
|-------|--------------|-----------------|
| name | Required | Required |
| email | Required, valid | Required, valid |
| phone | Required | Optional |
| travelDateFrom | Required | N/A (use departureId) |
| travelDateTo | Required | N/A |
| numberOfPeople | Required, >=1 | Required, >=1 |
| departureId | N/A | Required |
| message | Optional | Optional |

---

**Contract Version:** 1.0
**Created:** 2026-01-05
**Status:** Approved for implementation
