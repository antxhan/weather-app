import "./styles.css";
import { debounce, fakeAPIRequst } from "./utils";
import clearDay from "./assets/images/clear-day.jpg";
import clearNight from "./assets/images/clear-night.jpg";
import cloudy from "./assets/images/cloudy.jpg";
import fogDay from "./assets/images/fog-day.jpg";
import fogNight from "./assets/images/fog-night.jpg";
import partlyCloudyDay from "./assets/images/partly-cloudy-day.jpg";
import partlyCloudyNight from "./assets/images/partly-cloudy-night.jpg";
import rain from "./assets/images/rain.jpg";
import showersDay from "./assets/images/showers-day.jpg";
import showersNight from "./assets/images/showers-night.jpg";
import snowShowersDay from "./assets/images/snow-showers-day.jpg";
import snowShowersNight from "./assets/images/snow-showers-night.jpg";
import snow from "./assets/images/snow.jpg";
import thunderRain from "./assets/images/thunder-rain.jpg";
import thunderShowersDay from "./assets/images/thunder-showers-day.jpg";
import thunderShowersNight from "./assets/images/thunder-showers-night.jpg";
import wind from "./assets/images/wind.jpg";

class API {
  constructor() {
    this.baseUrl =
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
    this.params = {
      unitGroup: "metric",
      include: "current",
      key: "V2HW5UBV829CDXXVPSRF859M9",
      contentType: "json",
    };
  }
  async getData(location) {
    const url = `${this.baseUrl}${location}?${new URLSearchParams(
      this.params
    )}`;
    const data = await fetch(url);
    const response = await data.json();
    // console.log(response);
    return response;
  }
}

class View {
  constructor() {}
  render(data) {
    this.renderLocationInput();
    this.renderBackgroundImage(data);
    if (data) {
      this.renderClock(data);
      console.log("from render", data);
    }
  }
  renderLocationInput() {
    const locationInput = document.getElementById("location");
    if (locationInput) {
      locationInput.remove();
    }
    const html = `
    <input 
      type="text" 
      name="location" 
      id="location" 
      placeholder="Enter Location"
    />
    `;
    document.querySelector("form").insertAdjacentHTML("beforeend", html);
  }
  renderBackgroundImage(data) {
    const bgImg = document.getElementById("bg-img");
    if (data) {
      // bgImg.src = `assets/images/${data.currentConditions.icon}.jpg`;
      let src;
      switch (data.currentConditions.icon) {
        case "clear-day": {
          src = clearDay;
          break;
        }
        case "clear-night": {
          src = clearNight;
          break;
        }
        case "cloudy": {
          src = cloudy;
          break;
        }
        case "fog": {
          // TODO: make it determine if it's night or day
          src = fogDay || fogNight;
          break;
        }
        case "partly-cloudy-day": {
          src = partlyCloudyDay;
          break;
        }
        case "partly-cloudy-night": {
          src = partlyCloudyNight;
          break;
        }
        case "rain": {
          src = rain;
          break;
        }
        case "showers-day": {
          src = showersDay;
          break;
        }
        case "showers-night": {
          src = showersNight;
          break;
        }
        case "snow": {
          src = snow;
          break;
        }
        case "snow-showers-day": {
          src = snowShowersDay;
          break;
        }
        case "snow-showers-night": {
          src = snowShowersNight;
          break;
        }
        case "thunder-rain": {
          src = thunderRain;
          break;
        }
        case "thunder-showers-day": {
          src = thunderShowersDay;
          break;
        }
        case "thunder-showers-night": {
          src = thunderShowersNight;
          break;
        }
        case "wind": {
          src = wind;
          break;
        }
        default: {
          src = clearDay;
          break;
        }
      }
      bgImg.src = src;
      // bgImg.style.opacity = 1;
    } else {
      bgImg.src = clearDay;
    }
  }
  renderClock(data) {
    function setSunriseAndSunset(element, hours, minutes) {
      element.style.setProperty(
        "--rotate",
        `${hours * 30 + (minutes / 60) * 30}deg`
      );
    }

    // sunrise
    const sunriseElement = document.querySelector(".clock__arm--sunrise");
    sunriseElement.querySelector(".tooltip").innerText =
      data.currentConditions.sunrise.slice(0, 5);
    const sunriseHours = data.currentConditions.sunrise.split(":")[0];
    const sunriseMinutes = data.currentConditions.sunrise.split(":")[1];
    setSunriseAndSunset(sunriseElement, sunriseHours, sunriseMinutes);

    // sunset
    const sunsetElement = document.querySelector(".clock__arm--sunset");
    sunsetElement.querySelector(".tooltip").innerText =
      data.currentConditions.sunset.slice(0, 5);
    const sunsetHours = data.currentConditions.sunset.split(":")[0];
    const sunsetMinutes = data.currentConditions.sunset.split(":")[1];
    setSunriseAndSunset(sunsetElement, sunsetHours, sunsetMinutes);

    const localTimeUnix = Date.now() + data.tzoffset * 3600 * 1000;
    const localTime = new Date(localTimeUnix);
    console.log(localTime.getHours(), localTime.getMinutes());

    // arms
    document
      .querySelector(".clock__arm--minute")
      .style.setProperty("--arm-rotation", `${localTime.getMinutes() * 6}deg`);

    document
      .querySelector(".clock__arm--hour")
      .style.setProperty("--arm-rotation", `${localTime.getHours() * 30}deg`);
  }
  bindLocationInput(handler) {
    const input = document.getElementById("location");
    input.addEventListener("input", debounce(handler, 1000));
  }
}

class Controller {
  constructor(api, view) {
    this.api = api;
    this.view = view;
    this.updateView(null);
  }
  updateView(data) {
    this.view.render(data);
    this.view.bindLocationInput(this.handleLocationInput.bind(this));
  }
  async handleLocationInput(e) {
    const locationInputValue = e.target.value;
    if (!locationInputValue) {
      return;
    }
    const data = await this.api.getData(locationInputValue);
    this.updateView(data);
  }
}

const api = new API();
const view = new View();
const controller = new Controller(api, view);
