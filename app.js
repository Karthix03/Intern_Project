// DOM Elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const weatherDisplay = document.getElementById('weather-display');

// Weather Elements
const locationName = document.getElementById('location-name');
const currentDate = document.getElementById('current-date');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');

// WMO Weather interpretation codes (https://open-meteo.com/en/docs)
const weatherCodes = {
    0: { desc: 'Clear sky', icon: 'ri-sun-line' },
    1: { desc: 'Mainly clear', icon: 'ri-sun-cloudy-line' },
    2: { desc: 'Partly cloudy', icon: 'ri-cloudy-line' },
    3: { desc: 'Overcast', icon: 'ri-cloudy-fill' },
    45: { desc: 'Fog', icon: 'ri-foggy-line' },
    48: { desc: 'Depositing rime fog', icon: 'ri-foggy-fill' },
    51: { desc: 'Light drizzle', icon: 'ri-drizzle-line' },
    53: { desc: 'Moderate drizzle', icon: 'ri-drizzle-line' },
    55: { desc: 'Dense drizzle', icon: 'ri-drizzle-fill' },
    56: { desc: 'Light freezing drizzle', icon: 'ri-snowy-line' },
    57: { desc: 'Dense freezing drizzle', icon: 'ri-snowy-fill' },
    61: { desc: 'Slight rain', icon: 'ri-showers-line' },
    63: { desc: 'Moderate rain', icon: 'ri-rainy-line' },
    65: { desc: 'Heavy rain', icon: 'ri-rainy-fill' },
    66: { desc: 'Light freezing rain', icon: 'ri-snowy-line' },
    67: { desc: 'Heavy freezing rain', icon: 'ri-snowy-fill' },
    71: { desc: 'Slight snow fall', icon: 'ri-snowy-line' },
    73: { desc: 'Moderate snow fall', icon: 'ri-snowy-line' },
    75: { desc: 'Heavy snow fall', icon: 'ri-snowy-fill' },
    77: { desc: 'Snow grains', icon: 'ri-snowy-fill' },
    80: { desc: 'Slight rain showers', icon: 'ri-showers-line' },
    81: { desc: 'Moderate rain showers', icon: 'ri-showers-line' },
    82: { desc: 'Violent rain showers', icon: 'ri-heavy-showers-fill' },
    85: { desc: 'Slight snow showers', icon: 'ri-snowy-line' },
    86: { desc: 'Heavy snow showers', icon: 'ri-snowy-fill' },
    95: { desc: 'Thunderstorm', icon: 'ri-thunderstorms-line' },
    96: { desc: 'Thunderstorm with slight hail', icon: 'ri-thunderstorms-line' },
    99: { desc: 'Thunderstorm with heavy hail', icon: 'ri-thunderstorms-fill' },
};

// Formatting Date
const formatDate = () => {
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    return new Date().toLocaleDateString('en-US', options);
};

// UI State Management
const showLoader = () => {
    loader.classList.remove('hidden');
    weatherDisplay.classList.add('hidden');
    errorMessage.classList.add('hidden');
};

const showError = (msg) => {
    loader.classList.add('hidden');
    weatherDisplay.classList.add('hidden');
    errorMessage.classList.remove('hidden');
    errorText.textContent = msg;
};

const showWeather = () => {
    loader.classList.add('hidden');
    errorMessage.classList.add('hidden');
    weatherDisplay.classList.remove('hidden');
};

// Fetch Data Functions
const getCoordinates = async (city) => {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    const response = await fetch(geoUrl);
    
    if (!response.ok) throw new Error('Network error during geocoding.');
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
        throw new Error(`Location "${city}" not found.`);
    }
    
    return {
        lat: data.results[0].latitude,
        lon: data.results[0].longitude,
        name: data.results[0].name,
        country: data.results[0].country
    };
};

const getWeatherData = async (lat, lon) => {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;
    const response = await fetch(weatherUrl);
    
    if (!response.ok) throw new Error('Network error while fetching weather data.');
    
    const data = await response.json();
    return data.current;
};

// Main execution flow
const fetchAndDisplayWeather = async (city) => {
    showLoader();
    
    try {
        // 1. Get Lat/Lon from City Name
        const locationData = await getCoordinates(city);
        
        // 2. Get Weather Data using Lat/Lon
        const currentData = await getWeatherData(locationData.lat, locationData.lon);
        
        // 3. Process and Update UI
        updateDashboard(locationData, currentData);
        showWeather();
        
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError(error.message || 'An unexpected error occurred. Please try again later.');
    }
};

const updateDashboard = (location, current) => {
    // Location & Date
    locationName.textContent = location.country ? `${location.name}, ${location.country}` : location.name;
    currentDate.textContent = formatDate();
    
    // Core Metrics
    temperature.innerHTML = `${Math.round(current.temperature_2m)}<span class="unit">°C</span>`;
    humidity.textContent = `${Math.round(current.relative_humidity_2m)}%`;
    windSpeed.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    
    // Weather Icon and Description based on WMO code
    const weatherInfo = weatherCodes[current.weather_code] || { desc: 'Unknown', icon: 'ri-cloud-line' };
    weatherDescription.textContent = weatherInfo.desc;
    weatherIcon.innerHTML = `<i class="${weatherInfo.icon}"></i>`;
};

// Event Listeners
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        fetchAndDisplayWeather(city);
    }
});

// Load default city on init
document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayWeather('London');
});
