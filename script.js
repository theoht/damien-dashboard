// Fetch NASA Image of the Day (with media type check)
fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
  .then(response => response.json())
  .then(data => {
    document.getElementById('nasa-title').textContent = data.title;
    document.getElementById('nasa-description').textContent = data.explanation;

    const imageElement = document.getElementById('nasa-image-src');
    if (data.media_type === 'image') {
      imageElement.src = data.url;
    } else {
      imageElement.alt = 'NASA media is not an image. Visit NASA for more.';
    }
  })
  .catch(error => console.log('Error fetching NASA image:', error));

// Custom weather images for each city (stored in the project root)
const cityWeatherImages = {
  'Cape Town': 'cape-town.jpg',
  'London': 'london.jpg',
  'Berlin': 'berlin.jpg'
};

// Fetch weather data from Open-Meteo for multiple cities
const cities = ['Cape Town', 'London', 'Berlin'];

cities.forEach(city => {
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${getCoordinates(city)[0]}&longitude=${getCoordinates(city)[1]}&current_weather=true&hourly=temperature_2m,precipitation,weathercode,wind_speed_10m`)
    .then(response => response.json())
    .then(data => {
      const temp = data.current_weather.temperature;
      const windSpeed = data.current_weather.windspeed; // Fixed: Correct key for wind speed
      const time = new Date().toLocaleString("en-US", { timeZone: getTimeZone(city), hour: '2-digit', minute: '2-digit' });

      const weatherIcons = {
        0: '☀️', // Clear sky
        1: '🌤️', // Partly cloudy
        2: '⛅', // Cloudy
        3: '🌧️', // Rain
        4: '🌩️', // Thunderstorm
        5: '❄️', // Snow
        6: '💨', // Windy
      };
      const weatherCode = data.current_weather.weathercode || 1; // Default to partly cloudy
      const icon = weatherIcons[weatherCode] || '🌤️';

      // Add the weather entry with images stored in the root
      document.getElementById('weather').innerHTML += `
        <div class="weather-entry">
          <img src="${cityWeatherImages[city]}" alt="${city}" class="weather-icon">
          <div>
            <h4>${city}</h4>
            <p>Temperature: ${temp}°C ${icon}</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
            <p>Local Time: ${time}</p>
          </div>
        </div>
      `;
    })
    .catch(error => console.log(`Error fetching weather for ${city}:`, error));
});

// Image Gallery Rotation (images stored in the project root)
const images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
let currentIndex = 0;

setInterval(() => {
  document.getElementById('image-gallery').innerHTML = `
    <img src="${images[currentIndex]}" alt="Image Gallery" class="gallery-image">
  `;
  currentIndex = (currentIndex + 1) % images.length;
}, 5000); // Change image every 5 seconds

// Get coordinates for cities (for Open-Meteo)
function getCoordinates(city) {
  const coordinates = {
    'Cape Town': [-33.9249, 18.4232],
    'London': [51.5074, -0.1278],
    'Berlin': [52.52, 13.4050]
  };
  return coordinates[city] || [0, 0]; // Default to [0, 0] if city is not found
}

// Get timezone for cities (for weather time)
function getTimeZone(city) {
  const timeZones = {
    'Cape Town': 'Africa/Johannesburg',
    'London': 'Europe/London',
    'Berlin': 'Europe/Berlin'
  };
  return timeZones[city] || 'UTC';
}
