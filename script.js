const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const statusText = document.getElementById("status");
const result = document.getElementById("result");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const coords = document.getElementById("coords");
const wind = document.getElementById("wind");

async function getWeather() {
  const city = cityInput.value.trim();

  if (city === "") {
    statusText.textContent = "Введи название города!";
    return;
  }

  searchBtn.disabled = true;
  statusText.textContent = "Загрузка...";
  result.classList.add("hidden");

  try {
    const geoUrl = "https://geocoding-api.open-meteo.com/v1/search?count=1&name=" + encodeURIComponent(city);
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results) {
      statusText.textContent = "Город не найден.";
      searchBtn.disabled = false;
      return;
    }

    const place = geoData.results[0];

    const weatherUrl = "https://api.open-meteo.com/v1/forecast?current_weather=true&latitude=" + place.latitude + "&longitude=" + place.longitude;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    cityName.textContent = place.name + ", " + place.country;
    temperature.textContent = Math.round(weatherData.current_weather.temperature) + "°C";
    wind.textContent = "Ветер: " + weatherData.current_weather.windspeed + " км/ч";
   coords.textContent = "Широта: " + place.latitude + ", долгота: " + place.longitude;
    statusText.textContent = "";
    result.classList.remove("hidden");
  } catch (error) {
    statusText.textContent = "Не получилось загрузить погоду. Попробуй ещё раз.";
    console.log(error);
  }

  searchBtn.disabled = false;
}

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    getWeather();
  }
});