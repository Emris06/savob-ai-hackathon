# Irrigation API

A Node.js Express API for smart irrigation management with weather integration and savings calculations.

## Features

- 🌤️ Weather data integration with OpenWeatherMap
- 💧 Smart irrigation recommendations based on crop type and weather
- 📝 Irrigation activity logging
- 💰 Water and cost savings calculations
- 🌍 Environmental impact tracking
- 🚀 CORS enabled for frontend integration

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp env.example .env
```

3. Add your OpenWeatherMap API key to `.env`:
```
OPENWEATHER_API_KEY=your_api_key_here
```

4. Start the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## API Endpoints

### Weather Data
- **GET** `/api/weather/:location` - Get current weather data for a location

### Irrigation Recommendations
- **GET** `/api/irrigation/:cropType/:location` - Get irrigation recommendations
  - Query parameters: `area`, `soilMoisture`, `lastIrrigation`

### Irrigation Logging
- **POST** `/api/irrigation/log` - Log irrigation activities
- **GET** `/api/irrigation/logs/:farmId` - Get irrigation logs for a farm

### Savings Calculations
- **GET** `/api/savings/:farmId` - Calculate water and cost savings
  - Query parameter: `period` (weekly, monthly, yearly)

### Farm Management
- **GET** `/api/farms` - Get all farms
- **POST** `/api/farms` - Create a new farm

### Health Check
- **GET** `/api/health` - API health status

## Example Usage

### Get Weather Data
```bash
curl http://localhost:5000/api/weather/London
```

### Get Irrigation Recommendations
```bash
curl "http://localhost:5000/api/irrigation/tomatoes/California?area=10&soilMoisture=45"
```

### Log Irrigation Activity
```bash
curl -X POST http://localhost:5000/api/irrigation/log \
  -H "Content-Type: application/json" \
  -d '{
    "farmId": "farm1",
    "cropType": "tomatoes",
    "area": 10,
    "amount": 150,
    "duration": 45,
    "zones": ["Zone A", "Zone B"],
    "notes": "Morning irrigation session"
  }'
```

### Get Savings Data
```bash
curl http://localhost:5000/api/savings/farm1?period=monthly
```

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `OPENWEATHER_API_KEY` - OpenWeatherMap API key

## Crop Types Supported

- tomatoes
- corn
- wheat
- soybeans
- lettuce
- peppers
- cucumbers

## Weather Integration

The API integrates with OpenWeatherMap to provide:
- Current temperature and humidity
- Wind speed and direction
- Precipitation data
- UV index
- Weather conditions

## Smart Recommendations

The irrigation recommendations consider:
- Crop-specific water requirements
- Current weather conditions
- Soil moisture levels
- Time since last irrigation
- Wind and precipitation forecasts

## Savings Calculations

The API calculates:
- Water savings compared to traditional methods
- Cost savings in dollars
- Efficiency improvements
- Environmental impact (CO2, energy)
- Projections for different time periods

## CORS Configuration

The API is configured to accept requests from any origin. In production, configure the `CORS_ORIGIN` environment variable to restrict access.

## Error Handling

The API includes comprehensive error handling:
- 400 - Bad Request (missing required fields)
- 404 - Not Found (location/farm not found)
- 500 - Internal Server Error
- Custom error messages for different scenarios

## Development

The API uses in-memory storage for demonstration. In production, integrate with a database like MongoDB or PostgreSQL.

## License

ISC
