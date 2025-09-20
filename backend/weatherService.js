/**
 * Weather Service
 * Handles OpenWeatherMap API integration with caching and error handling
 */

const axios = require('axios');

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes cache timeout
    this.rateLimitDelay = 1000; // 1 second delay between requests
    this.lastRequestTime = 0;
    
    // Rate limiting configuration
    this.rateLimits = {
      current: { requests: 60, window: 60 * 1000 }, // 60 requests per minute
      forecast: { requests: 60, window: 60 * 1000 }, // 60 requests per minute
      onecall: { requests: 1000, window: 60 * 1000 } // 1000 requests per minute
    };
    
    this.requestCounts = {
      current: 0,
      forecast: 0,
      onecall: 0
    };
    
    this.windowStart = Date.now();
  }

  /**
   * Check if we're within rate limits
   * @param {string} endpoint - API endpoint type
   * @returns {boolean} - Whether request is allowed
   */
  isWithinRateLimit(endpoint) {
    const now = Date.now();
    
    // Reset counters if window has passed
    if (now - this.windowStart > this.rateLimits[endpoint].window) {
      this.requestCounts[endpoint] = 0;
      this.windowStart = now;
    }
    
    return this.requestCounts[endpoint] < this.rateLimits[endpoint].requests;
  }

  /**
   * Increment request counter
   * @param {string} endpoint - API endpoint type
   */
  incrementRequestCount(endpoint) {
    this.requestCounts[endpoint]++;
  }

  /**
   * Add delay to respect rate limits
   * @param {string} endpoint - API endpoint type
   */
  async respectRateLimit(endpoint) {
    if (!this.isWithinRateLimit(endpoint)) {
      const waitTime = this.rateLimits[endpoint].window - (Date.now() - this.windowStart);
      if (waitTime > 0) {
        console.log(`Rate limit reached for ${endpoint}, waiting ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        this.requestCounts[endpoint] = 0;
        this.windowStart = Date.now();
      }
    }
    
    // Add minimum delay between requests
    const timeSinceLastRequest = Date.now() - this.lastRequestTime;
    if (timeSinceLastRequest < this.rateLimitDelay) {
      await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest));
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Generate cache key
   * @param {string} type - Cache type
   * @param {string} location - Location
   * @param {Object} params - Additional parameters
   * @returns {string} - Cache key
   */
  generateCacheKey(type, location, params = {}) {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${type}:${location}:${paramString}`;
  }

  /**
   * Check if cache entry is valid
   * @param {Object} cacheEntry - Cache entry
   * @returns {boolean} - Whether cache entry is valid
   */
  isCacheValid(cacheEntry) {
    return cacheEntry && (Date.now() - cacheEntry.timestamp) < this.cacheTimeout;
  }

  /**
   * Get data from cache
   * @param {string} key - Cache key
   * @returns {Object|null} - Cached data or null
   */
  getFromCache(key) {
    const cacheEntry = this.cache.get(key);
    if (this.isCacheValid(cacheEntry)) {
      console.log(`Cache hit for key: ${key}`);
      return cacheEntry.data;
    }
    
    if (cacheEntry) {
      this.cache.delete(key); // Remove expired entry
    }
    
    return null;
  }

  /**
   * Store data in cache
   * @param {string} key - Cache key
   * @param {Object} data - Data to cache
   */
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // Clean up old cache entries periodically
    if (this.cache.size > 1000) {
      this.cleanupCache();
    }
  }

  /**
   * Clean up expired cache entries
   */
  cleanupCache() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.cacheTimeout) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Make API request with error handling
   * @param {string} url - API URL
   * @param {Object} params - Request parameters
   * @returns {Object} - API response data
   */
  async makeApiRequest(url, params = {}) {
    try {
      const response = await axios.get(url, {
        params: {
          appid: this.apiKey,
          units: 'metric',
          ...params
        },
        timeout: 10000 // 10 second timeout
      });
      
      return response.data;
    } catch (error) {
      if (error.response) {
        // API returned an error response
        const status = error.response.status;
        const message = error.response.data?.message || 'Unknown API error';
        
        if (status === 401) {
          throw new Error('Invalid OpenWeatherMap API key');
        } else if (status === 404) {
          throw new Error('Location not found');
        } else if (status === 429) {
          throw new Error('API rate limit exceeded');
        } else if (status >= 500) {
          throw new Error('OpenWeatherMap API server error');
        } else {
          throw new Error(`API error: ${message}`);
        }
      } else if (error.request) {
        // Network error
        throw new Error('Network error: Unable to reach OpenWeatherMap API');
      } else {
        // Other error
        throw new Error(`Request error: ${error.message}`);
      }
    }
  }

  /**
   * Get current weather data
   * @param {string} location - Location (city, country or coordinates)
   * @returns {Object} - Processed current weather data
   */
  async getCurrentWeather(location) {
    const cacheKey = this.generateCacheKey('current', location);
    const cachedData = this.getFromCache(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    if (!this.apiKey) {
      console.warn('OpenWeatherMap API key not configured, using mock data');
      const mockData = this.getMockCurrentWeather(location);
      this.setCache(cacheKey, mockData);
      return mockData;
    }

    try {
      await this.respectRateLimit('current');
      
      const url = `${this.baseUrl}/weather`;
      const data = await this.makeApiRequest(url, { q: location });
      
      const processedData = this.processCurrentWeatherData(data);
      this.setCache(cacheKey, processedData);
      this.incrementRequestCount('current');
      
      return processedData;
    } catch (error) {
      console.error('Error fetching current weather:', error.message);
      return this.getMockCurrentWeather(location);
    }
  }

  /**
   * Get 7-day weather forecast
   * @param {string} location - Location (city, country or coordinates)
   * @returns {Object} - Processed forecast data
   */
  async getForecast(location) {
    const cacheKey = this.generateCacheKey('forecast', location);
    const cachedData = this.getFromCache(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    if (!this.apiKey) {
      console.warn('OpenWeatherMap API key not configured, using mock data');
      const mockData = this.getMockForecast(location);
      this.setCache(cacheKey, mockData);
      return mockData;
    }

    try {
      await this.respectRateLimit('forecast');
      
      const url = `${this.baseUrl}/forecast`;
      const data = await this.makeApiRequest(url, { q: location });
      
      const processedData = this.processForecastData(data);
      this.setCache(cacheKey, processedData);
      this.incrementRequestCount('forecast');
      
      return processedData;
    } catch (error) {
      console.error('Error fetching forecast:', error.message);
      return this.getMockForecast(location);
    }
  }

  /**
   * Get comprehensive weather data (current + forecast)
   * @param {string} location - Location (city, country or coordinates)
   * @returns {Object} - Combined weather data
   */
  async getWeatherData(location) {
    try {
      const [currentWeather, forecast] = await Promise.all([
        this.getCurrentWeather(location),
        this.getForecast(location)
      ]);

      return {
        location: currentWeather.location,
        current: currentWeather,
        forecast: forecast,
        timestamp: new Date().toISOString(),
        source: this.apiKey ? 'OpenWeatherMap' : 'Mock Data'
      };
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
      throw error;
    }
  }

  /**
   * Process current weather data for irrigation calculations
   * @param {Object} data - Raw API data
   * @returns {Object} - Processed data
   */
  processCurrentWeatherData(data) {
    return {
      location: {
        name: data.name,
        country: data.sys.country,
        coordinates: {
          lat: data.coord.lat,
          lon: data.coord.lon
        }
      },
      current: {
        temperature: Math.round(data.main.temp * 10) / 10,
        feelsLike: Math.round(data.main.feels_like * 10) / 10,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        windDirection: data.wind.deg,
        visibility: data.visibility / 1000, // Convert to km
        uvIndex: data.uvi || 0,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        cloudiness: data.clouds.all,
        rain: data.rain?.['1h'] || 0,
        snow: data.snow?.['1h'] || 0
      },
      irrigation: {
        // Processed data specifically for irrigation calculations
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        solarRadiation: this.estimateSolarRadiation(data),
        precipitation: (data.rain?.['1h'] || 0) + (data.snow?.['1h'] || 0),
        condition: data.weather[0].main
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Process forecast data for irrigation calculations
   * @param {Object} data - Raw API data
   * @returns {Object} - Processed forecast data
   */
  processForecastData(data) {
    const dailyForecasts = this.groupForecastsByDay(data.list);
    
    return {
      location: {
        name: data.city.name,
        country: data.city.country,
        coordinates: {
          lat: data.city.coord.lat,
          lon: data.city.coord.lon
        }
      },
      forecasts: dailyForecasts.map(day => ({
        date: day.date,
        temperature: {
          min: Math.round(day.temp.min * 10) / 10,
          max: Math.round(day.temp.max * 10) / 10,
          average: Math.round(day.temp.avg * 10) / 10
        },
        humidity: Math.round(day.humidity.avg),
        windSpeed: Math.round(day.windSpeed.avg * 10) / 10,
        precipitation: Math.round(day.precipitation * 10) / 10,
        condition: day.condition,
        description: day.description,
        icon: day.icon,
        irrigation: {
          temperature: day.temp.avg,
          humidity: day.humidity.avg,
          windSpeed: day.windSpeed.avg,
          pressure: day.pressure.avg,
          solarRadiation: this.estimateSolarRadiationFromForecast(day),
          precipitation: day.precipitation,
          condition: day.condition
        }
      })),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Group hourly forecasts into daily forecasts
   * @param {Array} hourlyData - Hourly forecast data
   * @returns {Array} - Daily forecast data
   */
  groupForecastsByDay(hourlyData) {
    const dailyData = new Map();
    
    hourlyData.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      
      if (!dailyData.has(date)) {
        dailyData.set(date, {
          date: date,
          temp: { min: Infinity, max: -Infinity, sum: 0, count: 0 },
          humidity: { sum: 0, count: 0 },
          windSpeed: { sum: 0, count: 0 },
          pressure: { sum: 0, count: 0 },
          precipitation: 0,
          condition: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon
        });
      }
      
      const day = dailyData.get(date);
      const temp = item.main.temp;
      const humidity = item.main.humidity;
      const windSpeed = item.wind.speed;
      const pressure = item.main.pressure;
      const precipitation = (item.rain?.['3h'] || 0) + (item.snow?.['3h'] || 0);
      
      // Temperature
      day.temp.min = Math.min(day.temp.min, temp);
      day.temp.max = Math.max(day.temp.max, temp);
      day.temp.sum += temp;
      day.temp.count++;
      
      // Humidity
      day.humidity.sum += humidity;
      day.humidity.count++;
      
      // Wind speed
      day.windSpeed.sum += windSpeed;
      day.windSpeed.count++;
      
      // Pressure
      day.pressure.sum += pressure;
      day.pressure.count++;
      
      // Precipitation
      day.precipitation += precipitation;
    });
    
    // Calculate averages
    return Array.from(dailyData.values()).map(day => {
      day.temp.avg = day.temp.sum / day.temp.count;
      day.humidity.avg = day.humidity.sum / day.humidity.count;
      day.windSpeed.avg = day.windSpeed.sum / day.windSpeed.count;
      day.pressure.avg = day.pressure.sum / day.pressure.count;
      
      return day;
    }).slice(0, 7); // Return only 7 days
  }

  /**
   * Estimate solar radiation from weather data
   * @param {Object} data - Weather data
   * @returns {number} - Estimated solar radiation in MJ/m²/day
   */
  estimateSolarRadiation(data) {
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const cloudiness = data.clouds.all;
    
    // Simplified solar radiation estimation
    const baseRadiation = 20; // Base radiation in MJ/m²/day
    const cloudFactor = (100 - cloudiness) / 100;
    const tempFactor = Math.max(0.5, Math.min(1.5, temperature / 25));
    const humidityFactor = Math.max(0.7, 1 - (humidity / 100) * 0.3);
    
    return baseRadiation * cloudFactor * tempFactor * humidityFactor;
  }

  /**
   * Estimate solar radiation from forecast data
   * @param {Object} dayData - Daily forecast data
   * @returns {number} - Estimated solar radiation in MJ/m²/day
   */
  estimateSolarRadiationFromForecast(dayData) {
    const temperature = dayData.temp.avg;
    const humidity = dayData.humidity.avg;
    const cloudiness = this.estimateCloudinessFromCondition(dayData.condition);
    
    const baseRadiation = 20;
    const cloudFactor = (100 - cloudiness) / 100;
    const tempFactor = Math.max(0.5, Math.min(1.5, temperature / 25));
    const humidityFactor = Math.max(0.7, 1 - (humidity / 100) * 0.3);
    
    return baseRadiation * cloudFactor * tempFactor * humidityFactor;
  }

  /**
   * Estimate cloudiness from weather condition
   * @param {string} condition - Weather condition
   * @returns {number} - Estimated cloudiness percentage
   */
  estimateCloudinessFromCondition(condition) {
    const cloudinessMap = {
      'Clear': 0,
      'Sunny': 0,
      'Partly Cloudy': 30,
      'Cloudy': 70,
      'Overcast': 90,
      'Rain': 80,
      'Snow': 85,
      'Thunderstorm': 90,
      'Fog': 95,
      'Mist': 60
    };
    
    return cloudinessMap[condition] || 50;
  }

  /**
   * Get mock current weather data for testing
   * @param {string} location - Location
   * @returns {Object} - Mock current weather data
   */
  getMockCurrentWeather(location) {
    return {
      location: {
        name: location,
        country: 'US',
        coordinates: { lat: 37.7749, lon: -122.4194 }
      },
      current: {
        temperature: 25,
        feelsLike: 27,
        humidity: 60,
        pressure: 1013,
        windSpeed: 10,
        windDirection: 180,
        visibility: 10,
        uvIndex: 5,
        condition: 'Partly Cloudy',
        description: 'partly cloudy',
        icon: '02d',
        cloudiness: 30,
        rain: 0,
        snow: 0
      },
      irrigation: {
        temperature: 25,
        humidity: 60,
        windSpeed: 10,
        pressure: 1013,
        solarRadiation: 18.5,
        precipitation: 0,
        condition: 'Partly Cloudy'
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get mock forecast data for testing
   * @param {string} location - Location
   * @returns {Object} - Mock forecast data
   */
  getMockForecast(location) {
    const forecasts = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      forecasts.push({
        date: date.toDateString(),
        temperature: {
          min: 15 + Math.random() * 10,
          max: 25 + Math.random() * 10,
          average: 20 + Math.random() * 8
        },
        humidity: 50 + Math.random() * 30,
        windSpeed: 5 + Math.random() * 15,
        precipitation: Math.random() > 0.7 ? Math.random() * 5 : 0,
        condition: ['Clear', 'Partly Cloudy', 'Cloudy', 'Rain'][Math.floor(Math.random() * 4)],
        description: 'weather description',
        icon: '02d',
        irrigation: {
          temperature: 20 + Math.random() * 8,
          humidity: 50 + Math.random() * 30,
          windSpeed: 5 + Math.random() * 15,
          pressure: 1010 + Math.random() * 20,
          solarRadiation: 15 + Math.random() * 10,
          precipitation: Math.random() > 0.7 ? Math.random() * 5 : 0,
          condition: 'Partly Cloudy'
        }
      });
    }
    
    return {
      location: {
        name: location,
        country: 'US',
        coordinates: { lat: 37.7749, lon: -122.4194 }
      },
      forecasts,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get cache statistics
   * @returns {Object} - Cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      timeout: this.cacheTimeout,
      requestCounts: this.requestCounts,
      rateLimits: this.rateLimits
    };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    console.log('Weather cache cleared');
  }
}

module.exports = WeatherService;
