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

// NASA NeoWs API - Near-Earth Objects
const NASA_API_KEY = 'yALDzndsHs1nu0kv1KTtfR6ez9Wi2AVdlrTSgOS3'; // Replace with your NASA API Key
const getToday = () => new Date().toISOString().split("T")[0];
const getOneWeekFromToday = () => {
  const today = new Date();
  const oneWeekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // Add 7 days
  return oneWeekLater.toISOString().split("T")[0];
};

fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${getToday()}&end_date=${getOneWeekFromToday()}&api_key=${NASA_API_KEY}`)
  .then(response => response.json())
  .then(data => {
    const asteroidSection = document.getElementById("asteroid-data");
    asteroidSection.innerHTML = ""; // Clear default loading message

    // Extract near-Earth objects by date, and limit to top 8 results
    const nearEarthObjects = data.near_earth_objects;
    let count = 0; // Counter to limit results
    for (const date in nearEarthObjects) {
      nearEarthObjects[date].forEach((asteroid) => {
        if (count >= 8) return; // Stop once 8 objects are processed
        const name = asteroid.name;
        const closestApproach = asteroid.close_approach_data[0];
        const approachDate = closestApproach.close_approach_date;
        const distance = parseFloat(closestApproach.miss_distance.kilometers).toFixed(1);
        const velocity = parseFloat(closestApproach.relative_velocity.kilometers_per_hour).toFixed(1);

        // Append asteroid data to the asteroid section
        asteroidSection.innerHTML += `
          <div class="asteroid-entry">
            <h4>${name}</h4>
            <p><strong>Approach Date:</strong> ${approachDate}</p>
            <p><strong>Distance from Earth:</strong> ${distance} km</p>
            <p><strong>Velocity:</strong> ${velocity} km/h</p>
            <p class="source-tag">Source: NASA NeoWs</p>
          </div>
        `;
        count++;
      });
    }
  })
  .catch((error) => {
    console.error("Error fetching asteroid data:", error);
    document.getElementById("asteroid-data").innerHTML = "<p>Failed to load asteroid data.</p>";
  });

// Fetch Space.com RSS feed (using CORS proxy)
fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://www.space.com/rss'))
  .then(response => response.json())
  .then(data => {
    const rssFeedSection = document.getElementById('rss-feed');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data.contents, "text/xml");

    const items = xmlDoc.getElementsByTagName('item');
    rssFeedSection.innerHTML = ""; // Clear default loading message

    Array.from(items).forEach(item => {
      const title = item.getElementsByTagName('title')[0].textContent;
      const description = item.getElementsByTagName('description')[0].textContent;
      const link = item.getElementsByTagName('link')[0].textContent;
      const pubDate = item.getElementsByTagName('pubDate')[0].textContent;

      // Append RSS feed item to the section
      rssFeedSection.innerHTML += `
        <div class="rss-entry">
          <h4><a href="${link}" target="_blank">${title}</a></h4>
          <p>${description}</p>
          <p><strong>Published:</strong> ${new Date(pubDate).toLocaleString()}</p>
          <p class="source-tag">Source: Space.com RSS Feed</p>
        </div>
      `;
    });
  })
  .catch((error) => {
    console.error("Error fetching RSS feed:", error);
    document.getElementById('rss-feed').innerHTML = "<p>Failed to load RSS feed.</p>";
  });

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
