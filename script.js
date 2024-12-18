// NASA Image of the Day
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

// Custom weather images
const cityWeatherImages = {
  'Cape Town': 'cape-town.jpg',
  'London': 'london.jpg',
  'Berlin': 'berlin.jpg'
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

// Astronomy events and space news
const fetchAstronomicalEvents = async () => {
  const response = await fetch('https://api.astronomyapi.com/api/v2/bodies/positions', {
    headers: { Authorization: 'Bearer YOUR_API_KEY' }
  });
  const data = await response.json();

  return data?.data?.map(event => ({
    title: event.name,
    date: new Date(event.timestamp * 1000).toLocaleDateString(),
    description: `This is an event related to ${event.name}.`
  }));
};

const fetchSpaceNews = async () => {
  const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.space.com/feeds/all');
  const data = await response.json();

  return data.items.map(article => ({
    title: article.title,
    date: new Date(article.pubDate).toLocaleDateString(),
    description: article.description
  }));
};

const displayData = async () => {
  const eventsList = document.getElementById('events-list');
  try {
    const [astroEvents, spaceNews] = await Promise.all([fetchAstronomicalEvents(), fetchSpaceNews()]);

    const combinedData = [...astroEvents, ...spaceNews].sort((a, b) => new Date(a.date) - new Date(b.date));
    const eventsHtml = combinedData.map(item => `
      <li>
        <h4>${item.title}</h4>
        <p><strong>Date:</strong> ${item.date}</p>
        <p>${item.description}</p>
      </li>
    `).join('');

    eventsList.innerHTML = eventsHtml || '<li>No events or news found.</li>';
  } catch (error) {
    eventsList.innerHTML = '<li>Error loading data.</li>';
  }
};

displayData();

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
