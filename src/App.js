import './App.css'; 
import React,{useState, useEffect, useRef} from 'react';

const weatherImages = {
  night: {
    clear: () => import(`./weather-condition-images/night/Clear.jpg`),
    cloudy: () => import(`./weather-condition-images/night/Cloudy.jpg`),
    rainy: () => import(`./weather-condition-images/night/Rainy.jpg`),
    snowy: () => import(`./weather-condition-images/night/Snowy.jpg`),
  },
  day: {
    clear: () => import(`./weather-condition-images/day/Clear.jpg`),
    cloudy: () => import(`./weather-condition-images/day/Cloudy.jpg`),
    rainy: () => import(`./weather-condition-images/day/Rainy.jpg`),
    snowy: () => import(`./weather-condition-images/day/Snowy.jpg`),
  }
  };
  

const API_KEY = 'b8291aea7ff94825a8c201541230303'; 

let useEffectCounter = 0; 

function App() {
const [forcastDisplayer, setForcastDisplayer] = useState(null);
const [weatherData, setWeatherData] = useState(null);
const [inputValue, setInputValue] = useState(''); 
const [result, setResult] = useState(null);


const inputValueRef = useRef(null); 
const searchBarRef = useRef(null);
const containerRef = useRef(null);


function RenderWeather() {
fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${inputValue}&aqi=yes`)
  .then(res => res.json())
  .then(data =>{
    setWeatherData(data);
    setInputValue('')
  })
  .catch(err => console.log(err.name))
}

function handleSub (e) {
  e.preventDefault();
  RenderWeather(); 
}




useEffect(() => {
setResult('')
if (weatherData) {
const {
  location: { name, localtime }, 
  current: {
    temp_c,
    condition: { text, code }
  }
} = weatherData;

checkWeather(weatherData.current.is_day, code);

const wrapper = <div>
  <p>{temp_c + '°C    ' + name}</p>
  <p>{localtime + '  ' + text}</p>
</div>


setResult(wrapper);
  
getForcast(name); 

}
}, [weatherData])



const toggleFocus = () => {
 searchBarRef.current.classList.add('focused');
}

const toggleBlur = () => {
  searchBarRef.current.classList.remove('focused');

}



useEffect(() => {
  toggleBlur(); 
},[])




function getForcast(name) {
setForcastDisplayer(''); 
fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${name}&days=3&aqi=no&alerts=no`)
.then(resp => resp.json())
.then(data => {
    const forecast = data.forecast.forecastday[0];
    const localtime = data.location.localtime.split(' ')[1]; // extract time portion only
    const items = [];

    for (let i = 1; i <= 12; i++) {
      const temp_c = forecast.hour[i].temp_c;
      const icon = forecast.hour[i].condition.icon;
    
      const wrapper = (
        <div className="forecast-item">
          <img src={icon} />
          <p>{formatTime(localtime, i)}</p>
          <p>{temp_c}</p>
        </div>
      );

      items.push(wrapper );
    setForcastDisplayer(items);

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


useEffect(() =>{
  useEffectCounter++
  if(useEffectCounter == 1){
    return 
  }
  navigator.geolocation.getCurrentPosition(position => {
    fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=` +`${position.coords.latitude} + ${position.coords.longitude}`)
    .then((res) => res.json())   
    .then(data =>{
      setWeatherData(data);
    })
    .catch(err => console.log(err.name))
  })
}, [])



async function checkWeather(is_day, code) {
  switch (code) {
    case 1000:
      containerRef.current.style.backgroundImage = `url(${is_day ? (await weatherImages.day.clear()).default : (await weatherImages.night.clear()).default})`;
      break;

    case 1003:
    case 1006:
    case 1009:
    case 1030:
    case 1069:
    case 1087:
    case 1135:
    case 1273:
    case 1276:
    case 1279:
    case 1282:
      containerRef.current.style.backgroundImage = `url(${is_day ? (await weatherImages.day.cloudy()).default : (await weatherImages.night.cloudy()).default})`;
      break;

    case 1063:
    case 1069:
    case 1072:
    case 1150:
    case 1180:
    case 1183:
    case 1186:
    case 1189:
    case 1192:
    case 1204:
    case 1207:
    case 1240:
    case 1243:
    case 1246:
    case 1249:
    case 1252:
      containerRef.current.style.backgroundImage = `url(${is_day ? (await weatherImages.day.rainy()).default : (await weatherImages.night.rainy()).default})`;
      break;

    default:
      containerRef.current.style.backgroundImage = `url(${is_day ? (await weatherImages.day.snowy()).default : (await weatherImages.night.snowy()).default})`;
      break;
  }

  if (is_day) {
    inputValueRef.current.classList.remove('whiteColor', 'blackBackgroundColor', 'whiteBorderColor');
    containerRef.current.classList.remove('whiteColor');
    searchBarRef.current.classList.remove('white');
  } else {
    inputValueRef.current.classList.add('whiteColor', 'blackBackgroundColor', 'whiteBorderColor');
    containerRef.current.classList.add('whiteColor');
    searchBarRef.current.classList.add('white');
  }
}
  


return (
<>
<div className="container mt-5 w-75 p-2" ref={containerRef}>
  <div className="search-bar" ref={searchBarRef}>
    <form onSubmit={handleSub} noValidate='off'>
      <span>
        Se  
        <input type="text" className="input" ref={inputValueRef} required value={inputValue} onChange={(e) => setInputValue(e.target.value)} onFocus={toggleFocus} onBlur={toggleBlur}/>
        rch...
      </span>
    </form>
  </div>
  <div className="result">{result}</div>
</div>

<div className='forecast'>
  <div id='forcastDisplayer'>
    {forcastDisplayer}
  </div>
</div>

</>
);

}



export default App; 


