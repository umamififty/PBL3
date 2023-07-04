var map;
var currentMarker;
var destinationMarker;
var directionsService;
var directionsRenderer;
var searchBox;
navigator.geolocation.getCurrentPosition(function (position) {
  const currentPos = {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };
  console.log(position);
  const now = new Date();

  // Get the start of the day
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Calculate the elapsed milliseconds since the start of the day
  const elapsedMilliseconds = now - startOfDay;

  // Calculate the elapsed hours since the start of the day
  const elapsedHours = Math.floor(elapsedMilliseconds / (60 * 60 * 1000));

  console.log(elapsedHours);

  fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi`
  )
    .then((response) => response.json())
    .then((jsonResponse) => {
      console.log(jsonResponse);
      // Extracting the relevant data from the JSON
      const usAqiData = jsonResponse.hourly.us_aqi;
      const timeData = [];
      for (let i = 0; i <= 24; i++) {
        timeData.push(jsonResponse.hourly.time[i]);
      }
      const pm10Data = jsonResponse.hourly.pm10;
      const pm2_5Data = jsonResponse.hourly.pm2_5;
      const coData = jsonResponse.hourly.carbon_monoxide;
      const no2Data = jsonResponse.hourly.nitrogen_dioxide;
      const so2Data = jsonResponse.hourly.sulphur_dioxide;
      const ozoneData = jsonResponse.hourly.ozone;

      // Creating a div element for the US AQI value
      const usAqiDiv = document.getElementById("air-info");
      usAqiDiv.innerHTML = `<h4> Air Quality Index: ${usAqiData[elapsedHours]}</h4>`;

      const plotGraphDiv1 = document.getElementById("us-aqi-plot");
      const plotData1 = [{ x: timeData, y: usAqiData, name: "AQI" }];
      const layout1 = { title: "Air Quality Data" };
      Plotly.newPlot(plotGraphDiv1, plotData1, layout1);

      const pointData = [
        {
          x: timeData[elapsedHours],
          y: usAqiData[elapsedHours],
          mode: "markers",
          marker: { color: "red" },
          name: "Elapsed hour",
        },
      ];
      Plotly.addTraces(plotGraphDiv1, pointData);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${currentPos.lat}&longitude=${currentPos.lng}&hourly=temperature_2m`
  )
    .then((response) => response.json())
    .then((jsonResponse) => {
      const tempData = jsonResponse.hourly.temperature_2m;

      const tempdDiv = document.getElementById("temp-div");

      tempdDiv.innerHTML = `<p> temprature: ${tempData[elapsedHours]}</p>`;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
function initMap() {
  navigator.geolocation.getCurrentPosition(function (position) {
    const currentPos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    console.log(position);
    map = new google.maps.Map(document.getElementById("map"), {
      center: currentPos,
      zoom: 14,
    });

    currentMarker = new google.maps.Marker({
      position: currentPos,
      map: map,
      title: "Current Position",
    });

    google.maps.event.addListener(map, "click", function (event) {
      const clickedPos = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      if (destinationMarker) {
        destinationMarker.setMap(null);
      }

      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }

      destinationMarker = new google.maps.Marker({
        position: clickedPos,
        map: map,
        title: "Destination",
      });

      // Generate random Air Quality Index
      const lat1 = clickedPos.lat;
      const lng1 = clickedPos.lng;
      const base_url = "https://api.waqi.info";
      const token = "1aced1f5777434933e661255c282e856";

      fetch(`${base_url}/feed/geo:${lat1};${lng1}/?token=${token}`)
        .then((response) => response.json())
        .then((data) => {
          const aqi = data.data;
          const result = `Air quality index: ${aqi}`;
          console.log(result);
        })
        .catch((error) => {
          console.log("Error:", error);
        });

      const airQualityIndex = Math.floor(Math.random() * 500) + 1;

      const airQualityText = getAirQualityText(airQualityIndex);
      const airQualityColorClass = getAirQualityColorClass(airQualityIndex);

      const contentString = `
          <div class="info-window ${airQualityColorClass}">
            <p><b>Air Quality Index:</b> <span id="air-index">${airQualityIndex}</span></p>
            <p><span id="air-text">${airQualityText}</span></p>
          </div>
        `;

      const infowindow = new google.maps.InfoWindow({
        content: contentString,
      });

      infowindow.open(map, destinationMarker);

      calculateAndDisplayRoute(currentPos, clickedPos);
    });

    // Initialize the search box
    searchBox = new google.maps.places.SearchBox(
      document.getElementById("pac-input")
    );

    // Bias the search box results towards the current map's viewport
    map.addListener("bounds_changed", function () {
      searchBox.setBounds(map.getBounds());
    });

    // Perform search and update the map based on the selected place
    searchBox.addListener("places_changed", function () {
      var places = searchBox.getPlaces();

      if (places.length === 0) {
        return;
      }

      // Clear any existing destination marker and route
      if (destinationMarker) {
        destinationMarker.setMap(null);
      }

      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }

      // Get the first place from the search results
      var place = places[0];

      // Set the new destination marker
      destinationMarker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        title: place.name,
      });

      // Generate random Air Quality Index
      const airQualityIndex = Math.floor(Math.random() * 500) + 1;

      const airQualityText = getAirQualityText(airQualityIndex);
      const airQualityColorClass = getAirQualityColorClass(airQualityIndex);

      const contentString = `
          <div class="info-window ${airQualityColorClass}">
            <p><b>Air Quality Index:</b> <span id="air-index">${airQualityIndex}</span></p>
            <p><span id="air-text">${airQualityText}</span></p>
          </div>
        `;

      const infowindow = new google.maps.InfoWindow({
        content: contentString,
      });

      infowindow.open(map, destinationMarker);

      // Calculate and display the route
      calculateAndDisplayRoute(currentPos, place.geometry.location);
    });
  });
}

