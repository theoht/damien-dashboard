// Fetch NASA Image of the Day
fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
  .then(response => response.json())
  .then(data => {
    document.getElementById('nasa-title').textContent = data.title;
    document.getElementById('nasa-description').textContent = data.explanation;
    document.getElementById('nasa-image-src').src = data.url;
  })
  .catch(error => console.log(error));

// Fetch weather data from Open-Meteo for multiple cities
const cities = ['Cape Town', 'London', 'Berlin'];

cities.forEach(city => {
  const cityName = city === 'Kommetjie' ? 'Cape Town' : city; // Open-Meteo expects 'Cape Town' for Kommetjie

  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${getCoordinates(city)[0]}&longitude=${getCoordinates(city)[1]}&current_weather=true&hourly=temperature_2m,precipitation,weathercode,wind_speed_10m`)
    .then(response => response.json())
    .then(data => {
      const temp = data.current_weather.temperature;
      const weatherDescription = data.current_weather.weathercode;
      const windSpeed = data.current_weather.wind_speed_10m;
      const time = new Date().toLocaleString();
      const weatherIcons = {
        0: '☀️', // Clear sky
        1: '🌤️', // Partly cloudy
        2: '⛅', // Cloudy
        3: '🌧️', // Rain
        4: '🌩️', // Thunderstorm
        5: '❄️', // Snow
        6: '💨', // Windy
      };
      const icon = weatherIcons[weatherDescription] || '🌤️';

      // Add the weather entry with the image
      document.getElementById('weather').innerHTML += `
        <div class="weather-entry">
          <img src="weather-icon-placeholder.png" alt="Weather Icon"> <!-- Replace with your weather icon -->
          <div>
            <h4>${cityName}</h4>
            <p>Temperature: ${temp}°C ${icon}</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
            <p>Time: ${time}</p>
          </div>
        </div>
      `;
    })
    .catch(error => console.log(error));
});

// Image Gallery Rotation
const images = ['image1.jpg', 'image2.jpg', 'image3.jpg']; // Replace with your image paths
let currentIndex = 0;

setInterval(() => {
  document.getElementById('image-gallery').innerHTML = `<img src="${images[currentIndex]}" alt="Image Gallery">`;
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
