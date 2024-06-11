L.Control.Weather = L.Control.extend({
  options: {
    position: "bottomleft",
    units: "internal",
    lang: "en",
    event: "moveend",
    cssClass: "leaflet-control-weather",
    iconUrlTemplate: "https://openweathermap.org/img/w/:icon",
    template: '<div class="weatherIcon"><img src=":iconurl"></div><div>T: :temperature°C</div><div>H: :humidity%</div><div>W: :winddirection :windspeed m/s</div>',
    translateWindDirection: function(text) {
      return text;
    },
    updateWidget: undefined,
    apiKey: '' // Make sure to provide the API key
  },

  onAdd: function(map) {
    this._div = L.DomUtil.create('div', this.options.cssClass);
    this.onMoveEnd = this._onMoveEnd.bind(this);
    if (!this.options.updateWidget) {
      this.options.updateWidget = this._updateWidget.bind(this);
    }
    this.refresh(this.options.updateWidget.bind(this));
    this._map.on(this.options.event, this.onMoveEnd);

    return this._div;
  },

  onRemove: function(map) {
    this._map.off(this.options.event, this.onMoveEnd);
  },

  refresh: function(callback) {
    const center = this._map.getCenter();
    let url = "https://api.openweathermap.org/data/2.5/weather?lat=:lat&lon=:lng&lang=:lang&units=:units&appid=:appkey";
    const apiKey = this.options.apiKey;

    url = url.replace(":lang", this.options.lang);
    url = url.replace(":units", this.options.units);
    url = url.replace(":lat", center.lat);
    url = url.replace(":lng", center.lng);
    url = url.replace(":appkey", apiKey);

    fetch(url)
      .then(response => response.json())
      .then(weather => {
        callback(weather);
      })
      .catch(error => console.error('Error fetching weather data:', error));
  },

  _onMoveEnd: function() {
    this.refresh(weather => {
      this.options.updateWidget(weather);
    });
  },

  _updateWidget: function(weather) {
    const iconUrl = this.options.iconUrlTemplate.replace(":icon", weather.weather[0].icon + ".png");
    let tpl = this.options.template;
    tpl = tpl.replace(":iconurl", iconUrl);
    tpl = tpl.replace(":temperature", weather.main.temp);
    tpl = tpl.replace(":humidity", weather.main.humidity);
    tpl = tpl.replace(":windspeed", weather.wind.speed);
    tpl = tpl.replace(":winddirection", this.mapWindDirection(weather.wind.deg));
    this._div.innerHTML = tpl;
  },

  mapWindDirection: function(degrees) {
    let text = "";
    if (this._inRange(degrees, 11.25, 33.75)) {
      text = "NNE";
    } else if (this._inRange(degrees, 33.75, 56.25)) {
      text = "NE";
    } else if (this._inRange(degrees, 56.25, 78.75)) {
      text = "ENE";
    } else if (this._inRange(degrees, 78.75, 101.25)) {
      text = "E";
    } else if (this._inRange(degrees, 101.25, 123.75)) {
      text = "ESE";
    } else if (this._inRange(degrees, 123.75, 146.25)) {
      text = "SE";
    } else if (this._inRange(degrees, 146.25, 168.75)) {
      text = "SSE";
    } else if (this._inRange(degrees, 168.75, 191.25)) {
      text = "S";
    } else if (this._inRange(degrees, 191.25, 213.75)) {
      text = "SSW";
    } else if (this._inRange(degrees, 213.75, 236.25)) {
      text = "SW";
    } else if (this._inRange(degrees, 236.25, 258.75)) {
      text = "WSW";
    } else if (this._inRange(degrees, 258.75, 281.25)) {
      text = "W";
    } else if (this._inRange(degrees, 281.25, 303.75)) {
      text = "WNW";
    } else if (this._inRange(degrees, 303.75, 326.25)) {
      text = "NW";
    } else if (this._inRange(degrees, 326.25, 348.75)) {
      text = "NNW";
    } else if (this._inRange(degrees, 348.75, 11.25)) {
      text = "N";
    }
    return this.options.translateWindDirection(text);
  },

  _inRange: function(val, min, max) {
    if (max < min) {
      if (val >= min && val < 360) {
        return true;
      }
      if (val > 0 && val < max) {
        return true;
      }
      return false;
    }
    if (val >= min && val <= max) {
      return true;
    }
    return false;
  }
});

L.control.weather = function(options) {
  if (!options.apiKey) {
    console.warn("Leaflet.Weather: You must provide an OpenWeather API key.\nPlease see https://openweathermap.org/faq#error401 for more info");
  }
  return new L.Control.Weather(options);
};
