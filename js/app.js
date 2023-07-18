// var map;
// var currentMarker;
// var destinationMarker;
// var directionsService;
// var directionsRenderer;
// var searchBox;
// navigator.geolocation.getCurrentPosition(function (position) {
//   const currentPos = {
//     lat: position.coords.latitude,
//     lng: position.coords.longitude,
//   };
//   console.log(position);
//   const now = new Date();

//   // Get the start of the day
//   const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

//   // Calculate the elapsed milliseconds since the start of the day
//   const elapsedMilliseconds = now - startOfDay;

//   // Calculate the elapsed hours since the start of the day
//   const elapsedHours = Math.floor(elapsedMilliseconds / (60 * 60 * 1000));

//   console.log(elapsedHours);

//   fetch(
//     `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi`
//   )
//     .then((response) => response.json())
//     .then((jsonResponse) => {
//       console.log(jsonResponse);
//       // Extracting the relevant data from the JSON
//       const usAqiData = jsonResponse.hourly.us_aqi;
//       const timeData = [];
//       for (let i = 0; i <= 24; i++) {
//         timeData.push(jsonResponse.hourly.time[i]);
//       }
//       const pm10Data = jsonResponse.hourly.pm10;
//       const pm2_5Data = jsonResponse.hourly.pm2_5;
//       const coData = jsonResponse.hourly.carbon_monoxide;
//       const no2Data = jsonResponse.hourly.nitrogen_dioxide;
//       const so2Data = jsonResponse.hourly.sulphur_dioxide;
//       const ozoneData = jsonResponse.hourly.ozone;

//       // Creating a div element for the US AQI value
//       const usAqiDiv = document.getElementById("air-info");
//       usAqiDiv.innerHTML = `<h4> Air Quality Index: ${usAqiData[elapsedHours]}</h4>`;

//       const plotGraphDiv1 = document.getElementById("us-aqi-plot");
//         const plotData1 = [{ x: timeData, y: usAqiData, name: "AQI" }];
//         const layout1 = { title: "Air Quality Data" };
//       Plotly.newPlot(plotGraphDiv1, plotData1, layout1);

//       const pointData = [
//         {
//           x: timeData[elapsedHours],
//           y: usAqiData[elapsedHours],
//           mode: "markers",
//           marker: { color: "red" },
//           name: "Elapsed hour",
//         },
//       ];
//       Plotly.addTraces(plotGraphDiv1, pointData);
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
//   fetch(
//     `https://api.open-meteo.com/v1/forecast?latitude=${currentPos.lat}&longitude=${currentPos.lng}&hourly=temperature_2m`
//   )
//     .then((response) => response.json())
//     .then((jsonResponse) => {
//       const tempData = jsonResponse.hourly.temperature_2m;

//       const tempdDiv = document.getElementById("temp-div");

//       tempdDiv.innerHTML = `<p> Temperature: ${tempData[elapsedHours]}</p>`;
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// });
// function initMap() {
//   navigator.geolocation.getCurrentPosition(function (position) {
//     const currentPos = {
//       lat: position.coords.latitude,
//       lng: position.coords.longitude,
//     };
//     console.log(position);
//     map = new google.maps.Map(document.getElementById("map"), {
//       center: currentPos,
//       zoom: 14,
//     });

//     currentMarker = new google.maps.Marker({
//       position: currentPos,
//       map: map,
//       title: "Current Position",
//     });

//     google.maps.event.addListener(map, "click", function (event) {
//       const clickedPos = {
//         lat: event.latLng.lat(),
//         lng: event.latLng.lng(),
//       };

//       if (destinationMarker) {
//         destinationMarker.setMap(null);
//       }

//       if (directionsRenderer) {
//         directionsRenderer.setMap(null);
//       }

//       destinationMarker = new google.maps.Marker({
//         position: clickedPos,
//         map: map,
//         title: "Destination",
//       });

