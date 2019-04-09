const API_KEY = '5f8eef4029d7a333d7a327274d23b964';
const app = document.getElementById('app');

const isLoading = (yes) => {
  app.textContent = yes ? 'Loading...' : '';
};

const getCurrentPosition = () => new Promise((resolve, reject) => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((object) => {
      const { coords: { latitude, longitude } } = object;
      resolve({ latitude, longitude });
    }, (error) => {
      reject(error);
    });
  }
});

const getCurrentWeather = (latitude, longitude) => new Promise(async (resolve, reject) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=${API_KEY}`;
  const requestWeather = await fetch(url);
  if (requestWeather.ok) {
    const {
      main: { temp }, name, sys: { country }, weather,
    } = await requestWeather.json();
    resolve({
      temperature: temp, city: name, country, ...weather[0],
    });
  }
  reject(requestWeather);
});

const dynamicBackground = (temperature) => {
  const roundedTemperature = Math.round(temperature);
  if (roundedTemperature >= 30) {
    document.body.classList.add('hell');
  }
  if (roundedTemperature < 30 && roundedTemperature > 23) {
    document.body.classList.add('hot');
  }
  if (roundedTemperature >= 18 && roundedTemperature <= 23) {
    document.body.classList.add('nice');
  }
  if (roundedTemperature < 18) {
    document.body.classList.add('cold');
  }
};

const successOutput = (weather) => {
  const {
    icon, description, temperature, city, country,
  } = weather;

  const template = `
    <div>
      <img class="image" src="assets/icons/${icon}.svg" alt="${description}">
    </div>
    <div>
      <h1 class="temperature">${Math.round(temperature)}</h1>
    </div>
    <div>
      <p class="city">${city}, ${country}</p>
    </div>
  `;

  app.innerHTML = template;
};

const errorOutput = (object) => {
  const { code, message } = object;

  const template = `
    <div>
      <div class="bg-red white pv2 ph4 radius-2 box-shadow-3">
        <p>Error code ${code}</p>
        <h3>${message}</h3>
      </div>
    </div>
  `;

  app.innerHTML = template;
};

(async () => {
  try {
    isLoading(true);
    const { latitude, longitude } = await getCurrentPosition();
    const weather = await getCurrentWeather(latitude, longitude);
    isLoading(false);
    dynamicBackground(weather.temperature);
    successOutput(weather);
  } catch (error) {
    errorOutput(error);
  }
})();
