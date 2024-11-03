import "./styles.css";
import { debounce } from "./utils";

const INPUT_PLACEHOLDER = "Location";

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
    console.log(response);
    return response;
  }
}

class View {
  constructor() {}
  render(data) {}
  bindLocationInput(handler) {
    const input = document.getElementById("location");
    input.addEventListener("input", debounce(handler, 500));
  }
}

class Controller {
  constructor(api, view) {
    this.api = api;
    this.view = view;
    this.location = undefined;
    this.updateView();
  }
  updateView(data) {
    this.view.render(data);
    this.view.bindLocationInput(this.handleLocationInput.bind(this));
  }
  handleLocationInput(e) {
    console.log(e.target.value);
  }
}

const api = new API();
const view = new View();
const controller = new Controller(api, view);
