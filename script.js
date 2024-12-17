// Fetching weather data for Cape Town and Kommetjie
async function fetchWeather() {
    const capeTownElement = document.getElementById('cape-town-weather');
    const kommetjieElement = document.getElementById('kommetjie-weather');

    try {
        const responseCapeTown = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-33.9249&longitude=18.4241&current_weather=true');
        const dataCapeTown = await responseCapeTown.json();
        if (dataCapeTown && dataCapeTown.current_weather) {
            capeTownElement.innerHTML = `<p>Cape Town: ${dataCapeTown.current_weather.temperature}°C</p>`;
        } else {
            throw new Error("No weather data available");
        }
    } catch (error) {
        console.error('Error fetching weather for Cape Town:', error);
        capeTownElement.innerHTML = '<p>Error fetching weather data.</p>';
    }

    try {
        const responseKommetjie = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-34.1208&longitude=18.4362&current_weather=true');
        const dataKommetjie = await responseKommetjie.json();
        if (dataKommetjie && dataKommetjie.current_weather) {
            kommetjieElement.innerHTML = `<p>Kommetjie: ${dataKommetjie.current_weather.temperature}°C</p>`;
        } else {
            throw new Error("No weather data available");
        }
    } catch (error) {
        console.error('Error fetching weather for Kommetjie:', error);
        kommetjieElement.innerHTML = '<p>Error fetching weather data.</p>';
    }
}

// Fetching NASA Image of the Day
async function fetchNASAAPOD() {
    const nasaImageElement = document.getElementById('nasa-image');
    const astronomyInfoElement = document.getElementById('astronomy-info');

    try {
        const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=yALDzndsHs1nu0kv1KTtfR6ez9Wi2AVdlrTSgOS3');
        const data = await response.json();

        if (data && data.url) {
            nasaImageElement.src = data.url;
            astronomyInfoElement.innerHTML = `<p>${data.title}</p><p>${data.explanation}</p>`;
        } else {
            throw new Error("No data found for NASA APOD");
        }
    } catch (error) {
        console.error('Error fetching NASA APOD:', error);
        astronomyInfoElement.innerHTML = '<p>Error fetching NASA data.</p>';
    }
}

// Initialize the fetch functions
window.onload = function() {
    fetchWeather();
    fetchNASAAPOD();
};
