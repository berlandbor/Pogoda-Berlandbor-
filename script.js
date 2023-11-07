// Вставьте свой API-ключ OpenWeatherMap
const apiKey = '452c27213f9904c2140f7b65897bfbef';

// Инициализация карты с использованием Leaflet.js
const map = L.map('map').setView([0, 0], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// Функция для получения данных о погоде и их отображения
function getWeatherData(lat, lon) {
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ru`;
  console.log(weatherApiUrl);
  fetch(weatherApiUrl)
    .then(response => response.json())
    .then(data => {
      const weatherDescription = document.getElementById('weather-description');
      const temperature = document.getElementById('temperature');
      const pressure = document.getElementById('pressure');
      const windSpeed = document.getElementById('wind-speed');
      const precipitation = document.getElementById('precipitation');
      
      weatherDescription.textContent = `Погода: ${data.weather[0].description}`;
      temperature.textContent = `Температура: ${data.main.temp}°C`;
      pressure.textContent = `Давление: ${data.main.pressure} hPa`;
      windSpeed.textContent = `Скорость ветра: ${data.wind.speed} м/с`;
      precipitation.textContent = `Осадки: ${data.weather[0].main}`;
      
    })
    .catch(error => {
      console.error(error);
    });
}

// Функция для получения прогноза на несколько дней
/*function getWeatherForecast(lat, lon) {
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ru`;
    console.log(forecastApiUrl);
    fetch(forecastApiUrl)
      .then(response => response.json())
      .then(data => {
        const forecastList = document.getElementById('forecast-list');
        forecastList.innerHTML = '';
  
        // Выбираем данные для отображения (например, на следующие 5 дней)
        const forecastData = data.list.filter(item => item.dt_txt.includes("12:00:00"));
  
        forecastData.forEach(forecast => {
          const date = new Date(forecast.dt * 1000);
          const dateString = date.toDateString();
          const temperature = forecast.main.temp;
          const description = forecast.weather[0].description;
  
          const listItem = document.createElement('li');
          listItem.textContent = `${dateString} - Температура: ${temperature}°C, Погода: ${description}`;
          forecastList.appendChild(listItem);
        });
        
      })
      .catch(error => {
        console.error(error);
      });
  }*/

// Создайте объект с соответствиями кодов погоды и текстовыми описаниями
/*const weatherDescriptions = {
  '01d': 'Ясно (день)',
  '02d': 'Переменная облачность (день)',
  '03d': 'Облачно (день)',
  '04d': 'Пасмурно (день)',
  '09d': 'Дождь (день)',
  '10d': 'Дождь (день)',
  '11d': 'Гроза (день)',
  '13d': 'Снегопад (день)',
  '50d': 'Туман (день)',
  '01n': 'Ясно (ночь)',
  '02n': 'Переменная облачность (ночь)',
  '03n': 'Облачно (ночь)',
  '04n': 'Пасмурно (ночь)',
  '09n': 'Дождь (ночь)',
  '10n': 'Дождь (ночь)',
  '11n': 'Гроза (ночь)',
  '13n': 'Снегопад (ночь)',
  '50n': 'Туман (ночь)',
};*/

function getOneCallWeatherForecast(lat, lon) {
  const exclude = "current,minutely,hourly"; // Исключаем текущие данные, данные по минутам и почасовой прогноз
  const oneCallApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${apiKey}&units=metric&lang=ru`;

  fetch(oneCallApiUrl)
    .then(response => response.json())
    .then(data => {
      const forecastList = document.getElementById('forecast-list');
      forecastList.innerHTML = '';

      // Создаем массивы для данных графика температур и скорости ветра
      const dates = [];
      const maxTemperatures = [];
      const minTemperatures = [];
      const windSpeeds = [];

      // Создаем массив для данных графика давления
      const pressures = [];

      // Создаем массив для данных графика погоды и осадков
      const weatherCodes = [];

      // Выбираем данные для отображения (например, на следующие 5 дней)
      const dailyForecast = data.daily.slice(1, 6); // Получить данные на 5 дней, начиная со второго дня (индекс 1)

      dailyForecast.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dateString = date.toDateString();
        const maxTemperature = forecast.temp.max;
        const minTemperature = forecast.temp.min;
        const windSpeed = forecast.wind_speed; // Получаем скорость ветра
        const pressure = forecast.pressure; // Получаем давление
        const weatherCode = forecast.weather[0].icon; // Получаем код погоды

        // Добавляем данные в соответствующие массивы
        dates.push(dateString);
        maxTemperatures.push(maxTemperature);
        minTemperatures.push(minTemperature);
        windSpeeds.push(windSpeed);
        pressures.push(pressure);
        weatherCodes.push(weatherCode);

        const listItem = document.createElement('li');
        listItem.textContent = `${dateString} -  Погода: ${weatherDescriptions[weatherCode]}`;
        forecastList.appendChild(listItem);
      });

      // Создайте график с использованием Chart.js для температур и скорости ветра
      const ctx = document.getElementById('weather-chart').getContext('2d');

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [
            {
              label: 'Макс. Температура (°C)',
              data: maxTemperatures,
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              fill: false,
            },
            {
              label: 'Мин. Температура (°C)',
              data: minTemperatures,
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2,
              fill: false,
            },
            {
              label: 'Скорость ветра (м/с)',
              data: windSpeeds,
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Дата',
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Значения',
              },
            },
          },
        },
      });

      // Создайте график с использованием Chart.js для давления
      const pressureCtx = document.getElementById('pressure-chart').getContext('2d');

      new Chart(pressureCtx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [
            {
              label: 'Давление (hPa)',
              data: pressures,
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Дата',
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Давление (hPa)',
              },
            },
          },
        },
      });
      

      // Создайте график с использованием Chart.js для погоды
      const weatherCtx = document.getElementById('weather-chart1').getContext('2d');

      new Chart(weatherCtx, {
        type: 'bar',
        data: {
          labels: dates,
          datasets: [
            {
              label: 'Погода',
              data: weatherCodes,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Дата',
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Погода',
              },
              ticks: {
                callback: function (value) {
                  return weatherDescriptions[value];
                },
              },
            },
          },
        },
      });
    })
    .catch(error => {
      console.error(error);
    });
}

  





// Обработка кнопки определения местоположения
const locateButton = document.getElementById('locate-button');
locateButton.addEventListener('click', () => {
 
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError);
    
  } else {
    console.error("Геолокация не поддерживается вашим браузером.");
  }
});

// Функция для обработки успешной геолокации
function onLocationSuccess(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  map.setView([lat, lon], 13);

  // Удаляем все предыдущие маркеры с карты
  map.eachLayer(function(layer) {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  // Добавляем маркер на карту
  L.marker([lat, lon]).addTo(map);

  // Получаем данные о погоде по текущим координатам
  getWeatherData(lat, lon);
  //getWeatherForecast(lat, lon);

getOneCallWeatherForecast(lat, lon);
}

// Функция для обработки ошибки геолокации
function onLocationError(error) {
  console.error(`Ошибка геолокации: ${error.message}`);
}
// Обработка события щелчка на карте
map.on('click', function(event) {
  const lat = event.latlng.lat;
  const lon = event.latlng.lng;

  // Удаляем все предыдущие маркеры с карты
  map.eachLayer(function(layer) {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  // Добавляем маркер на карту
  L.marker([lat, lon]).addTo(map);

  // Получаем данные о погоде по координатам места, на которое пользователь кликнул
  getWeatherData(lat, lon); getOneCallWeatherForecast(lat, lon);
});
// Обработка кнопки поиска по введенному городу
const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', () => {
  const cityInput = document.getElementById('city-input');
  const cityName = cityInput.value;
  const geocodeApiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${cityName}`;
  
  fetch(geocodeApiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        map.setView([lat, lon], 13);

        // Удаляем все предыдущие маркеры с карты
        map.eachLayer(function(layer) {
          if (layer instanceof L.Marker) {
            map.removeLayer(layer);
          }
        });

        // Добавляем маркер на карту
        L.marker([lat, lon]).addTo(map);

        // Получаем данные о погоде по координатам города
        getWeatherData(lat, lon);
        //getWeatherForecast(lat, lon);
        getOneCallWeatherForecast(lat, lon);
      } else {
        console.error("Город не найден");
      }
    })
    .catch(error => {
      console.error(error);
    });
});
function обновитьСтраницу() {
  location.reload();
}

function updateTime() {
  const now = new Date();
  const timeElement = document.getElementById('time');
  const dateElement = document.getElementById('date');
  const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  
  timeElement.textContent = now.toLocaleTimeString('en-US', options);
  dateElement.textContent = now.toLocaleDateString('en-US');
}

setInterval(updateTime, 1000);
updateTime();