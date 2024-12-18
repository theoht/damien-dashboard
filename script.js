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
      const time = new Date().toLocaleString("en-US", { timeZone: getTimeZone(city), hour: '2-digit', minute: '2-digit' });

      const weatherIcons = { 0: '☀️', 1: '🌤️', 2: '⛅', 3: '🌧️' };
      const weatherCode = data.current_weather.weathercode || 1;
      const icon = weatherIcons[weatherCode] || '🌤️';

      document.getElementById('weather').innerHTML += 
        `<div class="weather-entry">
          <img src="${cityWeatherImages[city]}" alt="${city}" class="weather-icon">
          <div>
            <h4>${city}</h4>
            <p>Temperature: ${temp}°C ${icon}</p>
            <p>Local Time: ${time}</p>
          </div>
        </div>`;
    })
    .catch(error => console.log(`Error fetching weather for ${city}:`, error));
});

// Image gallery
const images = ['image1.jpeg', 'image2.jpeg', 'image3.jpeg', 'image4.jpeg', 'image5.jpeg', 'image6.jpeg', 'image7.jpeg'];
let currentIndex = 0;

setInterval(() => {
  document.getElementById('image-gallery').innerHTML = 
    `<img src="${images[currentIndex]}" alt="Image Gallery" class="gallery-image">`;
  currentIndex = (currentIndex + 1) % images.length;
}, 5000);

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

const marqueeContainer = document.getElementById("marquee-text");

// Your list of messages
const messages = [
  "Err and err and err again; but less, and less, and less",
  '"Damien Rocks" - Bill Gates and Warren Buffett, unprompted',
  '"Damien. Cool guy" - Lucas',
  '"Do!" - Confucius, probably',
  "Hi there!",
  "I'd like to see a Large Language Model try to get as drunk as I did yesterday.",
  '"The purpose of a system is what it does" - Wikipedia',
  "You're not supposed to drink when you're pregnant because the baby isn't 21",
  "Almonds is wood",
  "the w orld is am a ch i ne",
  "Dune appeals to the male fantasy because at its core, it is a story about a guy who has a lot of cool nicknames",
  '"getting your steps in" is such a secular way to describe something as religious as Taking a Long Walk',
  '"I always remember, [Hamming] would come into my office and try to solve a problem [...] I had a very big blackboard, and he\'d start on one side, write down some integral, say, \'I ain\'t afraid of nothin\', and start working on it. So, now, when I start a big problem, I say, \'I ain\'t afraid of nothin\', and dive into it." —Bruce MacLennan',
];

let currentMessage = 0;

function scrollMarquee() {
  const message = messages[currentMessage];
  marqueeContainer.textContent = message;

  const containerWidth = marqueeContainer.parentElement.offsetWidth;
  const textWidth = marqueeContainer.offsetWidth;

  // Reset position to the far right
  marqueeContainer.style.transform = `translateX(${containerWidth}px)`;

  // Start scrolling
  const duration = 10; // Speed in seconds for each message to scroll across
  marqueeContainer.style.transition = `transform ${duration}s linear`;
  marqueeContainer.style.transform = `translateX(-${textWidth}px)`;

  // Pause at the end before moving to the next message
  setTimeout(() => {
    currentMessage = (currentMessage + 1) % messages.length; // Move to the next message
    scrollMarquee(); // Recursively call for the next message
  }, duration * 1000 + 2000); // Add a 2-second pause at the end of each scroll
}

// Start the scrolling
scrollMarquee();