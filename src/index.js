const mapLocation = document.getElementById('map')
const countryContainer = document.getElementById('liked-countries')



   function initMap(){
    let map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 33, lng: 65},
      zoom: 4
    });
    fetch('http://localhost:3000/countries')
    .then(res => res.json())
    .then(function(json){
      console.log(json)

      json.forEach(function(country){

        let image = {
          url: country.flag,
          // This marker is 20 pixels wide by 32 pixels high.

          size: new google.maps.Size(40, 30),
          origin: new google.maps.Point(0, 0),
           // The anchor for this image is the base of the flagpole at (0, 32).
           anchor: new google.maps.Point(0, 32),
           scaledSize: new google.maps.Size(30, 30)
        };
        //Adding Marker
        let marker = new google.maps.Marker({
          position:{lat: country['location_lat'] ,lng: country['location_lng'] },
          map:map,
          title: country["name"],
          //size: new google.maps.Size(2, 3),
          icon: image
        });
          // created a variable for population number to have commas
          let countryPopulation = Number(parseFloat(country["population"]).toFixed(2)).toLocaleString('en', {
          minimumFractionDigits: 0
          });
          // console.log(countryPopulation)
        let infoWindow = new google.maps.InfoWindow({
          content: `<div class="country-info"><h4 class="country-title">${country["name"]}<h4>
                   <p>Native Name: ${country["native_name"]}</p>
                   <p>Population: ${countryPopulation}</p>
                   <p>Official Language: ${country["language"]}</p>
                   <p>Capital: ${country["capital"]}</p>
                   <p> Currency: ${country["currency_name"]}</p>
                   <p> Currency Symbol: ${country["currency_symbol"]}</p>
                   <a href="https://en.wikipedia.org/wiki/${country["native_name"]}"> More Info </a> <span><button data-id="${country["id"]}" id="like_btn" class="btn btn-primary"> Like </button></span>
          </div>`
        })
         //console.log(country["latlng"][0])
        //Added Marker?

        marker.addListener('click', function() {
          infoWindow.open(map, marker);
          // tried to get the parentelment, add a class and use css on the class
          // let countryInfo = document.querySelector(".gm-style-iw").parentElement
          // countryInfo.className += "map-country-info";
        }
        )

      }
    )
  })
}

//iterating through favorite_countries database and pushing the liked country_ids to the array
let likedCountriesArray = []

fetch(`http://localhost:3000/favorite_countries`).then(response => response.json())
.then(json => {
  json.forEach(country => {
    likedCountriesArray.push(country.country_id)
  })
})

fetch(`http://localhost:3000/countries`).then(response => response.json())
.then(json => {
  json.forEach(country => {
    if (likedCountriesArray.includes(country.id)){
      countryContainer.innerHTML += `<div class="country-flag"><h2 class="country-name">${country.name}</h2><img  width="200px" src="${country.flag}"> <button id="${country.id}" class="btn btn-danger">Delete</button> </div>`
    }
  })
})






//Add an Event addListener
mapLocation.addEventListener('click', event => {
  event.preventDefault()

  if(event.target.id === "like_btn"){
    // deb  ugger
    let countryId = parseInt(event.target.dataset.id)

    fetch(`http://localhost:3000/favorite_countries`, {
      method: 'POST',
      headers: {
        'Content-type': "application/json",
        Accepts: 'application/json'
      },
      body: JSON.stringify({
        user_id: 1,
        country_id: countryId
      })
    })

    fetch(`http://localhost:3000/countries`).then(response => response.json())
    .then(json => {
      json.find(country => {
        if (country.id === countryId) {
          countryContainer.innerHTML += `<div class="country-flag"><h2 class="country-name">${country.name}</h2><img  width="200px" src="${country.flag}"> <button id="${country.id}" class="btn btn-danger">Delete</button> </div>`
       }
      })
    })

  }
})

countryContainer.addEventListener('click', event => {
  event.preventDefault()
  // debugger
let deletebutton = event.target.className

    event.target.parentElement.remove()

  if( deletebutton === "btn btn-danger"){
    fetch(`http://localhost:3000/favorite_countries/delete`,
      { method: "PATCH",
      headers: {
        'Content-type': 'application/json',
        Accepts: 'application/json'
      },
      body: JSON.stringify({
        user_id: 1,
        country_id: event.target.id
      })
    })



  }
})

// langugage for each country in an array
let languageArray = []
// country for each currency in an array
let currencyArray = []
fetch(`http://localhost:3000/countries`).then(response => response.json())
.then(json => {
  json.forEach(country => {
    languageArray.push(country.language)
    currencyArray.push(country.currency_name)

  })
  return languageArray

})


// function to find the most common string in an array
 function mostFreqStr(arr) {
  var obj = {}, mostFreq = 0, which = [];

  arr.forEach(ea => {
    if (!obj[ea]) {
      obj[ea] = 1;
    } else {
      obj[ea]++;
    }

    if (obj[ea] > mostFreq) {
      mostFreq = obj[ea];
      which = [ea];
    } else if (obj[ea] === mostFreq) {
      which.push(ea);
    }
  });

  return which;
}

let mostCommonLanguage = mostFreqStr(languageArray)
let mostCommonCurrency = mostFreqStr(currencyArray)

// find the amount of times English shows up in languagearray
// function englishCount(array) {
// counter = 0
// array.forEach(lang => {
//   if (lang === "English" ) {
//     counter ++;
//   }
//
// })
// return counter
// }

// amount of times Euro shows up in currencyArray
function euroCount(array) {
counter = 0
array.forEach(lang => {
  if (lang === "Euro" ) {
    counter ++;
  }

})
return counter
}

// how many countries speak that specific language
function countryLangCount(array, language) {
counter = 0
array.forEach(lang => {
  if (lang === language ) {
    counter ++;
  }

})
return counter
}


// let countryPopulation = Number(parseFloat(country["population"]).toFixed(2)).toLocaleString('en', {
// minimumFractionDigits: 0
