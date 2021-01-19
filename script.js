const weatherCard = document.querySelector(".weather-card");
const search = document.querySelector(".search");
const input = document.querySelector("input");
const searchBtn = document.querySelector(".search-btn");
const geolocationBtn = document.querySelector(".geolocation-btn");
const body = document.querySelector("body");

searchBtn.addEventListener("click", function () {
  let location = input.value;
  weather(location);
});

geolocationBtn.addEventListener("click", function () {
  navigator.geolocation.getCurrentPosition((position) => {
    findlocation(position.coords.latitude, position.coords.longitude);
  });
});

// Handle render error
function handleError(err) {
  search.placeholder = err;
  search.value = "";
  removeCard();
}

// remove card
function removeCard() {
  while (weatherCard.firstChild) {
    weatherCard.removeChild(weatherCard.firstChild);
  }
}
// Convert to C
function convertTemp(temp) {
  return Math.round(temp - 273.15);
}

// Convert wind from deg to direction
function convertDegToDirection(deg) {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
    "N",
  ];
  return directions[Math.round((deg % 360) / 22.5)];
}

const weatherColor = function (temp) {
  if (temp > 40) {
    return "#fc8403";
  } else if (temp > 30) {
    return "#56fc03";
  } else if (temp > 20) {
    return "#03fc5a";
  } else if (temp > 10) {
    return "#03fcdb";
  } else if (temp > 0) {
    return "#03f8fc";
  } else if (temp < 0) {
    return "#03f0fc";
  }
};

// Render card with fetched data

const renderWeather = function (data, image, className = "") {
  removeCard();
  let colour = weatherColor(convertTemp(data.main.temp));
  console.log(colour);
  body.style.backgroundColor = colour;
  // colorTemperatureToRGB(data.main.temp);
  // const tempC = convertTemp(data.main.temp);
  // const tempF = ((data.main.temp - 273.15) * 9) / 5 + 32;

  const html = `
   
        
        <div class=" card max-w-xl rounded overflow-hidden shadow-lg my-2">
            <img class="w-full" src="${image}" alt="Sunset in the mountains">
            <div class=" grid grid-cols-3 gap-4 px-6 py-4">
              <div class="font-bold bg-gray-200 text-xl text-center py-2 mb-2 rounded-lg">${
                data.name
              }</div>
              <p class="text-gray-600 text-base text-center">
                <span class = "text-black" >Discription:</span> <br>
                 ${data.weather[0].description}
              </p>
              <p class="text-gray-600 text-base text-center">
                <span class = "text-black" >Temperature:</span> <br>
                 ${convertTemp(data.main.temp)}°C
              </p>              
              <p class="text-gray-600 text-base text-center">
                <span class = "text-black" >Feels like:</span> 
                ${convertTemp(data.main.feels_like)}°C
              </p> 
              <p class="text-gray-600 text-base text-center">
                <span class = "text-black" >Wind:</span> 
                ${data.wind.speed}mph
              </p> 
              <p class="text-gray-600 text-base text-center">
                 <span class = "text-black" >Wind direction:</span> 
                 ${convertDegToDirection(data.wind.deg)}
              </p> 
            </div>
        </div>
    
  
  `;

  weatherCard.insertAdjacentHTML("beforeend", html);
  weatherCard.style.opacity = 1;
};

// Fetch location from lat and long

async function findlocation(lat, long) {
  try {
    const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=c8105eebae7b4212a76c2d1f7510cc67`
    );
    const data = await res.json();

    console.log(data);
    weather(data.results[0].components.city);
  } catch (err) {
    console.log(err);
  }
}

// Fetch data from openweather API

async function weather(location) {
  try {
    const res = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=f5bc8aa1ec441c86efd33124758bf528`
    );

    if (!res.ok) throw new Error("Location not found");

    const data = await res.json();

    let imageKeyWord = data.weather[0].description.replace(" ", "%20");
    console.log(imageKeyWord);

    const res2 = await fetch(
      `https://api.giphy.com/v1/gifs/translate?api_key=lqiImbhCVOOJE5Ww9ZcC9KLQ61XxndZJ&s=${imageKeyWord}`,
      { mode: "cors" }
    );

    const image = await res2.json();
    console.log(data);

    console.log(data);
    let fetchedImage = image.data.images.original.url;

    renderWeather(data, fetchedImage);
  } catch (err) {
    handleError(err);
    console.log(err);
  }
}

// navigator.geolocation.getCurrentPosition((position) => {
//     weather(position.coords.latitude, position.coords.longitude);
//   });

// weather("London");
