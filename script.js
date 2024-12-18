// Fetch Space News from a Space News API or RSS Feed
fetch('https://api.spaceflightnewsapi.net/api/v1/articles?publishedAt__gte=2024-12-01')  // Adjusted to fetch news
  .then(response => response.json())
  .then(data => {
    const spaceNewsContent = document.getElementById('space-news-content');
    if (data.results.length > 0) {
      const articles = data.results.slice(0, 3); // Display the top 3 space news articles
      spaceNewsContent.innerHTML = articles.map(article => {
        return `
          <div class="rss-entry">
            <h4><a href="${article.url}" target="_blank">${article.title}</a></h4>
            <p>${article.description}</p>
            <p class="source-tag">Source: ${article.source}</p>
          </div>
        `;
      }).join('');
    } else {
      spaceNewsContent.innerHTML = "<p>No recent space news found.</p>";
    }
  })
  .catch(error => {
    console.error("Error fetching space news:", error);
    document.getElementById('space-news-content').innerHTML = "<p>Failed to load space news.</p>";
  });

// Sky Viewer Widget for Cape Town
const skyViewer = new SkyViewer({
  container: document.getElementById('star-map'),
  location: {
    latitude: -33.9249, // Cape Town latitude
    longitude: 18.4232, // Cape Town longitude
  },
  height: 400,
  width: "100%",
});
skyViewer.start();

// Weather API fetch for multiple locations (for example, Cape Town, London, and Berlin)
const weatherApiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=-33.9249&longitude=18.4232&current_weather=true';  // Example for Cape Town
fetch(weatherApiUrl)
  .then(response => response.json())
  .then(data => {
    const weatherContainer = document.getElementById('weather');
    const weather = data.current_weather;
    weatherContainer.innerHTML = `
      <h3>Weather in Cape Town</h3>
      <div class="weather-entry">
        <img src="https://open-meteo.com/images/icons/weather-sun.png" alt="Weather icon" class="weather-icon">
        <div>
          <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
          <p><strong>Wind:</strong> ${weather.windspeed} km/h</p>
          <p><strong>Time:</strong> ${new Date(weather.time).toLocaleString()}</p>
        </div>
      </div>
    `;
  })
  .catch(error => {
    console.error("Error fetching weather data:", error);
    document.getElementById('weather').innerHTML = "<p>Failed to load weather data.</p>";
  });

// Example of rotating image gallery
const imageGallery = [
  'images/space1.jpg',
  'images/space2.jpg',
  'images/space3.jpg',
  'images/space4.jpg'
];

let currentImageIndex = 0;
const galleryContainer = document.getElementById('image-gallery');
function updateImageGallery() {
  galleryContainer.innerHTML = `
    <img src="${imageGallery[currentImageIndex]}" class="gallery-image" alt="Astronomy Image">
  `;
  currentImageIndex = (currentImageIndex + 1) % imageGallery.length;
}

// Update the image every 5 seconds
setInterval(updateImageGallery, 5000);
updateImageGallery();  // Initial image display

// Optional: Weather for London and Berlin (just as an example)
const otherCitiesWeather = [
  { city: 'London', lat: 51.5074, lon: -0.1278 },
  { city: 'Berlin', lat: 52.52, lon: 13.4050 }
];

otherCitiesWeather.forEach(city => {
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`)
    .then(response => response.json())
    .then(data => {
      const cityWeather = data.current_weather;
      const cityContainer = document.createElement('div');
      cityContainer.classList.add('weather-entry');
      cityContainer.innerHTML = `
        <h4>Weather in ${city.city}</h4>
        <img src="https://open-meteo.com/images/icons/weather-sun.png" alt="Weather icon" class="weather-icon">
        <p><strong>Temperature:</strong> ${cityWeather.temperature}°C</p>
        <p><strong>Wind:</strong> ${cityWeather.windspeed} km/h</p>
        <p><strong>Time:</strong> ${new Date(cityWeather.time).toLocaleString()}</p>
      `;
      document.getElementById('weather').appendChild(cityContainer);
    })
    .catch(error => {
      console.error(`Error fetching weather data for ${city.city}:`, error);
    });
});
