'use strict';
localStorage.clear()

// containers
const form = document.querySelector('.form-container');
const image_holder = document.querySelector('.image');
const descLimitIndicater = document.querySelector('#current-length');

// buttons
const formClose = document.querySelector('#close-form');
const formSubmit = document.querySelector('#btn-form-sub');
const imageInput = document.querySelector('#select-image');
const myCurLocation = document.querySelector('#icon-location');

let imageReaderURL = '';
let mapEvent;
let yourLocation;


class Place{
    constructor(lat, lng, title, desc, imgPath, date){
        this.coords = [lat, lng]
        this.title = title;
        this.date = date;
        this.desc = desc;
        this.imgPath = imgPath;

        this._setId(this.date);
    }

    _setId(date){
        this.id = Number(date.slice(0,4)+date.slice(5,7)) + Math.floor(Math.random() * date.slice(0,4))  
    }

}


class App{
    #map;
    #mapZoom = 13;
    #places = [];    
    constructor() {
        this._getCurrentPosition()

        formSubmit.addEventListener('click', this._newPlace.bind(this));

        // creating input for user
        imageInput.addEventListener('change', this._takingImageInput)

        // closing the form
        formClose.addEventListener('click', this._hideForm.bind(this));

        // moving map to your current location
        setTimeout(()=>{
            const yourLoc = JSON.parse(localStorage.getItem('current-coords'))
            myCurLocation.addEventListener('click', this._moveToMarker.bind(this,yourLoc))
        },1000);

        // selecting image on clicking it
        image_holder.addEventListener('click', ()=>{
            imageInput.click();
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
        
        // render marker on your location
        yourLocation = L.marker(coords) // generating marker on clicked coordinates
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

        // adding current location to loaclstorage.
        localStorage.setItem('current-coords', JSON.stringify(coords));

        // add event listner on your location.
        yourLocation.on('click', ()=>{
            const title = prompt('add new title: ');
            const desc = prompt('add new desc: ');

            const date = new Date()
            const dt = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,0)}-${date.getDate()}` ;
            const newCurrMarker = new Place(coords[0],coords[1], title, desc, '',dt);
        
            yourLocation.setPopupContent(this._createMarkerTitle(newCurrMarker)).openPopup();
        });
        
        // getting data from localstorage.
        this._getFromLocal();
    }

    // method to make form visible.
    _showForm(mapClick){    
        this.mapEvent = mapClick;
        form.classList.remove('hidden');
        document.querySelector('#title').focus();

        const desc = document.querySelector('#description');
        setInterval(()=>{
            const descValue = desc.value;
            descLimitIndicater.textContent = `${descValue.length}`;
            if(descValue.length > 300) desc.value = descValue.slice(0,300);
        },100)
    }
    
    // method to make form invisible
    _hideForm(){
        form.classList.add('hidden');
    }
    
    // method to convert inputed image into base64 format to store it easily
    _takingImageInput(){
        const reader = new FileReader();
        reader.addEventListener('load', ()=>{
            imageReaderURL = reader.result;
            image_holder.style.backgroundImage = `url(${imageReaderURL})`;
        })
        reader.readAsDataURL(this.files[0]);
    }


    // method to create new place object on submitting form
    _newPlace(e){
        e.preventDefault();
        let place;
        let {lat, lng} = this.mapEvent.latlng;
        const title = document.querySelector('#title');
        const date = document.querySelector('#date');
        const desc = document.querySelector('#description');


        if(title.value === '' || desc.value === '' || date.value === ''){
            alert('Please fill form correctly')
            return 
        }

        // creating place object according to given data form form
        if(imageReaderURL === '') place = new Place(lat, lng, title.value, desc.value, '', date.value);
        else place = new Place(lat, lng, title.value, desc.value, imageReaderURL, date.value);

        // pushing new place to main array and setting place direction to screen center
        this.#places.push(place);
        this.#map.setView(place.coords, this.#mapZoom)

        // rendering new marker for the place
        this.#places.forEach(place => this._renderMarker(place));

        // emptying the form
        title.value = desc.value = date.value =  lat = lng = imageReaderURL = '';
        image_holder.style.backgroundImage = `url('assests/images/t1.png')`;

        // hiding the form and storing array to localstorage
        this._hideForm()
        this._setToLocal(this.#places);
        
    }

    // method to create custom marker popup 
    _createMarkerTitle(place){
        let _desc, html, date;

        _desc = place.desc;
        date = place.date
        const date_year = date.slice(0,4);
        const date_month = date.slice(5,7);
        const date_date = date.slice(8,10);
        const dt = date_date+'/'+date_month+'/'+date_year

        if(place.imgPath != ''){
            html = `
                <h1 class="marker-title">${place.title}</h1>
                <hr>
                <strong style="margin-bottom: 1rem; font-size: 1rem;">Date: ${dt}</strong>
                <p style="width: 200px;">${_desc}</p>
                <div class="marker-image" style="background: url(${place.imgPath});"></div>
                `
            }else{
                html = `
                <h1 class="marker-title">${place.title}</h1>
                <hr>
                <strong style="margin-bottom: 1rem; font-size: 1rem;">Date: ${dt}</strong>
                <p>${_desc}</p>
            `
        }
        return html
    }

    // method to generate new marker on the map
    _renderMarker(place){
        // render workout on map as a marker
        L.marker(place.coords) // generating marker on clicked coordinates
        .addTo(this.#map) // adding marker to map
        .bindPopup(L.popup({ // custominzing popup (i.e. marker)
            maxWidth: 200,
            minWidth: 100,
            className: 'place-marker',
            autoClose: false,
            closeOnClick: false,
        }))
        .setPopupContent(place.title) // setting inner HTML of the marker
        .setPopupContent(this._createMarkerTitle(place)) // setting inner HTML of the marker
        .openPopup();
    }

    _moveToMarker(coords){
        this.#map.setView(coords, this.#mapZoom); 
    }

    //   metod to store data to localstorage
    _setToLocal(places){
        const data = JSON.stringify(places)
        localStorage.setItem('places', data)
    }

    // method to retrive data from localstorage
    _getFromLocal(){
        const data = JSON.parse(localStorage.getItem('places'));

        if (data != null){
            this.#places = data;
            this.#places.forEach(plc => this._renderMarker(plc));
        } else console.log('No Places available');
    }
}

// creating new app
const app = new App();