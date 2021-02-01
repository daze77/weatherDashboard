var cityList
var lastcitySearched
var cityListLS

pushAndPullLocalStorage()



function pushAndPullLocalStorage(){
    cityListLS = JSON.parse(localStorage.getItem("cityListLS")) || [];

    cityListLS.push(cityList)
    localStorage.setItem("cityListLS", JSON.stringify(cityListLS));  


    //populate list of past searched cities on the dashboard
cityListLS.forEach(dashboardList); 

function dashboardList(item){
    document.querySelector('#citiesSearched').innerHTML += `<button type="button" class="btn btn-light">`+ (item) + `</button><br>`
}


}

















//save list of cities searched to Local Storage
async function btnClick(event){
    event.preventDefault();
    console.log("ButtonClicked")

    var search = document.querySelector('input').value
    
    console.log( `[btnClick] input(${search})` )

     // search for weather
     weatherData = await fetch( 'http://api.openweathermap.org/data/2.5/forecast?appid=96cb0c8c08593af5ccd43266287d1a3d&q='+encodeURI(search) ).then( r=>r.json() )
     console.log( ` .. weather: `, weatherData )

     var id = weatherData.id
    //  var icon = weatherData.list[0].weather[0].icon

    document.querySelector('#weather').innerHTML = `${id}`
    
    cityList = document.querySelector('input').value

    console.log(cityList)
     
    pushAndPullLocalStorage()

}






//Weather Widget that I might Use


// window.myWidgetParam ? window.myWidgetParam : window.myWidgetParam = [];  window.myWidgetParam.push({id: 15,cityid: '6167865',appid: '96cb0c8c08593af5ccd43266287d1a3d',units: 'metric',containerid: 'openweathermap-widget-15',  });  (function() {var script = document.createElement('script');script.async = true;script.charset = "utf-8";script.src = "//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(script, s);  })();






