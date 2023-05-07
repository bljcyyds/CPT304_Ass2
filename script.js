// 1. As a website user, I would like to see a list of public holidays for a selected country.
// 2. As a website user, I would like to select the area (probably state, province, or city) I am
// residing as well as a public holiday from the list so that I can see: -
// a) The weather information for the selected public holiday in my area.
// b) The available short-term accommodation rental information for the selected day in
// my area.

//get the list of all country
function getCountries() {
  var url = `https://calendarific.com/api/v2/countries?&api_key=ef15b75a715e679a650a7e4f11203f1c5adefc2a`;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var resp = JSON.parse(xhr.responseText);
      var countries = resp.response.countries;
      var countryList = document.getElementById("country");
      countryList.innerHTML = ""; // clear any previous options
      for (var i = 0; i < countries.length; i++) {
        var option = document.createElement("option");
        option.value = countries[i]["iso-3166"];
        option.text = countries[i].country_name;
        countryList.appendChild(option);
      }
    }
  }
  xhr.send();
}


//get the list of all holidays of the selected country
function getHolidays() {
  var country = document.getElementById("country").value;
  console.log(country);
  var url= `https://calendarific.com/api/v2/holidays?&api_key=ef15b75a715e679a650a7e4f11203f1c5adefc2a&country=`+country+`&year=2023`;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var resp = JSON.parse(xhr.responseText);
      var holidays = resp.response.holidays;
      var holidayList = document.getElementById("holiday");
      holidayList.innerHTML = ""; // clear any previous options
      for (var i = 0; i < holidays.length; i++) {
        var option = document.createElement("option");
        option.value = holidays[i].date.iso;
        option.text = holidays[i].name;
        holidayList.appendChild(option);
      }
    }
  };
  xhr.send();
}

// get the list of areas for the selected country
function getAreas() {
  var country = document.getElementById("country").value;
  // Geonames API endpoint for retrieving administrative areas
  var endpoint = `https://secure.geonames.org/searchJSON?country=${country}&adminCode1&adminCode2&adminCode3&maxRows=1000&username=bjxl`;

  var xhr = new XMLHttpRequest();
  xhr.open('GET', endpoint, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var response = JSON.parse(xhr.responseText);
      var areas = response.geonames;
      var dropdown = document.getElementById('area');
      dropdown.innerHTML = '<option value="">Select an area</option>';
      for (var i = 0; i < areas.length; i++) {
        var areaName = areas[i].name;
        var areaCode = areas[i].adminCode1 || areas[i].adminCode2 || areas[i].adminCode3;
        var option = document.createElement('option');
        option.value = areaCode;
        option.text = areaName;
        dropdown.appendChild(option);
      }
    }
  };
  xhr.send();
}

// get the weather information for the selected public holiday in my area
function getWeather() {
  var country = document.getElementById("country").value;
  var holidayDate = document.getElementById("holiday").value;
  console.log(holidayDate);
  var area = document.getElementById("area").options[document.getElementById("area").selectedIndex].text;
  dt = new Date(holidayDate);
  dt = dt.getTime() / 1000;
  console.log(dt);
  var url = `https://api.openweathermap.org/data/2.5/weather?q=${area},${country}&appid=3441ed941ca1951eb786a4e927e78643&dt=${dt}`;

  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      //get the max and min temperature
      var resp = JSON.parse(xhr.responseText);
      var temperature = resp.main.temp;
      var description = resp.weather[0].description;
      var maxTemp = resp.main.temp_max;
      var minTemp = resp.main.temp_min;
      temperature = Math.round(temperature - 273.15);
      maxTemp = Math.round(maxTemp - 273.15);
      minTemp = Math.round(minTemp - 273.15);
      var weatherDiv = document.getElementById("weather");
      weatherDiv.innerHTML = "<p>Weather : " + description + ", max temperature: " +
        maxTemp + " &#8451 , min temperature: " + minTemp + " &#8451;</p>";

    }
    else {
      var weatherDiv = document.getElementById("weather");
      weatherDiv.innerHTML = "<p>Weather unavailable</p>";

    }
  }
  xhr.send();
}



// get the available short-term accommodation rental information for the selected day in my area
function getAccommodation() {
  var country = document.getElementById("country").value;
  var holidayDate = document.getElementById("holiday").value;
  console.log(holidayDate)

  holidayDate1 = new Date(holidayDate);
  holidayDate1.setDate(holidayDate1.getDate() + 1);
  holidayDate1 = holidayDate1.toISOString().slice(0, 10);
  console.log(holidayDate1)

  var area = document.getElementById("area").options[document.getElementById("area").selectedIndex].text;


  var url=`https://booking-com.p.rapidapi.com/v1/hotels/locations?name=${area}&locale=en-gb`;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.setRequestHeader("x-rapidapi-key", "7850e78e8cmshee1e207d582fd4ap1849e5jsnb4f4ba717540");
  xhr.setRequestHeader("x-rapidapi-host", "booking-com.p.rapidapi.com");

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var resp = JSON.parse(xhr.responseText);
      var id = resp[0].dest_id;
      console.log(id);
      getAccommodation1(id, holidayDate, holidayDate1);
    }
  }
  xhr.send();
}

function getAccommodation1(id, holidayDate, holidayDate1) {

  var url = `https://booking-com.p.rapidapi.com/v1/hotels/search?locale=en-us&dest_type=city&filter_by_currency=USD&order_by=popularity&units=metric&dest_id=${id}&checkin_date=${holidayDate}&checkout_date=${holidayDate1}&room_number=1&adults_number=2`;

  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.setRequestHeader("x-rapidapi-key", "7850e78e8cmshee1e207d582fd4ap1849e5jsnb4f4ba717540");
  xhr.setRequestHeader("x-rapidapi-host", "booking-com.p.rapidapi.com");

  console.log(url);

  xhr.onreadystatechange = function () {
    console.log(xhr.readyState, xhr.status);
    if (xhr.readyState == 4 && xhr.status == 200) {
      var resp = JSON.parse(xhr.responseText);

      var hotels = resp.result;
      console.log(hotels);
      var hotelDiv = document.getElementById("accommodation");
      hotelDiv.innerHTML = "";
      var hotelList = document.createElement("ul");
      for (var i = 0; i < hotels.length; i++) {
        var hotel = document.createElement("li");
        hotel.innerHTML = "<p>Hotel name: " + hotels[i].hotel_name + ", price: " + hotels[i].price_breakdown.all_inclusive_price + " " + hotels[i].price_breakdown.currency + "</p>";
        hotelList.appendChild(hotel);
      }

      hotelDiv.appendChild(hotelList);

    }
    if (xhr.readyState == 4 && xhr.status != 200) {
      var hotelDiv = document.getElementById("accommodation");
      hotelDiv.innerHTML = "<p>Accommodation unavailable</p>";

    }

  }
  xhr.send();


}