//       // Generate random Air Quality Index
//       const lat1 = clickedPos.lat;
//       const lng1 = clickedPos.lng;
//       const base_url = "https://api.waqi.info";
//       const token = "1aced1f5777434933e661255c282e856";

//       fetch(`${base_url}/feed/geo:${lat1};${lng1}/?token=${token}`)
//         .then((response) => response.json())
//         .then((data) => {
//           const aqi = data.data;
//           const result = `Air quality index: ${aqi}`;
//           console.log(result);
//         })
//         .catch((error) => {
//           console.log("Error:", error);
//         });

//       const airQualityIndex = Math.floor(Math.random() * 500) + 1;

//       const airQualityText = getAirQualityText(airQualityIndex);
//       const airQualityColorClass = getAirQualityColorClass(airQualityIndex);

//       const contentString = `
//           <div class="info-window ${airQualityColorClass}">
//             <p><b>Air Quality Index:</b> <span id="air-index">${airQualityIndex}</span></p>
//             <p><span id="air-text">${airQualityText}</span></p>
//           </div>
//         `;

//       const infowindow = new google.maps.InfoWindow({
//         content: contentString,
//       });

//       infowindow.open(map, destinationMarker);

//       calculateAndDisplayRoute(currentPos, clickedPos);
//     });

//     // Initialize the search box
//     searchBox = new google.maps.places.SearchBox(
//       document.getElementById("pac-input")
//     );

//     // Bias the search box results towards the current map's viewport
//     map.addListener("bounds_changed", function () {
//       searchBox.setBounds(map.getBounds());
//     });

//     // Perform search and update the map based on the selected place
//     searchBox.addListener("places_changed", function () {
//       var places = searchBox.getPlaces();

//       if (places.length === 0) {
//         return;
//       }

//       // Clear any existing destination marker and route
//       if (destinationMarker) {
//         destinationMarker.setMap(null);
//       }

//       if (directionsRenderer) {
//         directionsRenderer.setMap(null);
//       }

//       // Get the first place from the search results
//       var place = places[0];

//       // Set the new destination marker
//       destinationMarker = new google.maps.Marker({
//         position: place.geometry.location,
//         map: map,
//         title: place.name,
//       });

//       // Generate random Air Quality Index
//       const airQualityIndex = Math.floor(Math.random() * 500) + 1;

//       const airQualityText = getAirQualityText(airQualityIndex);
//       const airQualityColorClass = getAirQualityColorClass(airQualityIndex);

//       const contentString = `
//           <div class="info-window ${airQualityColorClass}">
//             <p><b>Air Quality Index:</b> <span id="air-index">${airQualityIndex}</span></p>
//             <p><span id="air-text">${airQualityText}</span></p>
//           </div>
//         `;

//       const infowindow = new google.maps.InfoWindow({
//         content: contentString,
//       });

//       infowindow.open(map, destinationMarker);

//       // Calculate and display the route
//       calculateAndDisplayRoute(currentPos, place.geometry.location);
//     });
//   });
// }

// function calculateAndDisplayRoute(origin, destination) {
//   directionsService = new google.maps.DirectionsService();
//   directionsRenderer = new google.maps.DirectionsRenderer();

//   directionsRenderer.setMap(map);

//   const request = {
//     origin: origin,
//     destination: destination,
//     travelMode: google.maps.TravelMode.WALKING,
//   };

//   directionsService.route(request, function (result, status) {
//     if (status === google.maps.DirectionsStatus.OK) {
//       directionsRenderer.setDirections(result);

//       const route = result.routes[0];
//       console.log(route);
//       const distance = route.legs[0].distance.text;
//       const duration = route.legs[0].duration.text;

//       // Display the distance and duration in an HTML element
//       document.getElementById("route-info").innerHTML =
//         "Distance: " + distance + "<br>Duration: " + duration;
//     }
//   });
// }

