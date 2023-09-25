const searchButton = document.querySelector(".search-btn");
const weatherCardsDiv = document.querySelector(".weather-cards");
const currentWeatherDiv = document.querySelector(".current-weather");
const cityInput = document.querySelector(".city-input");

const API_KEY = "e3da8ed6332bd2eacf01780f9e47d0fb";

const  createWeatherCards  =(cityName,weatherItem, index)=>{
    if(index=== 0){    //main weather card 
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="Weather icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`
    }
    else{
      return ` <li class="cards">
                <h3>${weatherItem.dt_txt.split(" ")[0]}</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="Weather icon">
                <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                <h4>Humidity: ${weatherItem.main.humidity}</h4>
            </li>`
    }
} 
const getWeatherDetails = (cityName, lat, lon) =>{
    const WEATHER_API_URL =`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(WEATHER_API_URL)
    .then((res)=>{
        return res.json();
    })
    .then((data)=>{
        const uniqueForecastDays = [];
        const fiveDaysdataForecast = data.list.filter(forecast =>{
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
               return uniqueForecastDays.push(forecastDate)
            }
        });
        //clear previous weather info
        cityInput.value = "";
        currentWeatherDiv.innerHTML="";
        weatherCardsDiv.innerHTML ="";
        fiveDaysdataForecast.forEach((weatherItem, index) => {
            if(index === 0){
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCards(cityName, weatherItem, index));
            }else{
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCards(cityName, weatherItem, index));
            }   
        })
    }).catch((err)=>{
        alert(err);
    })
}
const getCityCoordinates = ()=>{
    const cityName = cityInput.value.trim()//remove extra spaces from user input 
    if(!cityName) return;
    const APT_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`; 
    //getting city coordinates name,lat,lon 
    fetch(APT_URL)
    .then((res)=>{
        return res.json();
    })
    .then((data)=>{
        if(!data.length) return alert("Enter the City Name Properly");
        const { name, lat, lon} = data[0];
        getWeatherDetails(name, lat, lon)
    }).catch((err)=>{
        alert(err);
    })
}
searchButton.addEventListener("click", getCityCoordinates);
