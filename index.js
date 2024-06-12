//Fazer get de data de hoje
const now = new Date();
const options = { day: "2-digit", month: "long", year: "numeric" };
const formattedDate = now.toLocaleDateString("pt-BR", options);
const spandata = (document.getElementById("w-data").innerHTML = formattedDate);
function getDayOfWeek() {
  const daysOfWeek = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];
  const current = new Date();
  const dayOfWeek = current.getDay();

  return daysOfWeek[dayOfWeek];
}
const dayOfWeek = getDayOfWeek();
document.querySelector(".week-day").innerHTML = dayOfWeek;

//Buscando a temperatura
//AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH

/*document.getElementById("city").addEventListener("input", function () {
  var city = this.value;
  getWeather(city);
});*/

async function getWeather() {
  try {
    //var city = document.getElementById("city").value;
    //console.log(city);

    await fetch(
      "https://api.openweathermap.org/data/2.5/forecast?lat=-25.97&lon=32.58&lang=pt_br&appid=47de0abea78a097e485110809ed947a9"
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        document.getElementById("location").textContent = data.city.name; //Nome da cidade atual

        ///////////////////
        const currentTemperature = data.list[0].main.temp - 273.5;
        document.querySelector(".degree-info").textContent =
          Math.round(currentTemperature) + "ºC";

        const forecastData = data.list;
        const dailyForecast = {};
        forecastData.forEach((data) => {
          //Converter todas datas a seguir para o formato 'Segunda-feira, etc'
          const day = new Date(data.dt * 1000).toLocaleDateString("pt-BR", {
            weekday: "long",
          });
          if (!dailyForecast[day]) {
            dailyForecast[day] = {
              minTemp: data.main.temp_min - 273,
              maxTemp: data.main.temp_max - 273,
              description: data.weather[0].description,
              humidity: data.main.humidity,
              windSpeed: Math.round(data.wind.speed * 3.6),
              icon: data.weather[0].icon,
            };
          } else {
            dailyForecast[day].minTemp = Math.min(
              dailyForecast[day].minTemp,
              data.main.temp_min - 273
            ) ;

            dailyForecast[day].maxTemp = Math.max(
              dailyForecast[day].maxTemp,
              data.main.temp_max - 273
            );
          }
        });
        const currentWeatherIconCode =
          dailyForecast[
            new Date().toLocaleDateString("pt-BR", { weekday: "long" })
          ].icon;
        const weatherIconElement = document.getElementById("image-cont");
        weatherIconElement.innerHTML = getWeatherIcon(currentWeatherIconCode);

        document.querySelector("#location").textContent = data.city.name;

        document.querySelector(".w-situation").textContent = dailyForecast[
          new Date().toLocaleDateString("pt-BR", { weekday: "long" })
        ].description
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        document.getElementById("percent").textContent =
          dailyForecast[
            new Date().toLocaleDateString("pt-BR", { weekday: "long" })
          ].humidity + " %";
        document.querySelector("#milis").textContent =
          dailyForecast[
            new Date().toLocaleDateString("pt-BR", { weekday: "long" })
          ].windSpeed + " km/h";

        //Adicionar temperatura dos dias seguintes
        const dayElements = document.querySelectorAll(".day-name");
        const tempElements = document.querySelectorAll(".day-temp");
        const iconElements = document.querySelectorAll(".day-icon");

        dayElements.forEach((dayElement, index) => {
          const day = Object.keys(dailyForecast)[index];
          const data = dailyForecast[day];
          dayElement.textContent = day;
          tempElements[index].textContent = `${Math.round(
            data.minTemp
          )}º / ${Math.round(data.maxTemp)}º`;
          iconElements[index].innerHTML = getWeatherIcon(data.icon);
        });
      });
  } catch (error) {
    console.error(error.message);
  }
}

function getWeatherIcon(iconCode) {
  const iconBaseUrl = "https://openweathermap.org/img/wn/";
  const iconSize = "@2x.png";
  return `<img src="${iconBaseUrl}${iconCode}${iconSize}" alt="Weather Icon">`;
}

document.addEventListener("DOMContentLoaded", function () {
  getWeather();
  setInterval(getWeather, 900000);
});