// function onIllnessChange() {
//   if (directionsRenderer) {
//     directionsRenderer.setMap(null);
//   }
//   document.getElementById("route-info").innerHTML = "";
//   const destination = destinationMarker.getPosition();
//   if (destination) {
//     const currentPos = currentMarker.getPosition();
//     calculateAndDisplayRoute(currentPos, destination);
//   }
// }

// function getAirQualityText(index) {
//   if (index <= 50) {
//     return "Good";
//   } else if (index <= 100) {
//     return "Moderate";
//   } else if (index <= 150) {
//     return "Unhealthy for Sensitive Groups";
//   } else if (index <= 200) {
//     return "Unhealthy";
//   } else if (index <= 300) {
//     return "Very Unhealthy";
//   } else if (index <= 500) {
//     return "Hazardous";
//   } else {
//     return "Hazardous";
//   }
// }

// function getAirQualityColorClass(index) {
//   if (index <= 50) {
//     return "green";
//   } else if (index <= 100) {
//     return "yellow";
//   } else if (index <= 150) {
//     return "orange";
//   } else if (index <= 200) {
//     return "red";
//   } else if (index <= 300) {
//     return "purple";
//   } else if (index <= 500) {
//     return "brown";
//   } else {
//     return "brown";
//   }
// }

// function loadGoogleMapsScript() {
//   var script = document.createElement("script");
//   script.src =
//     "https://maps.googleapis.com/maps/api/js?key=AIzaSyDZ7yaHzTGLSE2r2Gj8Ptlw-XqI3rrdeVI&libraries=places&callback=initMap";
//   document.head.appendChild(script);
// }

// loadGoogleMapsScript();

var map;
var currentMarker;
var destinationMarker;
var directionsService;
var directionsRenderer;
var searchBox;
const now = new Date();
// Get the start of the day
const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

// Calculate the elapsed milliseconds since the start of the day
const elapsedMilliseconds = now - startOfDay;

