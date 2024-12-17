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
const images = ["image1.png", "image2.png", "image3.png"];
let currentImageIndex = 0;

function rotateImage() {
    const imageElement = document.getElementById("rotating-image");
    currentImageIndex = (currentImageIndex + 1) % images.length;
    imageElement.src = images[currentImageIndex];
}

setInterval(rotateImage, 5000); // Change image every 5 seconds
