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
'use strict';

const form = document.querySelector('.form-container');
const formClose = document.querySelector('#close-form');
const formSubmit = document.querySelector('#btn-form-sub');
const selectedImage = document.querySelector('.image');
const selectImageBtn = document.querySelector('#select-image');
const imageInput = document.querySelector('#select-image');
const image_holder = document.querySelector('.image');
let imageReaderURL = '';
let mapEvent;


class Place{
    constructor(title, desc, imgPath){
        this.title = title;
        this.desc = desc;
        this.imgPath = imgPath;
    }

    _setPopupTitle(){
        this.popup_desc = `${this.title.slice(0, 25)}...`
    }
}


class App{
    #map;
    #mapZoom = 13;
    #places = [];
    #mapEvent;
    
    constructor() {

        this._getCurrentPosition()

        // creating temporary image URL
        const imageReaderURL = ""; 

        formSubmit.addEventListener('click', this._newPlace.bind(this));

        // creating input for user
        imageInput.addEventListener('change', this._takingImageInput)

        // closing the form
        formClose.addEventListener('click', this._hideForm.bind(this));

        // selecting image on clicking it
        selectedImage.addEventListener('click', ()=>{
            selectImageBtn.click();
        })
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

        // adding click event to map
        this.#map.on('click', this._showForm.bind(this));

        // render workout on map as a marker
        L.marker(coords) // generating marker on clicked coordinates
        .addTo(this.#map) // adding marker to map
        .bindPopup(L.popup({ // custominzing popup (i.e. marker)
            maxWidth: 200,
            minWidth: 100,
            className: 'your-marker',
            autoClose: false,
            closeOnClick: false,
        }))
        .setPopupContent(`You are Here`) // setting inner HTML of the marker
        .openPopup();

    }

    _showForm(mapClick){    
        this.mapEvent = mapClick;
        form.classList.remove('hidden');
    }
    
    _hideForm(){
        form.classList.add('hidden');
    }

    _takingImageInput(){
        const reader = new FileReader();
        reader.addEventListener('load', ()=>{
            imageReaderURL = reader.result;
            console.log(imageReaderURL)
            image_holder.style.backgroundImage = `url(${imageReaderURL})`;
        })
        reader.readAsDataURL(this.files[0]);
    }
    
    _newPlace(e){
        e.preventDefault();
        const {lat, lng} = this.mapEvent.latlng;
        const title = document.querySelector('#title').value;
        const desc = document.querySelector('#description').value;
        
    }

    _renderMarker(place){
        // render workout on map as a marker
        L.marker(place.coords) // generating marker on clicked coordinates
        .addTo(this.#map) // adding marker to map
        .bindPopup(L.popup({ // custominzing popup (i.e. marker)
            maxWidth: 380,
            minWidth: 100,
            className: 'place-marker',
            autoClose: false,
            closeOnClick: false,
        }))
        .setPopupContent(`hello world`) // setting inner HTML of the marker
        .openPopup();
    
      }

}

const app = new App();

