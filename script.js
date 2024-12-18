// NASA Image of the Day
fetch('https://api.nasa.gov/planetary/apod?api_key=yALDzndsHs1nu0kv1KTtfR6ez9Wi2AVdlrTSgOS3')
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

// Custom weather images
const cityWeatherImages = {
  'Cape Town': 'cape-town.png',
  'London': 'london.png',
  'Berlin': 'berlin.png'
};

// Weather API
const cities = ['Cape Town', 'London', 'Berlin'];
cities.forEach(city => {
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${getCoordinates(city)[0]}&longitude=${getCoordinates(city)[1]}&current_weather=true`)
    .then(response => response.json())
    .then(data => {
      const temp = data.current_weather.temperature;
      const windSpeed = data.current_weather.windspeed;
      const time = new Date().toLocaleString("en-US", { timeZone: getTimeZone(city), hour: '2-digit', minute: '2-digit' });

      const weatherIcons = { 0: '☀️', 1: '🌤️', 2: '⛅', 3: '🌧️' };
      const weatherCode = data.current_weather.weathercode || 1;
      const icon = weatherIcons[weatherCode] || '🌤️';

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

// Image gallery
const images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
let currentIndex = 0;

setInterval(() => {
  document.getElementById('image-gallery').innerHTML = `
    <img src="${images[currentIndex]}" alt="Image Gallery" class="gallery-image">
  `;
  currentIndex = (currentIndex + 1) % images.length;
}, 5000);

// Fetch Space News
fetch('https://api.nasa.gov/planetary/apod?api_key=yALDzndsHs1nu0kv1KTtfR6ez9Wi2AVdlrTSgOS3')
  .then(response => response.json())
  .then(data => {
    const spaceNewsContent = document.getElementById('space-news-content');
    spaceNewsContent.innerHTML = `
      <div class="rss-entry">
        <h4><a href="${data.url}" target="_blank">${data.title}</a></h4>
        <p>${data.explanation}</p>
        <p class="source-tag">Source: NASA</p>
      </div>
    `;
  })
  .catch((error) => {
    console.error("Error fetching space news:", error);
    document.getElementById('space-news-content').innerHTML = "<p>Failed to load space news.</p>";
  });

// Sky Viewer Widget for Cape Town
const skyViewer = new SkyViewer({
  container: document.getElementById('star-map'),
  location: {
    latitude: -33.9249,
    longitude: 18.4232,
  },
  height: 400,
  width: "100%",
});
skyViewer.start();

// Utility functions
function getCoordinates(city) {
  const coordinates = {
    'Cape Town': [-33.9249, 18.4232],
    'London': [51.5074, -0.1278],
    'Berlin': [52.52, 13.4050]
  };
  return coordinates[city] || [0, 0];
}

function getTimeZone(city) {
  const timeZones = {
    'Cape Town': 'Africa/Johannesburg',
    'London': 'Europe/London',
    'Berlin': 'Europe/Berlin'
  };
  return timeZones[city] || 'UTC';
}
