# API Documentation

## Overview

This document outlines the API endpoints and data structures used in the flood evacuation center dashboard.

## Data Structure

### Disaster Case
```typescript
interface DisasterCase {
  id: string;
  state: string;
  state_id: string;
  district: string;
  district_id: string;
  jumlah_mangsa: number;    // Number of victims
  jumlah_pps: number;       // Number of relief centers
  jumlah_keluarga: number;  // Number of families
  jumlah_kematian: number;  // Number of casualties
  timestamp: string;        // ISO 8601 format
}
```

### State Summary
```typescript
interface StateSummary {
  state: string;
  state_id: string;
  jumlah_mangsa: number;
  jumlah_pps: number;
  jumlah_keluarga: number;
  jumlah_kematian: number;
}
```

### District Summary
```typescript
interface DistrictSummary {
  state: string;
  district: string;
  jumlah_mangsa: number;
  jumlah_pps: number;
  jumlah_keluarga: number;
  jumlah_kematian: number;
}
```

## Endpoints

### Get Current Disasters
```
GET /api/disasters/current
```
Returns active disaster cases.

### Get Historical Data
```
GET /api/disasters/historical
```
Parameters:
- `start_date`: ISO 8601 date string
- `end_date`: ISO 8601 date string

### Get State Summary
```
GET /api/disasters/by-state
```
Returns aggregated statistics by state.

### Get District Summary
```
GET /api/disasters/by-district
```
Returns aggregated statistics by district.

## Error Handling

All endpoints return standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

Error response format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

## Rate Limiting

- 100 requests per minute per IP
- Rate limit headers included in response:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Data Updates

- Real-time data updates via WebSocket
- Endpoint: `ws://api/disasters/live`
- Updates pushed when new data is available
- Heartbeat every 30 seconds

## Authentication

Currently, the API is public and does not require authentication.

## Examples

### Fetch Current Disasters
```javascript
const response = await fetch('/api/disasters/current');
const data = await response.json();
```

### Fetch Historical Data
```javascript
const startDate = '2024-01-01T00:00:00Z';
const endDate = '2024-01-31T23:59:59Z';
const response = await fetch(
  `/api/disasters/historical?start_date=${startDate}&end_date=${endDate}`
);
const data = await response.json();
```

### WebSocket Connection
```javascript
const ws = new WebSocket('ws://api/disasters/live');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle real-time updates
};
```