function calculateAndDisplayRoute(origin, destination) {
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();

  directionsRenderer.setMap(map);

  const request = {
    origin: origin,
    destination: destination,
    travelMode: google.maps.TravelMode.WALKING,
  };

  directionsService.route(request, function (result, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result);

      const route = result.routes[0];
      console.log(route);
      const distance = route.legs[0].distance.text;
      const duration = route.legs[0].duration.text;

      // Display the distance and duration in an HTML element
      document.getElementById("route-info").innerHTML =
        "Distance: " + distance + "<br>Duration: " + duration;
    }
  });
}

function onIllnessChange() {
  if (directionsRenderer) {
    directionsRenderer.setMap(null);
  }
  document.getElementById("route-info").innerHTML = "";
  const destination = destinationMarker.getPosition();
  if (destination) {
    const currentPos = currentMarker.getPosition();
    calculateAndDisplayRoute(currentPos, destination);
  }
}

function getAirQualityText(index) {
  if (index <= 50) {
    return "Good";
  } else if (index <= 100) {
    return "Moderate";
  } else if (index <= 150) {
    return "Unhealthy for Sensitive Groups";
  } else if (index <= 200) {
    return "Unhealthy";
  } else if (index <= 300) {
    return "Very Unhealthy";
  } else if (index <= 500) {
    return "Hazardous";
  } else {
    return "Hazardous";
  }
}

function getAirQualityColorClass(index) {
  if (index <= 50) {
    return "green";
  } else if (index <= 100) {
    return "yellow";
  } else if (index <= 150) {
    return "orange";
  } else if (index <= 200) {
    return "red";
  } else if (index <= 300) {
    return "purple";
  } else if (index <= 500) {
    return "brown";
  } else {
    return "brown";
  }
}

function loadGoogleMapsScript() {
  var script = document.createElement("script");
  script.src =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyDZ7yaHzTGLSE2r2Gj8Ptlw-XqI3rrdeVI&libraries=places&callback=initMap";
  document.head.appendChild(script);
}

loadGoogleMapsScript();
