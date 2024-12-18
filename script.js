// NASA NeoWs API Key
const NASA_API_KEY = "DEMO_KEY"; // Replace with your NASA API Key

// Fetch Near-Earth Objects (NEOs) from NASA's NeoWs API
fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${getToday()}&end_date=${getOneWeekFromToday()}&api_key=${NASA_API_KEY}`)
  .then(response => response.json())
  .then(data => {
    const asteroidSection = document.getElementById("asteroid-data");
    asteroidSection.innerHTML = ""; // Clear default loading message

    // Extract near-Earth objects by date
    const nearEarthObjects = data.near_earth_objects;

    for (const date in nearEarthObjects) {
      nearEarthObjects[date].forEach((asteroid) => {
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
      });
    }
  })
  .catch((error) => {
    console.error("Error fetching asteroid data:", error);
    document.getElementById("asteroid-data").innerHTML = "<p>Failed to load asteroid data.</p>";
  });

// Fetch Space.com RSS feed
fetch('https://www.space.com/rss')
  .then(response => response.text())
  .then(data => {
    const rssFeedSection = document.getElementById('rss-feed');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "text/xml");

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

// Utility Functions
function getToday() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

function getOneWeekFromToday() {
  const today = new Date();
  const oneWeekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // Add 7 days
  return oneWeekLater.toISOString().split("T")[0];
}
