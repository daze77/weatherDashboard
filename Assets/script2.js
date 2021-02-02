var day = new Date()
console.log(day)

var newDate = day.toLocaleDateString()
console.log(newDate)




//search button
function btnClick(){
    // event.preventDefault();
    console.log("ButtonClicked");
    
    weatherAPISearch()
    
}













async function weatherAPISearch(event){
    // event.preventDefault()
     // search for weather
     var search = document.querySelector('input').value
     weatherData = await fetch( 'http://api.openweathermap.org/data/2.5/weather?appid=96cb0c8c08593af5ccd43266287d1a3d&units=metric&q='+encodeURI( search) ).then( r=>r.json() )

     var weatherLat = weatherData.coord.lat
     var weatherLon = weatherData.coord.lon

    //use of one call api as the UV api is depricated - begining April 2021 aslo pull five day forcast from here
    oneCallAPI = await fetch ('https://api.openweathermap.org/data/2.5/onecall?appid=96cb0c8c08593af5ccd43266287d1a3d&exclude=hourly,minutely&units=metric&lat=' + (weatherLat) + '&lon=' +(weatherLon)).then( r =>r.json() )


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
    var iconURL = `http://openweathermap.org/img/wn/${iconCode}@2x.png`
    console.log(iconURL)
    var UVIndex = oneCallAPI.current.uvi
    console.log(UVIndex)

    getWeather(weatherData.name, weatherData.main.temp, weatherData.main.humidity, weatherData.wind.speed, oneCallAPI.current.uvi, iconURL) 
   
    //pull information from API to the main dashboard
    function getWeather(city, temp, humidity, windspeed, UV, icon){
        document.querySelector('#weatherCity').innerHTML = `${city} (${newDate})<img src="${icon}"/>`;
        document.querySelector("#weatherTemp").innerHTML = temp + ` &#8451;` ;
        document.querySelector("#weatherHum").innerHTML = humidity + `%`;
        document.querySelector('#weatherWind').innerHTML = Math.round((windspeed*3.6)) + " km/h";
        document.querySelector('#weatherUV').innerHTML = UV;
    }

    //determine the color code of the UV index result
    if (UVIndex <= 2){
        document.querySelector('#weatherUV').style.backgroundColor = "green";
    }
    else if (UVIndex >=3 && UVIndex <=5){
        document.querySelector('#weatherUV').style.backgroundColor = "yellow";
    }
    else if (UVIndex >=6 && UVIndex <=7){
        document.querySelector('#weatherUV').style.backgroundColor = "orange";
    }
    else if (UVIndex >=8 && UVIndex <=10){
        document.querySelector('#weatherUV').style.backgroundColor = "red";
    }
    else {
        document.querySelector('#weatherUV').style.backgroundColor = "Violet";
    }
    var fiveDW = oneCallAPI.daily
    console.log(fiveDW)
    var fiveDayList = {
        day1:[`${fiveDW[0].temp.day}`, `${newDate}+1`, `${fiveDW[0].humidity}`, `${fiveDW[0].weather[0].icon}`],
        day2:[`${fiveDW[1].temp.day}`, `${newDate}+2`, `${fiveDW[1].humidity}`, `${fiveDW[1].weather[1].icon}`],
        day3:[`${fiveDW[2].temp.day}`, `${newDate}+3`, `${fiveDW[2].humidity}`, `${fiveDW[2].weather[2].icon}`],
        day4:[`${fiveDW[3].temp.day}`, `${newDate}+4`, `${fiveDW[3].humidity}`, `${fiveDW[3].weather[3].icon}`],
        day5:[`${fiveDW[4].temp.day}`, `${newDate}+5`, `${fiveDW[4].humidity}`, `${fiveDW[4].weather[4].icon}`],
    }
    console.log(fiveDayList.day1)

    //Push updatest to five day forecast
    




}

//ToDO
//Fix the color of UV text
//Fix overall look and feel
//Fix text sizing all around