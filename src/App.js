import './App.css'; 
import React,{useState, useEffect} from 'react';

import ClearNight from './weather-condition-images/night/Clear.jpg';
import CloudyNight from './weather-condition-images/night/Cloudy.jpg';
import RainyNight from './weather-condition-images/night/Rainy.jpg';
import SnowyNight from './weather-condition-images/night/Snowy.jpg';

import ClearDay from './weather-condition-images/day/Clear.jpg';
import CloudDay from './weather-condition-images/day/Cloudy.jpg';
import RainyDay from './weather-condition-images/day/Rainy.jpg';
import SnowyDay from './weather-condition-images/day/Snowy.jpg';

const API_KEY = 'b8291aea7ff94825a8c201541230303'; 

let useEffectCounter = 0; 

function App() {
const [inputValue, setInputValue] = useState(''); 
const [weatherData, setWeatherData] = useState(null);

function RenderWeather() {
fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${inputValue}&aqi=yes`)
  .then(res => res.json())
  .then(data =>{
    setWeatherData(data);
    document.querySelector('.input').value = ''
  })
  .catch(err => console.log(err.name))
    
}

function handleSub (e) {
  e.preventDefault();
  RenderWeather(); 
}

useEffect(() => {
  document.querySelector('.result').innerHTML = null
  if (weatherData) {
    const {
      location: { name, localtime }, 
      current: {
        temp_c,
        condition: { text, code }
      }
    } = weatherData;

    checkWeather(weatherData.current.is_day, code);

    const wrapper = document.createElement('div');
    const temp = document.createElement('p');
    const local = document.createElement('p');

    temp.append(temp_c + '°C    ' + name);
    local.append(localtime + '  ' + text);

    wrapper.append(temp);
    wrapper.append(local); 

    document.querySelector('.result').appendChild(wrapper);

    getForcast(name); 
  }
}, [weatherData])


function toggleFocus() {
  const searchBar = document.querySelector('.search-bar');
  const input = document.querySelector('.input');

  input.addEventListener('focus', () => {
    searchBar.classList.add('focused');
    if (input.value !== '') {
      searchBar.classList.add('focused');
    } 
  });

  input.addEventListener('blur', () => {
    if (input.value === '') {
      searchBar.classList.remove('focused');
    }
  });

}

useEffect(() => {
  toggleFocus(); 
},[])




function getForcast(name) {
document.querySelector('#forcastDisplayer').innerHTML = ''
fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${name}&days=3&aqi=no&alerts=no`)
.then(resp => resp.json())
.then(data => {
    const forecast = data.forecast.forecastday[0];
    const localtime = data.location.localtime.split(' ')[1]; // extract time portion only

    for (let i = 1; i <= 12; i++) {
      const temp_c = forecast.hour[i].temp_c;
      const icon = forecast.hour[i].condition.icon;

      const wrapper = document.createElement('div');
      wrapper.classList.add('forecast-item');

      const temp = document.createElement('p');
      temp.innerText = temp_c;

      const time = document.createElement('p');
      time.innerText = formatTime(localtime, i);

      const iconElement = document.createElement('img');
      iconElement.src = icon;

      wrapper.append(iconElement);
      wrapper.append(time);
      wrapper.append(temp);
      document.querySelector('#forcastDisplayer').appendChild(wrapper);
      console.log(wrapper);
    }
  });
}

function formatTime(localtime, increment) {
  let [hours, minutes] = localtime.split(':').map(Number);
  hours = (hours + increment) % 24;
  if (hours < 10) {
  hours = '0' + hours;
  }

  return `${hours}:${minutes.toString().padStart(2, '0')}`;
}


// useEffect(() =>{
//   useEffectCounter++
//   if(useEffectCounter == 1){
//     return 
//   }
//   navigator.geolocation.getCurrentPosition(position => {
//     fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=` +`${position.coords.latitude} + ${position.coords.longitude}`)
//     .then((res) => res.json())   
//     .then(data =>{
//       setWeatherData(data);
//     })
//     .catch(err => console.log(err.name))
//   })
// }, [])

return (
  <>
  <div className="container mt-5 w-75 p-2">
    <div className="search-bar">
      <form onSubmit={handleSub} noValidate='off'>
        <span>
          Se  
          <input type="text" className="input" required onChange={(e) => setInputValue(e.target.value)} onClick={toggleFocus}/>
          rch...
        </span>
      </form>
    </div>
    <div className="result"></div>
  </div>

<div className='forecast '>
    <div id='forcastDisplayer'></div>
</div>

</>
);


}

function checkWeather(is_day, code){
  const container = document.querySelector('.container'); 
  const input = document.querySelector('.input');
  const searchBar = document.querySelector('.search-bar');

  if(!is_day){
    input.style.color = 'white';
    container.style.color = 'white';
    searchBar.classList.add('white'); 
    input.style.backgroundColor = 'black';
    input.style.border = '2px solid white';

    // Clear weather
    if(code == 1000){
      container.style.backgroundImage = `url(${ClearNight})`;
    }

  // cloudy
  else if(
      code == 1003 || 
      code == 1006 ||
      code == 1009 ||
      code == 1030 ||
      code == 1069 ||
      code == 1087 ||
      code == 1135 ||
      code == 1273 ||
      code == 1276 ||
      code == 1279 ||
      code == 1282
  ){
    container.style.backgroundImage = `url(${CloudyNight})`;
  }

  // //Rain
  else if(
      code == 1063 ||
      code == 1069 ||
      code == 1072 ||
      code == 1150 ||
      code == 1180 ||
      code == 1183 ||
      code == 1186 ||
      code == 1189 ||
      code == 1192 ||
      code == 1204 ||
      code == 1207 ||
      code == 1240 ||
      code == 1243 ||
      code == 1246 ||
      code == 1249 ||
      code == 1252 
  ){
    container.style.backgroundImage = `url(${RainyNight})`;
  }
  else{
    container.style.backgroundImage = `url(${SnowyNight})`;
  }
}

  if(is_day){
  input.style.color = 'black';
  container.style.color = 'black'
  searchBar.classList.remove('white'); 
  input.style.backgroundColor = 'white';
  input.style.border = '2px solid black';


  // Clear weather
  if(code == 1000){
    container.style.backgroundImage = `url(${ClearDay})`;
    container.style.color = 'white'
  }

  // cloudy
  else if(
      code == 1003 || 
      code == 1006 ||
      code == 1009 ||
      code == 1030 ||
      code == 1069 ||
      code == 1087 ||
      code == 1135 ||
      code == 1273 ||
      code == 1276 ||
      code == 1279 ||
      code == 1282
  ){
    container.style.backgroundImage = `url(${CloudDay})`;
  }

  // //Rain
  else if(
      code == 1063 ||
      code == 1069 ||
      code == 1072 ||
      code == 1150 ||
      code == 1180 ||
      code == 1183 ||
      code == 1186 ||
      code == 1189 ||
      code == 1192 ||
      code == 1204 ||
      code == 1207 ||
      code == 1240 ||
      code == 1243 ||
      code == 1246 ||
      code == 1249 ||
      code == 1252 
  ){
    container.style.backgroundImage = `url(${RainyDay})`;

  }
  else{
    container.style.backgroundImage = `url(${SnowyDay})`;

  }
  }

}




export default App; 