// Calculate the elapsed hours since the start of the day
const elapsedHours = Math.floor(elapsedMilliseconds / (60 * 60 * 1000));
navigator.geolocation.getCurrentPosition(function (position) {
  const currentPos = {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };
  console.log(position);
  const a = position.coords.latitude;
  const b = position.coords.longitude;

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
    });  searchBox = new google.maps.places.SearchBox(document.getElementById('pac-input'));

    // Bias the search box results towards the current map's viewport
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    // Perform search and update the map based on the selected place
    searchBox.addListener('places_changed', function() {
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
        center: place.geometry.location,
        zoom: 14
      });
      fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${place.geometry.location.lat()}&longitude=${place.geometry.location.lng()}&hourly=us_aqi`)
        .then(response => response.json())
        .then(jsonResponse => {
            console.log(jsonResponse)
        // Extracting the relevant data from the JSON
        const usAqiData = jsonResponse.hourly.us_aqi;
        const timeData = [];
            for (let i = 0; i <= 24; i++) {
            timeData.push(jsonResponse.hourly.time[i]);
            }
            
          const airQualityIndex = usAqiData[elapsedHours];
          
          const airQualityText = getAirQualityText(airQualityIndex, onIllnessChange());
          const airQualityColorClass = getAirQualityColorClass(airQualityIndex, onIllnessChange());
          
          const contentString = `
            <div class="info-window ${airQualityColorClass}">
              <p><b>Air Quality Index:</b> <span id="air-index">${airQualityIndex}</span></p>
              <p><span id="air-text">${airQualityText}</span></p>
            </div>
          `;

          const infowindow = new google.maps.InfoWindow({
            content: contentString,
          });
           // Initialize the search box
  
          infowindow.open(map, destinationMarker);
          console.log(usAqiData+"I am index");

        });

      // Calculate and display the route
      calculateAndDisplayRoute(currentPos, place.geometry.location);
    });

    google.maps.event.addListener(map, "click", function (event) {
      const clickedPos = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      console.log("Iam clicked" + clickedPos);
      if (destinationMarker) {
        destinationMarker.setMap(null);
      }

      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }

      destinationMarker = new google.maps.Marker({
        position: clickedPos,
        map: map,
        center: destinationMarker,
        title: "Destination",
      });

      fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${event.latLng.lat()}&longitude=${event.latLng.lng()}&hourly=us_aqi`
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

          const airQualityIndex = usAqiData[elapsedHours];

          const airQualityText = getAirQualityText(
            airQualityIndex,
            onIllnessChange()
          );
          const airQualityColorClass = getAirQualityColorClass(
            airQualityIndex,
            onIllnessChange()
          );

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
          console.log(usAqiData + "I am index");
          let maxAqi = parseInt(airQualityIndex);
          let minAqi = parseInt(airQualityIndex);
          let max7Aqi = parseInt(airQualityIndex);
          let min7Aqi = parseInt(airQualityIndex);

          let max7AqiHour = 0;
          let min7AqiHour = 0;
          let maxAqiHour = 0;
          let minAqiHour = 0;
          for (let i = 0; i < 24; i++) {
            if (usAqiData[i] > maxAqi) {
              console.log(usAqiData[i] + " hhe" + maxAqi);
              maxAqiHour = i;
              maxAqi = usAqiData[i];
            }
            if (usAqiData[i] < minAqi) {
              minAqi = usAqiData[i];
              minAqiHour = i;
            }
          }
          if (maxAqiHour === 0) {
            maxAqiHour = "12 am";
          } else if (maxAqiHour === 12) {
            maxAqiHour = "12 pm";
          } else if (maxAqiHour > 12) {
            maxAqiHour = maxAqiHour - 12 + " pm";
          } else {
            maxAqiHour = maxAqiHour + " am";
          }
          if (minAqiHour === 0) {
            minAqiHour = "12 am";
          } else if (minAqiHour === 12) {
            minAqiHour = "12 pm";
          } else if (minAqiHour > 12) {
            minAqiHour = minAqiHour - 12 + " pm";
          } else {
            minAqiHour = minAqiHour + " am";
          }
          console.log("I am maxAqi" + maxAqiHour);
          document.getElementById("data-table").rows[1].cells[1].innerHTML =
            maxAqiHour + "AQI value:" + maxAqi;
          document.getElementById("data-table").rows[2].cells[1].innerHTML =
            minAqiHour + "AQI value:" + minAqi;

          for (let i = 0; i < 168; i++) {
            if (usAqiData[i] > max7Aqi) {
              max7Aqi = usAqiData[i];
              max7AqiHour = i;
            }
            if (usAqiData[i] < min7Aqi) {
              min7AqiHour = i;
              min7Aqi = usAqiData[i];
            }
          }
          let day = 0;
          let day1 = 0;
          while (max7AqiHour > 24) {
            max7AqiHour -= 24;
            day += 1;
          }
          console.log(day);
          if (day === 0) {
            day = "Monday ";
          } else if (day === 1) {
            day = "Tuesday ";
          } else if (day === 2) {
            day = "Wednesday ";
          } else if (day === 3) {
            day = "Thursday ";
          } else if (day === 4) {
            day = "Friday ";
          } else if (day === 5) {
            day = "Saturday ";
          } else {
            day = "Sunday ";
          }

          while (min7AqiHour > 24) {
            min7AqiHour -= 24;
            day1 += 1;
          }
          console.log(day1);

          if (day1 === 0) {
            day1 = "Monday ";
          } else if (day1 === 1) {
            day1 = "Tuesday ";
          } else if (day1 === 2) {
            day1 = "Wednesday ";
          } else if (day1 === 3) {
            day1 = "Thursday ";
          } else if (day1 === 4) {
            day1 = "Friday ";
          } else if (day1 === 5) {
            day1 = "Saturday ";
          } else {
            day1 = "Sunday ";
          }
          if (max7AqiHour === 0) {
            max7AqiHour = "12 am";
          } else if (max7AqiHour === 12) {
            max7AqiHour = "12 pm";
          } else if (max7AqiHour > 12) {
            max7AqiHour = max7AqiHour - 12 + " pm";
          } else {
            max7AqiHour = max7AqiHour + " am";
          }
          if (min7AqiHour === 0) {
            min7AqiHour = "12 am";
          } else if (min7AqiHour === 12) {
            min7AqiHour = "12 pm";
          } else if (min7AqiHour > 12) {
            min7AqiHour = min7AqiHour - 12 + " pm";
          } else {
            min7AqiHour = min7AqiHour + " am";
          }
          console.log(day);
          document.getElementById("data-table").rows[1].cells[2].innerHTML =
            day + max7AqiHour + ": " + "AQI value:" + max7Aqi;
          document.getElementById("data-table").rows[2].cells[2].innerHTML =
            day1 + min7AqiHour + ": " + "AQI value:" + min7Aqi;
        })
        .catch((error) => {
          console.log("Error:", error);
        });

      calculateAndDisplayRoute(currentPos, clickedPos);
    });

   
    var tileLayer = new google.maps.ImageMapType({
      getTileUrl: function (coord, zoom) {
        var url =
          "https://tiles.waqi.info/tiles/usepa-aqi/" +
          zoom +
          "/" +
          coord.x +
          "/" +
          coord.y +
          ".png?token=4c514b8dc8a3b3aa25b3557580c995c57b783b18";
        return url;
      },
      tileSize: new google.maps.Size(256, 256),
      maxZoom: 18,
      opacity: 0.5, // Adjust the tile layer opacity as desired
    });

    map.overlayMapTypes.push(tileLayer);

    var markers = []; // Array to store the markers

    function updateMarkers() {
      var bounds = map.getBounds();
      if (!bounds) {
        return; // Return if bounds are not available yet
      }

      var ne = bounds.getNorthEast();
      var sw = bounds.getSouthWest();
      var url =
        "https://api.waqi.info/map/bounds/?latlng=" +
        sw.lat() +
        "," +
        sw.lng() +
        "," +
        ne.lat() +
        "," +
        ne.lng() +
        "&token=4c514b8dc8a3b3aa25b3557580c995c57b783b18";

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          // Clear previous markers
          markers.forEach(function (marker) {
            marker.setMap(null);
          });
          markers = [];

          // Generate markers with colors based on the AQI tiles
          data.data.forEach(function (tile) {
            var latLng = new google.maps.LatLng(tile.lat, tile.lon);
            var weight = tile.aqi || 0; // Use AQI as weight (or 0 if undefined)
            console.log(weight + "previous");
            // Customize the marker color based on weight range
            multiplier = onIllnessChange();
            weight = weight * multiplier;
            console.log(weight);
            var markerColor = getMarkerColor(weight);

            // Create a marker for each data point and set the color
            var marker = new google.maps.Marker({
              position: latLng,
              map: map,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: markerColor,
                fillOpacity: 0.7, // Set the marker opacity to 70%
                strokeWeight: 0,
                scale: getMarkerSize(weight), // Adjust the marker size based on weight
              },
            });
            markers.push(marker);
          });
        })
        .catch((error) => console.error("Error updating markers:", error));
    }

    // Update markers when the map becomes idle (after interaction)
    google.maps.event.addListener(map, "idle", updateMarkers);

    // Initial marker update
    updateMarkers();
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
  var illnessSelect = document.getElementById("illnesses-dropdown");
  var selectedIllness = illnessSelect.value;
  if (selectedIllness === "Cardiovascular disease") {
    multiplier = 1.8;
  } else if (selectedIllness === "Respiratory disease") {
    multiplier = 2.5;
  } else if (selectedIllness === "Diabetes-II") {
    multiplier = 2;
  } else {
    multiplier = 1;
  }

  return multiplier;
}
function handleDropdownChange() {
  onIllnessChange();
  initMap();
}
function onGraphChange() {
  var graphSelect = document.getElementById("graph-dropdown");
  var selectedGraph = graphSelect.value;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;

      if (selectedGraph === "AQI") {
        fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi`
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
            // Creating a div element for the US AQI value
            const plotGraphDiv1 = document.getElementById("us-aqi-plot");
            const plotData1 = [{ x: timeData, y: usAqiData, name: "AQI" }];
            const layout1 = { title: "Air Quality Index Data" };
            Plotly.newPlot(plotGraphDiv1, plotData1, layout1);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
      if (selectedGraph === "Components") {
        fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi`
        )
          .then((response) => response.json())
          .then((jsonResponse) => {
            // Extracting the relevant data from the JSON
            const pm10Data = jsonResponse.hourly.pm10;
            const pm2_5Data = jsonResponse.hourly.pm2_5;
            const coData = jsonResponse.hourly.carbon_monoxide;
            const no2Data = jsonResponse.hourly.nitrogen_dioxide;
            const so2Data = jsonResponse.hourly.sulphur_dioxide;
            const ozoneData = jsonResponse.hourly.ozone;
            const timeData = [];
            for (let i = 0; i <= 24; i++) {
              timeData.push(jsonResponse.hourly.time[i]);
            }

            // Creating a div element for the plot graph
            const plotGraphDiv = document.getElementById("us-aqi-plot");
            const plotData = [
              { x: timeData, y: pm10Data, name: "PM10" },
              { x: timeData, y: pm2_5Data, name: "PM2.5" },
              { x: timeData, y: coData, name: "Carbon Monoxide" },
              { x: timeData, y: no2Data, name: "Nitrogen Dioxide" },
              { x: timeData, y: so2Data, name: "Sulphur Dioxide" },
              { x: timeData, y: ozoneData, name: "Ozone" },
            ];
            const layout = { title: "Air Quality Component Data" };
            Plotly.newPlot(plotGraphDiv, plotData, layout);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}
window.addEventListener("DOMContentLoaded", onGraphChange);

function getAirQualityText(index, multiplier) {
  index *= multiplier;
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

function getAirQualityColorClass(index, multiplier) {
  index *= multiplier;
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
function getMarkerColor(weight) {
  var color = "green"; // Default color
  // Customize the color based on weight range
  if (weight >= 0 && weight < 50) {
    color = "green";
  } else if (weight >= 50 && weight < 100) {
    color = "yellow";
  } else if (weight >= 100 && weight < 150) {
    color = "orange";
  } else if (weight >= 150 && weight < 200) {
    color = "red";
  } else if (weight >= 200 && weight < 300) {
    color = "purple";
  } else if (weight >= 300) {
    color = "maroon";
  }

  return color;
}
function getMarkerSize(weight) {
  // Adjust the marker size based on weight range
  if (weight >= 0 && weight < 50) {
    return 10; // Adjust the marker size as desired
  } else if (weight >= 50 && weight < 100) {
    return 20; // Adjust the marker size as desired
  } else if (weight >= 100 && weight < 150) {
    return 30; // Adjust the marker size as desired
  } else if (weight >= 150 && weight < 200) {
    return 40; // Adjust the marker size as desired
  } else if (weight >= 200 && weight < 300) {
    return 50; // Adjust the marker size as desired
  } else if (weight >= 300) {
    return 60; // Adjust the marker size as desired
  } else {
    return 10; // Default marker size
  }
}

function loadGoogleMapsScript() {
  var script = document.createElement("script");
  script.src =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyDZ7yaHzTGLSE2r2Gj8Ptlw-XqI3rrdeVI&libraries=places&callback=initMap";
  document.head.appendChild(script);
}

loadGoogleMapsScript();
