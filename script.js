// 1. Fetch Weather Data using Open-Meteo API
async function fetchWeather(latitude, longitude, locationName, elementId) {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );

        const data = await response.json();
        const weather = data.current_weather;

        // Insert weather data into the HTML
        document.getElementById(elementId).innerHTML = `
            <strong>${locationName}:</strong> ${weather.temperature}°C, Wind: ${weather.windspeed} km/h
        `;
    } catch (error) {
        console.error("Error fetching weather:", error);
        document.getElementById(elementId).innerHTML = `Failed to load weather for ${locationName}`;
    }
}

// Load Weather on Page Load
document.addEventListener("DOMContentLoaded", () => {
    fetchWeather(-33.92, 18.42, "Cape Town", "weather-cape-town");
    fetchWeather(-34.14, 18.33, "Kommetjie", "weather-kommetjie");
});

// 2. Note-taking Section Logic
function saveNote() {
    const input = document.getElementById("note-input");
    const notesContainer = document.getElementById("saved-notes");
    const note = input.value.trim();

    if (note) {
        const noteElement = document.createElement("div");
        noteElement.className = "note";
        noteElement.textContent = note;

        // Add delete functionality
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => notesContainer.removeChild(noteElement);

        noteElement.appendChild(deleteBtn);
        notesContainer.appendChild(noteElement);
        input.value = "";
    }
}

// 3. Rotating Images Logic
const images = ["image1.jpg", "image2.jpg", "image3.jpg"];
let currentImageIndex = 0;

function rotateImage() {
    const imageElement = document.getElementById("rotating-image");
    currentImageIndex = (currentImageIndex + 1) % images.length;
    imageElement.src = images[currentImageIndex];
}

setInterval(rotateImage, 5000); // Change image every 5 seconds

// 4. NASA Astronomy Picture of the Day (APOD)
async function fetchNASAAPOD() {
    const apiKey = "DEMO_KEY"; // Replace "DEMO_KEY" with your NASA API key
    const apodContainer = document.getElementById("apod-content");

    try {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
        const data = await response.json();

        // Display the APOD content
        apodContainer.innerHTML = `
            <h3>${data.title}</h3>
            <img src="${data.url}" alt="${data.title}" width="100%">
            <p>${data.explanation}</p>
        `;
    } catch (error) {
        console.error("Error fetching NASA APOD:", error);
        apodContainer.innerHTML = `<p>Failed to load NASA's Astronomy Picture of the Day.</p>`;
    }
}

// Load NASA APOD on Page Load
document.addEventListener("DOMContentLoaded", fetchNASAAPOD);
