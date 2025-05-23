import React, { useState, useEffect, useCallback } from 'react';
import './Weather.css';
import clearIcon from './../Assets/clear.png';
import cloudIcon from './../Assets/cloud.png';
import drizzleIcon from './../Assets/drizzle.png';
import humidityIcon from './../Assets/humidity.png';
import rainIcon from './../Assets/Rain.png';
import snowIcon from './../Assets/snow.png';
import windIcon from './../Assets/wind.png';
import searchIcon from './../Assets/search.png';
import nightRainIcon from './../Assets/night-rain.png';
import nightSkyIcon from './../Assets/night-sky.png';

const WeatherDetail = ({ icon, temp, city, country, lat, long, humidity, wind }) => {
  return (
    <>
      <div className='image'>
        <img src={icon} alt='weather-icon' />
      </div>
      <div className='temp'>{temp}&deg;C</div>
      <div className='location'>{city}</div>
      <div className='country'>{country}</div>
      <div className='cord'>
        <div>
          <span className='lat'>Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='long'>Longitude</span>
          <span>{long}</span>
        </div>
      </div>
      <div className='data-container'>
        <div className='element'>
          <img className='humidity-img' src={humidityIcon} alt='humidity' />
          <div className='data'>
            <div className='humidity-percent'>{humidity}%</div>
            <div className='text'>Humidity</div>
          </div>
        </div>
        <div className='element'>
          <img className='wind-img' src={windIcon} alt='wind' />
          <div className='data'>
            <div className='wind-percent'>{wind} km/h</div>
            <div className='text'>Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

const Weather = () => {
  const [text, setText] = useState("Tirunelveli"); 
  const [icon, setIcon] = useState(rainIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (cityName) => {
    const weatherIconMap = {
      "01d": clearIcon,
      "01n": nightSkyIcon,
      "02d": cloudIcon,
      "02n": nightSkyIcon,
      "03d": drizzleIcon,
      "03n": drizzleIcon,
      "04d": drizzleIcon,
      "04n": drizzleIcon,
      "09d": rainIcon,
      "09n": nightRainIcon,
      "10d": rainIcon,
      "10n": nightRainIcon,
      "13d": snowIcon,
      "13n": snowIcon,
    };

    setLoading(true);
    setError(null);

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=e8617cc12ff2a652e850833919b29979&units=Metric`;

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
      setLong(data.coord.lon);

      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || snowIcon);
      setCityNotFound(false);
    } catch (error) {
      setError("An error occurred while fetching weather data");
    } finally {
      setLoading(false);
    }
  }, []);


  const handleCity = (e) => {
    setText(e.target.value); 
  };


  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      search(text); 
    }
  };

  useEffect(() => {
    search(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='container'>
      <div className='input-container'>
        <input
          type='text'
          className='input-text'
          placeholder='Search city'
          onChange={handleCity}
          value={text} 
          onKeyDown={handleKeyDown} 
        />
        <div className='search-i'>
          <img
            className='search-icon'
            onClick={() => search(text)}
            src={searchIcon}
            alt='search'
          />
        </div>
      </div>

      {!loading && !cityNotFound && (
        <WeatherDetail
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          lat={lat}
          long={long}
          humidity={humidity}
          wind={wind}
        />
      )}

      {loading && <div className='loading-msg'>Loading...</div>}
      {error && <div className='error-msg'>{error}</div>}
      {cityNotFound && <div className='city-not-found'>City Not Found</div>}

      <p className='copyright'>
        Designed by <span>Yabesh</span>
      </p>
    </div>
  );
};

export default Weather;
