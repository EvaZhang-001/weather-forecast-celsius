function showTime(timestamp) {
  let time = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[time.getDay()];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[time.getMonth()];
  let date = time.getDate();
  let hour = time.getHours();
  if (hour < 10) {
    hour = `0:${hour}`;
  }

  let minute = time.getMinutes();
  if (minute < 10) {
    minute = `0:${minute}`;
  }
  return `${day}, ${month} ${date}`;
}

function forecastAPI(response) {
  let apiKey = "68987c4f78ac703ea3b4c1f3b5c684ad";
  let unit = "metric";
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.lat}&lon=${response.lon}&appid=${apiKey}&units=${unit}`;
  axios.get(url).then(forecast);
}

function showTemperature(response) {
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.main.humidity;
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.wind.speed);
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  celsiusTemperature = response.data.main.temp;
  let timeElement = document.querySelector("#time");
  timeElement.innerHTML = showTime(response.data.dt * 1000);
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  let descriptionElement = document.querySelector("#weather-description");
  descriptionElement.innerHTML = response.data.weather[0].description;

  forecastAPI(response.data.coord);
}

function showEachForecastDay(timestamp) {
  let day = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  eachDay = days[day.getDay()];
  return eachDay;
}

function forecast(response) {
  console.log(response.data.daily);
  let forecastDay = document.querySelector("#forecast-multidays");
  forecastDay.innerHTML = "";
  let eachForecastDay = response.data.daily;
  console.log(eachForecastDay);
  eachForecastDay.forEach(function (eachDay, index) {
    if (index < 5) {
      forecastDay.innerHTML += `<div class="col-sm one-forecast-day" id="one-forecast-day">
                <div class="weather-forecast-day">${showEachForecastDay(
                  eachDay.dt
                )}</div>
                <div class="weather-forecast-temperature">
                  <span class="weather-forecast-temperature-min">${Math.round(
                    eachDay.temp.min
                  )}° </span>-
                  <span class="weather-forecast-temperature-max"> ${Math.round(
                    eachDay.temp.max
                  )}°</span>
                </div>
                

                <img
                  src="http://openweathermap.org/img/wn/${
                    eachDay.weather[0].icon
                  }@2x.png"
                  alt="${eachDay.weather[0].description}"
                />
                </div>`;
    }
  });
}

function search(city) {
  let apiKey = "68987c4f78ac703ea3b4c1f3b5c684ad";
  let unit = "metric";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  axios.get(url).then(showTemperature);
  let cityName = document.querySelector("#city");
  cityName.innerHTML = city;
}

function handleSubmit(event) {
  event.preventDefault();
  let cityElement = document.querySelector("#city-input");
  search(cityElement.value);
}

function showGeoLocation(response) {
  let currentCity = response.data.address.city;
  search(currentCity);
}

function handlePosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let geoLocationUrl = `https://us1.locationiq.com/v1/reverse.php?key=pk.8dab3fe952f4d3e9a0e95f2a89b718d2&lat=${latitude}&lon=${longitude}&format=json`;
  axios.get(geoLocationUrl).then(showGeoLocation);
}
navigator.geolocation.getCurrentPosition(handlePosition);

//search("Bern");
//forecast();

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);
