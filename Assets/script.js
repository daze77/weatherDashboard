var city
var cityList
var lastcitySearched
var cityListLS
var currentCity = {

}

var searchList
var searchListLS

console.log(city)





// function pushAndPullLocalStorage(){
//     cityListLS = JSON.parse(localStorage.getItem("cityListLS")) || [];

//     cityListLS.push(cityList)
//     localStorage.setItem("cityListLS", JSON.stringify(cityListLS));  


//     //populate list of past searched cities on the dashboard
// cityListLS.forEach(dashboardList); 

function savetoLS(){
    //pull local storage
    searchListLS = JSON.parse(localStorage.getItem("searchListLS")) || [];
    //push local storage
    searchListLS.push(searchList)
    localStorage.setItem("searchListLS", JSON.stringify(searchListLS))


    searchListLS.forEach(dashboardList);

}

function getWeatherData(){

}
searchListLS = JSON.parse(localStorage.getItem("searchListLS")) || [];

searchListLS.forEach(dashboardList);



function dashboardList(item){
    document.querySelector('#citiesSearched').innerHTML += `<button type="button" class="btn btn-light">`+ (item) + `</button><br>`
}



function btnClick(event){
    // event.preventDefault();
    console.log("ButtonClicked");

    var search = document.querySelector('input').value
    searchList = search


    console.log(search)
    
    console.log(event)

    savetoLS()
    
}











// //save list of cities searched to Local Storage
// async function btnClick(event){
//     event.preventDefault();
//     console.log("ButtonClicked")

//     var search = document.querySelector('input').value
    
//     console.log(`input ${search}` )

//     city = document.querySelector('input').value

//      // search for weather
//      weatherData = await fetch( 'http://api.openweathermap.org/data/2.5/weather?appid=96cb0c8c08593af5ccd43266287d1a3d&q='+encodeURI(search) ).then( r=>r.json() )
//      console.log( ` .. weather: `, weatherData )

//      var name = weatherData.name
//     //  var icon = weatherData.list[0].weather[0].icon

//     document.querySelector('#weather').innerHTML = `${name}`
    
//     saveList = document.querySelector('input').value

//     console.log(cityList)

  
     
//     pushAndPullLocalStorage()

// }

