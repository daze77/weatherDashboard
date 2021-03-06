// global variables
const d = new Date()

const newDate = d.toLocaleDateString()

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

let monthName = months[d.getMonth()]
let dayName = days[d.getDay()]
let year = d.getFullYear()
let date = d.getDate()

let cardDate = `${dayName}, ${monthName} ${date}, ${year}`
let fiveDayCardDate = `${monthName} ${date}`

var fiveDW
var tempdaily
var search 
var citySearched
var weatherList = JSON.parse(localStorage.getItem("weatherList")) || [];
 
document.querySelector('#weatherCitySearch').addEventListener("keydown", weatherCitySearch)

function setSearchVariable(){
    if(localStorage.lastCitySearched){
        search = JSON.parse(localStorage.lastCitySearched)[0].city
        weatherAPISearch()
    }
}

// function to start the search if the enter is pushed instead of the search button
function weatherCitySearch(event){
    if(event.keyCode === 13){
        console.log(`enter button hit`)
        btnClick(event)
    }
}

// cityList function to list all the cities searched
function cityList(){
    var citybutton = document.querySelector('#citiesSearched')
    citybutton.innerHTML = ""
    console.log(weatherList)
    var wlLength = weatherList.length
    console.log(wlLength)
    for (i = 0; i < wlLength; i++) {
    var citySearched = weatherList[i].city
    citybutton.innerHTML += `<button type="button" onClick='cityListbtnPush("${citySearched}")' class="btn btn-light d-block w-100 text-start"> ${citySearched} <i class="removeCity fas fa-minus float-end"></i></button>` 
    }

    console.log(citySearched)
}

function removeCity(event){
    console.log(weatherList)
    event.stopPropagation()
    console.log(`remove city button clicked`, event)
    console.log(`remove city button clicked`, event.target.parentElement.innerText)

    weatherList = weatherList.filter(e => ('city:', e.city !== `${event.target.parentElement.innerText}`))
    console.log(weatherList)
    saveToStorage()
    cityList()
    minusBtnListner()
}

function cityListbtnPush(city){
    search = city
    console.log("City List Button Pushed, city selected", search)
    weatherAPISearch()   
}

// search button
function btnClick(){
    console.log("ButtonClicked");
    if(document.querySelector('input').value !== ""){
      search = document.querySelector('input').value
      // starts the weather API search
    weatherAPISearch()
    }
    

}



async function weatherAPISearch(){
    // event.preventDefault()
     // search for weather
     var weatherData = await fetch( 'https://api.openweathermap.org/data/2.5/weather?appid=96cb0c8c08593af5ccd43266287d1a3d&units=metric&q='+encodeURI( search) ).then( r=>r.json() )


     if(weatherData.message == "city not found"){
         console.log(weatherData.message)
         
     } else {
         console.log("city found")
         document.querySelector('input').value = " "

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
        
        lastCitySearched(weatherData.name)

        if (weatherList.find(weatherList => weatherList.city === weatherData.name)){
            console.log ("already on list")
        } else {
            saveCity(weatherData.name) 
        }
    }
}

// pull information from API to the main dashboard
function getWeather(city, citytemp, humidity, windspeed, UV, icon){
    document.querySelector('#weatherCity').innerHTML = `<h4 class = "d-inline">${city} <span>(${cardDate})</span></h4><img src="${icon}"/>`;
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

    // save to Local Storage
    saveToStorage(currentWeatherSearch)

    // run city list function
    cityList(weatherList)
}

// save last city searched to storage
function lastCitySearched(currentWeatherSearch){
    let lastcity = [
        {
        city: currentWeatherSearch
        }
    ]
    localStorage.lastCitySearched = JSON.stringify(lastcity)

}


// save to Local Storage
function saveToStorage(){
    // push updated string to local storage
    localStorage.setItem("weatherList", JSON.stringify(weatherList));

}

// populate the five day forecast
function fiveDayForecast(fiveDW){
    const fiveDayWeather = document.querySelector('#fiveDayTemp')
    fiveDayWeather.innerHTML = " "
    console.log(`this is fiveDW`, fiveDW)
   for (i = 1; i < 6; i++){ 
    var iconCodeFD = fiveDW[i].weather[0].icon 
    var weatherIconFD =  `http://openweathermap.org/img/wn/${iconCodeFD}.png`
    // var fivedayTemp = document.querySelector(".fiveDay"+i) 
    var fivedayDate = new Date (fiveDW[i].dt*1000) 
    let monthName = months[fivedayDate.getMonth()]
    let dayName = days[fivedayDate.getDay()]
    let year = fivedayDate.getFullYear()
    let date = fivedayDate.getDate()

    fiveDayWeather.innerHTML += `
        <div id="BillsTest" class="col">
            <div class="card h-100 card text-white bg-primary">
                <div class="card-body fiveDay1" >
                    <h5 class="card-title "> ${dayName}</h5>
                    <h6 class="card-text fivedayDate"><span> ${monthName} ${date}, ${year}</span></h6>
                    <p class="card-text fivedayIcon"><span><img src="${weatherIconFD}"/></span></p>
                    <p class="card-text fivedayTemp">Temp:  <span>${fiveDW[i].temp.day} &#8451;</span></p>
                    <p class="card-text fivedayHumid">Humidity:  <span>${fiveDW[i].humidity}%</span></p>    
                </div>

            </div>
        </div>
    `
   }     
}

function minusBtnListner(){
    document.querySelectorAll('.removeCity').forEach(minus => minus.addEventListener('click', removeCity))
}

cityList() 
minusBtnListner()
setSearchVariable()



