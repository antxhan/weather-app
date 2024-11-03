import "./styles.css";
import { debounce } from "./utils";

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
    if (data) {
      console.log("from render", data);
      this.renderLocationInput(data.resolvedAddress);
    }
  }
  renderLocationInput(placeholder = "Enter Location") {
    const locationInput = document.getElementById("location");
    if (locationInput) {
      locationInput.remove();
    }

    const html = `
    <input 
      type="text" 
      name="location" 
      id="location" 
      placeholder="${placeholder}"
    />
    `;
    document.querySelector("form").insertAdjacentHTML("beforeend", html);
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
    console.log("from controller", locationInputValue);
    // const data = await this.api.getData(locationInputValue);
    // this.updateView(data);
  }
}

const api = new API();
const view = new View();
const controller = new Controller(api, view);
