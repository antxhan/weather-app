import "./styles.css";

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
    return response;
  }
}

class View {
  constructor() {}
}

class Controller {
  constructor(api, view) {
    this.api = api;
    this.view = view;
  }
}

const api = new API();
const view = new View();
const controller = new Controller(api, view);
