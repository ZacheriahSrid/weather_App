
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import cloudIcon from "./assets/clearclo.jpg";
import sunIcon from "./assets/cloudyyy.png";
import drizzleIcon from "./assets/drizle.png";
import humidityIcon from "./assets/humdity.png";
import searchIcon from "./assets/Search.png";
import snowIcon from "./assets/winter.png";
import windIcon from "./assets/wind.png";
import rainIcon from "./assets/rainyyy.png";
import clearIcon from "./assets/clear.png";

const WeatherDetails = ({ icon, temp, city, country, lat, lon, humidity, wind }) => {
  return (
    <>
      <div className='image'>
        <img src={icon} alt="Weather Icon" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="coord">
        <div className="lat">
          <span>Latitude</span>
          <span>{lat}</span>
        </div>
        <div className="lon">
          <span>Longitude</span>
          <span>{lon}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="Humidity" className='humicon' />
          <div className="humidity-percent">{humidity}%</div>
          <div className="text">Humidity</div>
        </div>
        <div className="element">
          <img src={windIcon} alt="Wind" className='windicon' />
          <div className="wind-percent">{wind} Km/h</div>
          <div className="text">Wind</div>
        </div>
      </div>
    </>
  );
};

WeatherDetails.propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired
};

function App() {
  const api_key = "9de6ec0bf4bf4238cd9ad0937906a6e1";
  const [text, setText] = useState("Search");
  const [icon, setIcon] = useState(sunIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("City");
  const [country, setCountry] = useState("Country");
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon
  };

  const search = async () => {
    setLoading(true);
    setError(null);
    setCityNotFound(false);
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;
    
    try {
      let res = await fetch(url);
      let data = await res.json();
      
      if (data.cod === "404") {
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLon(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      
    } catch (error) {
      setError("An error occurred while fetching weather data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input
            type="text"
            className='cityInput'
            placeholder='Search City Here'
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDown}
          />
          <div className='search-icon' onClick={search}>
            <img src={searchIcon} alt="Search" className='search' />
          </div>
        </div>
        
        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City not found</div>}
        {!loading && !cityNotFound && !error && (
          <WeatherDetails
            icon={icon}
            temp={temp}
            city={city}
            country={country}
            lat={lat}
            lon={lon}
            humidity={humidity}
            wind={wind}
          />
        )}
        
        <p className='copyright'>
          Designed By <span>Sridhar Vijayan</span>
        </p>
      </div>
    </>
  );
}

export default App;
