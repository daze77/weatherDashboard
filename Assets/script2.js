// global variables
var day = new Date()
console.log(day)

var newDate = day.toLocaleDateString()
console.log(newDate)

var fiveDW
var tempdaily
var search
var citySearched
var weatherList = JSON.parse(localStorage.getItem("weatherList")) || [];
 



// cityList function to list all the cities searched
function cityList(){
    var citybutton = document.querySelector('#citiesSearched')
    citybutton.innerHTML = ""
    console.log(weatherList)
    var wlLength = weatherList.length
    console.log(wlLength)
    for (i = 0; i < wlLength; i++) {
    var citySearched = weatherList[i].city
    citybutton.innerHTML += `<button type="button" onclick='cityListbtnPush("${citySearched}")' class="btn btn-light d-block w-100 text-start"> ${citySearched} </button` 
    }
    console.log(citySearched)
    
}

function cityListbtnPush(city){
    search = city
    console.log("City List Button Pushed")
    console.log(search)
    weatherAPISearch()
}


// search button
function btnClick(){
    // event.preventDefault();
    console.log("ButtonClicked");
    search = document.querySelector('input').value

    // starts the weather API search
    weatherAPISearch()
}

async function weatherAPISearch(){
    // event.preventDefault()
     // search for weather
     var weatherData = await fetch( 'https://api.openweathermap.org/data/2.5/weather?appid=96cb0c8c08593af5ccd43266287d1a3d&units=metric&q='+encodeURI( search) ).then( r=>r.json() )

     // lat and lon for location by name performed using API above - needed for one call API below
     var weatherLat = weatherData.coord.lat
     var weatherLon = weatherData.coord.lon

    // use of one call api as the UV api is depricated - begining April 2021 also pull five day forcast from here
    oneCallAPI = await fetch ('https://api.openweathermap.org/data/2.5/onecall?appid=96cb0c8c08593af5ccd43266287d1a3d&exclude=hourly,minutely&units=metric&lat=' + (weatherLat) + '&lon=' +(weatherLon)).then( r =>r.json() )

    //console log test to ensure data is being pulled
    console.log(weatherData)
    console.log(weatherData.name)
    console.log(weatherData.main.temp)
    console.log(weatherData.main.humidity)
    console.log(weatherData.wind.speed)
    console.log(weatherData.weather[0].icon)
    console.log(oneCallAPI)
    console.log(oneCallAPI.current.uvi)

    var iconCode = weatherData.weather[0].icon
    console.log(iconCode)
    var iconURL = `http://openweathermap.org/img/wn/${iconCode}.png`
    console.log(iconURL)
    var UVIndex = oneCallAPI.current.uvi
    console.log(UVIndex)
    // start the get weather function and pass the following api details through
    getWeather(weatherData.name, weatherData.main.temp, weatherData.main.humidity, weatherData.wind.speed, UVIndex, iconURL) 

    // save daily forecast to fiveDW variable
    var fiveDW = oneCallAPI.daily
    console.log(fiveDW) 

    // run both the fiveDayForecast and saveCity search functions
    fiveDayForecast(fiveDW)
    
    
    if (weatherList.find(weatherList => weatherList.city === search)){
        console.log ("already on list")
    } else {
        saveCity(weatherData.name) 
    }
}




// pull information from API to the main dashboard
function getWeather(city, citytemp, humidity, windspeed, UV, icon){
    document.querySelector('#weatherCity').innerHTML = `<h4 class = "d-inline">${city} (${newDate})</h4><img src="${icon}"/>`;
    document.querySelector("#weatherTemp").innerHTML = citytemp + ` &#8451;` ;
    document.querySelector("#weatherHum").innerHTML = humidity + `%`;
    document.querySelector('#weatherWind').innerHTML = Math.round((windspeed*3.6)) + " km/h";
    document.querySelector('#weatherUV').innerHTML = UV;

    // determine the color code of the UV index result
    if (UV <= 2){
        document.querySelector('#weatherUV').style.backgroundColor = "green";
    }
    else if (UV >=2.000001 && UV <=5){
        document.querySelector('#weatherUV').style.backgroundColor = "yellow";
    }
    else if (UV >=5.00001 && UV <=7){
        document.querySelector('#weatherUV').style.backgroundColor = "orange";
    }
    else if (UV >=7.00001 && UV <=10){
        document.querySelector('#weatherUV').style.backgroundColor = "red";
    }
    else {
        document.querySelector('#weatherUV').style.backgroundColor = "Violet";
    }
}


// save city search function
function saveCity(search){
    // console log the weather list variable which is a pull from locastorage
    console.log(weatherList)
    console.log(search)
    // set current search to a variable
    var currentWeatherSearch = {
        city : search,
    }
    console.log(currentWeatherSearch)
    // push the current city into the local storage string
    weatherList.push(currentWeatherSearch)

    //push updated string to local storage
    localStorage.setItem("weatherList", JSON.stringify(weatherList));

    // run city list function
    cityList(weatherList)
}


// populate the five day forecast
function fiveDayForecast(fiveDW){
    const fiveDayWeather = document.querySelector('#fiveDayTemp')
    fiveDayWeather.innerHTML = " "
    console.log(`this is fiveDW`, fiveDW)
   for (i = 1; i < 6; i++){ 
   var iconCodeFD = fiveDW[i].weather[0].icon 
   var weatherIconFD =  `http://openweathermap.org/img/wn/${iconCodeFD}.png`
//    var fivedayTemp = document.querySelector(".fiveDay"+i) 
   var fivedayDate = new Date (fiveDW[i].dt*1000) 
//    fivedayTemp.children[0].innerHTML = `<span> ${fivedayDate.toLocaleDateString()}</span>`
//    fivedayTemp.children[1].innerHTML = `<span><img src="${weatherIconFD}"/></span>`
//    fivedayTemp.children[2].innerHTML = `Temp:  <span>${fiveDW[i].temp.day} &#8451;</span>`
//    fivedayTemp.children[3].innerHTML = `Humidity:  <span>${fiveDW[i].humidity}%</span>`

    fiveDayWeather.innerHTML += `
    
        <div id="BillsTest" class="col">
            <div class="card h-100 card text-white bg-primary">
                <div class="card-body fiveDay1" >
                    <h5 class="card-title fivedayDate"><span> ${fivedayDate.toLocaleDateString()}</span></h5>
                    <p class="card-text fivedayIcon"><span><img src="${weatherIconFD}"/></span></p>
                    <p class="card-text fivedayTemp">Temp:  <span>${fiveDW[i].temp.day} &#8451;</span></p>
                    <p class="card-text fivedayHumid">Humidity:  <span>${fiveDW[i].humidity}%</span></p>     
                </div>
            </div>
        </div>
    
    `

   }  
}





cityList() 
// setDefaults()
