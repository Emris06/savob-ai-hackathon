# Irrigation AI Dashboard

A modern React-based irrigation management dashboard with AI-powered recommendations, weather integration, and comprehensive water usage analytics.

## Features

- **Modern Dashboard**: Real-time metrics, weather widget, and irrigation recommendations
- **Water Usage Analytics**: Interactive charts showing usage trends and efficiency metrics
- **Irrigation Calendar**: Visual calendar for scheduling and managing irrigation zones
- **Savings Calculator**: Calculate potential water and cost savings from smart irrigation
- **Mobile Responsive**: Optimized for all device sizes
- **Agricultural Theme**: Green and blue color scheme with modern UI components

## Components

- **Header**: Navigation with logo and tab switching
- **Dashboard**: Main overview with metrics, weather, and recommendations
- **WeatherWidget**: Current conditions and 5-day forecast
- **WaterUsageChart**: Interactive charts using Chart.js
- **IrrigationRecommendations**: AI-powered suggestions and alerts
- **SavingsTracker**: Track water and cost savings over time
- **IrrigationCalendar**: Visual calendar for irrigation scheduling
- **SavingsCalculator**: Calculate ROI and environmental impact

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Technologies Used

- **React 18**: Modern React with hooks
- **Tailwind CSS**: Utility-first CSS framework
- **Chart.js**: Interactive charts and graphs
- **Lucide React**: Beautiful icons
- **Date-fns**: Date manipulation utilities

## Project Structure

```
src/
├── components/
│   ├── Header.js
│   ├── Dashboard.js
│   ├── WeatherWidget.js
│   ├── WaterUsageChart.js
│   ├── IrrigationRecommendations.js
│   ├── SavingsTracker.js
│   ├── IrrigationCalendar.js
│   └── SavingsCalculator.js
├── App.js
├── index.js
└── index.css
```

## Customization

The dashboard uses a custom agricultural color scheme defined in `tailwind.config.js`:
- Agricultural Green: Various shades of green for primary actions
- Agricultural Blue: Blue tones for secondary elements and data visualization

## Features Overview

### Dashboard
- Real-time water usage metrics
- Weather conditions and forecast
- Irrigation recommendations
- Savings tracking

### Calendar
- Visual irrigation scheduling
- Zone management
- Status tracking (completed, scheduled, missed)

### Savings Calculator
- ROI calculations
- Environmental impact assessment
- System comparison tools
- Payback period analysis

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for your irrigation management needs.
