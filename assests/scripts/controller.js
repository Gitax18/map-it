// INPUTING IMAGE IN FORM *********************************
// const input = document.querySelector('#select-image')
// const image_holder = document.querySelector('.image')
// let image = '';

// console.log(input)
// console.log(image_holder)

// input.addEventListener('change', function(){
//    const reader = new FileReader();
//    reader.addEventListener('load', ()=>{
//         image = reader.result;
//         console.log(image)
//         image_holder.style.backgroundImage = `url(${image})`;
//    })

//    reader.readAsDataURL(this.files[0]);
// })

class APP{
    #map;
    #mapZoom = 12;

    constructor() {
        console.log('hello')
        this._getCurrentPosition();
    }

    _getCurrentPosition(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), failed)
            
            // call back if the user rejects to give location 
            function failed() {
                alert("Can't access position");
            }
        }
    }

    _loadMap(position){
        // retreiving coordinates for position object
        const { latitude, longitude } = position.coords;
        const coords = [latitude, longitude]; // converting coords to array

        // loading map on current coords with zoom (here Map zoom is 10)
        this.#map = L.map('map').setView(coords, this.#mapZoom); 

        // adding custom map theme to map, known as tile
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
          attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.#map);

    }
}

const app = new APP();