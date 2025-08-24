// Weather Forecast Functionality
const WEATHER_API_KEY = 'demo'; // In production, use a real API key
const LAGOS_COORDS = { lat: 6.5244, lon: 3.3792 };

// Load Weather Forecast
async function loadWeatherForecast() {
    try {
        // For demo purposes, we'll use mock data
        // In production, replace with actual API call to OpenWeatherMap or similar service
        const mockWeatherData = getMockWeatherData();
        displayWeatherForecast(mockWeatherData);
        updateCurrentWeather(mockWeatherData[0]);
    } catch (error) {
        console.error('Error loading weather:', error);
        displayWeatherError();
    }
}

// Get Mock Weather Data
function getMockWeatherData() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const conditions = [
        { icon: 'fa-sun', desc: 'Sunny', temp: 32 },
        { icon: 'fa-cloud-sun', desc: 'Partly Cloudy', temp: 30 },
        { icon: 'fa-cloud', desc: 'Cloudy', temp: 28 },
        { icon: 'fa-cloud-rain', desc: 'Light Rain', temp: 26 },
        { icon: 'fa-cloud-sun-rain', desc: 'Scattered Showers', temp: 27 }
    ];
    
    return days.map((day, index) => {
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        return {
            day: day,
            date: new Date(Date.now() + (index * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            temp: condition.temp + Math.floor(Math.random() * 3) - 1,
            tempMin: condition.temp - 2,
            tempMax: condition.temp + 2,
            condition: condition.desc,
            icon: condition.icon,
            humidity: 60 + Math.floor(Math.random() * 30),
            windSpeed: 5 + Math.floor(Math.random() * 10)
        };
    });
}

// Display Weather Forecast
function displayWeatherForecast(weatherData) {
    const container = document.getElementById('weatherForecast');
    if (!container) return;
    
    let html = '';
    
    weatherData.forEach((day, index) => {
        const isToday = index === 0;
        html += `
            <div class="bg-gray-700 rounded-lg p-4 text-center ${isToday ? 'ring-2 ring-yellow-500' : ''} hover:bg-gray-600 transition-all">
                ${isToday ? '<span class="text-xs text-yellow-400 font-semibold">TODAY</span>' : ''}
                <p class="text-white font-semibold ${isToday ? 'mt-1' : ''}">${day.day}</p>
                <p class="text-gray-400 text-xs">${day.date}</p>
                
                <div class="my-4 weather-icon">
                    <i class="fas ${day.icon} text-4xl ${
                        day.icon.includes('sun') ? 'text-yellow-400' :
                        day.icon.includes('rain') ? 'text-blue-400' :
                        'text-gray-400'
                    }"></i>
                </div>
                
                <p class="text-white text-2xl font-bold">${day.temp}°C</p>
                <p class="text-gray-400 text-xs mt-1">
                    <span class="text-blue-400">${day.tempMin}°</span> / 
                    <span class="text-red-400">${day.tempMax}°</span>
                </p>
                
                <p class="text-gray-300 text-xs mt-2">${day.condition}</p>
                
                <div class="mt-3 space-y-1 text-xs text-gray-400">
                    <div class="flex justify-between">
                        <span><i class="fas fa-tint mr-1"></i></span>
                        <span>${day.humidity}%</span>
                    </div>
                    <div class="flex justify-between">
                        <span><i class="fas fa-wind mr-1"></i></span>
                        <span>${day.windSpeed} km/h</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Update Current Weather Widget
function updateCurrentWeather(currentWeather) {
    const widget = document.getElementById('weatherWidget');
    if (!widget) return;
    
    widget.innerHTML = `
        <i class="fas ${currentWeather.icon} text-2xl ${
            currentWeather.icon.includes('sun') ? 'text-yellow-400' :
            currentWeather.icon.includes('rain') ? 'text-blue-400' :
            'text-gray-400'
        }"></i>
        <div>
            <p class="text-white text-sm font-semibold">${currentWeather.temp}°C</p>
            <p class="text-xs text-gray-400">Lagos</p>
        </div>
    `;
}

// Display Weather Error
function displayWeatherError() {
    const container = document.getElementById('weatherForecast');
    if (!container) return;
    
    container.innerHTML = `
        <div class="col-span-5 bg-gray-700 rounded-lg p-8 text-center">
            <i class="fas fa-exclamation-triangle text-yellow-400 text-3xl mb-3"></i>
            <p class="text-gray-300">Unable to load weather data</p>
            <p class="text-gray-500 text-sm mt-2">Please check your connection and try again</p>
            <button onclick="loadWeatherForecast()" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-all">
                <i class="fas fa-redo mr-2"></i>Retry
            </button>
        </div>
    `;
}

// Real Weather API Integration (for production)
async function fetchRealWeatherData() {
    const API_KEY = 'your_openweathermap_api_key'; // Replace with actual API key
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAGOS_COORDS.lat}&lon=${LAGOS_COORDS.lon}&appid=${API_KEY}&units=metric`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Process the API response
        const dailyData = processDailyForecast(data.list);
        return dailyData;
    } catch (error) {
        console.error('Weather API error:', error);
        throw error;
    }
}

// Process Daily Forecast from API
function processDailyForecast(forecastList) {
    const dailyData = {};
    
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        
        if (!dailyData[date]) {
            dailyData[date] = {
                temps: [],
                weather: item.weather[0],
                humidity: item.main.humidity,
                windSpeed: item.wind.speed
            };
        }
        
        dailyData[date].temps.push(item.main.temp);
    });
    
    // Convert to array and calculate daily averages
    return Object.keys(dailyData).slice(0, 5).map(date => {
        const data = dailyData[date];
        const temps = data.temps;
        
        return {
            date: date,
            temp: Math.round(temps.reduce((a, b) => a + b) / temps.length),
            tempMin: Math.round(Math.min(...temps)),
            tempMax: Math.round(Math.max(...temps)),
            condition: data.weather.main,
            icon: getWeatherIcon(data.weather.icon),
            humidity: data.humidity,
            windSpeed: Math.round(data.windSpeed * 3.6) // Convert m/s to km/h
        };
    });
}

// Get Weather Icon
function getWeatherIcon(iconCode) {
    const iconMap = {
        '01d': 'fa-sun',
        '01n': 'fa-moon',
        '02d': 'fa-cloud-sun',
        '02n': 'fa-cloud-moon',
        '03d': 'fa-cloud',
        '03n': 'fa-cloud',
        '04d': 'fa-cloud',
        '04n': 'fa-cloud',
        '09d': 'fa-cloud-showers-heavy',
        '09n': 'fa-cloud-showers-heavy',
        '10d': 'fa-cloud-sun-rain',
        '10n': 'fa-cloud-moon-rain',
        '11d': 'fa-bolt',
        '11n': 'fa-bolt',
        '13d': 'fa-snowflake',
        '13n': 'fa-snowflake',
        '50d': 'fa-smog',
        '50n': 'fa-smog'
    };
    
    return iconMap[iconCode] || 'fa-cloud';
}

// Auto-refresh weather every 30 minutes
setInterval(() => {
    loadWeatherForecast();
}, 30 * 60 * 1000);

// Export functions
window.loadWeatherForecast = loadWeatherForecast;