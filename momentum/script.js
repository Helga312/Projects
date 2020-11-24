//*DOM Elements
const time = document.querySelector('.time'),
    greeting = document.querySelector('.greeting'),
    name = document.querySelector('.name'),
    focus = document.querySelector('.focus'),
    date = document.querySelector(".date"),
    change = document.querySelector(".change"),
    body = document.querySelector("body"),
    transition = document.querySelector(".image-transition"),
    blockquote = document.querySelector('blockquote'),
    figcaption = document.querySelector('figcaption'),
    quoteBtn = document.querySelector('.quote-btn'),
    weatherIcon = document.querySelector('.weather-icon'),
    temperature = document.querySelector('.temperature'),
    humidity = document.querySelector('.humidity'),
    windSpeed = document.querySelector('.wind-speed'),
    weatherDescription = document.querySelector('.weather-description'),
    city = document.querySelector('.city'),
    weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

let today = new Date(),
    hour = today.getHours();

//*Create Images Library
const base = 'assets/images/';
const images = ['01.jpg', '02.jpg', '03.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
let bgImages = [];
let oneImage;
while (bgImages.length < 6) {
    oneImage = images[Math.floor(Math.random() * images.length)];
    if (bgImages.includes(oneImage)) {
        continue;
    } else {
        bgImages.push(oneImage);
    };
};
bgImages = bgImages.concat(bgImages).concat(bgImages.concat(bgImages));

//*Show Time
function showTime() {
    let today = new Date(),
        hour = today.getHours(),
        min = today.getMinutes(),
        sec = today.getSeconds();

    //*Output time
    time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`

    setTimeout(showTime, 1000);
}

//*Add Zeros
function addZero(num) {
    return (parseInt(num, 10) < 10 ? '0' : '') + num;
}

//*Add date and day of the week
function addDate() {
    let today = new Date();


    date.innerText = `${weekday[today.getDay()]}, ${month[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
}

//*Set background and greeting

function setBgGreet() {
    // let today = new Date(20, 10, 2020, 00, 00),
    let today = new Date(),
        hour = today.getHours();

    if (hour >= 0 && hour < 6) {
        // Night
        greeting.textContent = 'Good Night, ';
        dayTime = 'night/';
    } else if (hour >= 6 && hour < 12) {
        //Morning
        greeting.textContent = 'Good Morning, ';
        dayTime = 'morning/';
    } else if (hour >= 12 && hour < 18) {
        //Afternoon
        greeting.textContent = 'Good Afternoon, ';
        dayTime = 'day/';
    } else if (hour >= 18 && hour < 24) {
        //Evening
        greeting.textContent = 'Good Evening, ';
        dayTime = 'evening/';
    }
    document.body.style.backgroundImage = `url(assets/images/${dayTime}${bgImages[hour]})`;
}

//*Refresh image

let timeout = (((59 - today.getMinutes()) * 60000) + ((60 - today.getSeconds()) * 1000));
function changeImg() {
    setTimeout(() => { transition.classList.add("appear") }, timeout - 800);
    setTimeout(() => { transition.classList.remove("appear") }, timeout + 900);
    setTimeout(refresh, timeout);
}
function refresh() {
    setBgGreet();
    setTimeout(() => { transition.classList.add("appear") }, 3599200);
    setTimeout(() => { transition.classList.remove("appear") }, 3600900);
    setTimeout(refresh, 3600000)
}


//*Get Name
function getName() {
    name.addEventListener('click', () => {
        name.innerText = '';
        name.focus();
    });
    if (localStorage.getItem('name') === null) {
        name.textContent = '[your name here]';
    } else {
        name.textContent = localStorage.getItem('name');
    }
}

//*Set Name
function setName(e) {
    if (e.type === 'keypress') {
        //* Make sure enter is pressed
        if (e.which === 13 || e.keyCode === 13) {
            if (e.target.innerText) {
                localStorage.setItem('name', e.target.innerText);
            } else {
                e.target.innerText = localStorage.getItem('name');
            }
            name.blur();
        }
    } else { // 'blur' event
        if (e.target.innerText) {
            localStorage.setItem('name', e.target.innerText); //entered value is stored
        } else {
            e.target.innerText = localStorage.getItem('name');
        }
    }
}

//*Get Focus
function getFocus() {
    focus.addEventListener('click', () => {
        focus.innerText = '';
        focus.focus();
    });
    if (localStorage.getItem('focus') === null) {
        focus.textContent = '[your focus here]';
    } else {
        focus.textContent = localStorage.getItem('focus');
    }
}

//*Set Focus
function setFocus(e) {
    if (e.type === 'keypress') {
        //* Make sure enter is pressed
        if (e.which === 13 || e.keyCode === 13) {
            if (e.target.innerText) {
                localStorage.setItem('focus', e.target.innerText);
            } else {
                e.target.innerText = localStorage.getItem('focus');
            }
            focus.blur();
        }
    } else { // 'blur' event
        if (e.target.innerText) {
            localStorage.setItem('focus', e.target.innerText);
        } else {
            e.target.innerText = localStorage.getItem('focus');
        }
    }
}

//*Change bg image smoothly

function viewBgImage(data) {
    const src = data;
    const img = document.createElement('img');
    img.src = src;
    img.onload = () => {
        body.style.backgroundImage = `url( ${src} )`;
    };
};

function getImage() {
    if (hour <= 5) {
        imageTime = 'night/';
    } else if (hour <= 11) {
        imageTime = 'morning/';
    } else if (hour <= 17) {
        imageTime = 'day/';
    } else imageTime = 'evening/';
    let imageSrc = base + imageTime + bgImages[hour];
    hour >= 23 ? hour = 0 : hour++;
    viewBgImage(imageSrc);
    change.disabled = true;
    setTimeout(function () { change.disabled = false }, 1000);
}
//*Get quote from API
async function getQuote() {
    const url = "https://quote-garden.herokuapp.com/api/v2/quotes/random";
    const res = await fetch(url);
    const data = await res.json();
    blockquote.textContent = data.quote.quoteText;
    figcaption.textContent = data.quote.quoteAuthor;
    quoteBtn.disabled = true;
    setTimeout(function () { quoteBtn.disabled = false }, 1000);
};

//*Get weather from API OpenWeather
async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&lang=en&appid=f88e5a686a42c87fa67c26668cb79e4f&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.cod === '404') {
        weatherDescription.textContent = 'location incorrect';
        weatherDescription.style.color = 'green';
        humidity.textContent = `0 %`;
        windSpeed.textContent = `0 m/s`;
    } else {
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        if (data.main.temp > 0) {
            temperature.textContent = `+${Math.floor(data.main.temp)} °C`
        } else temperature.textContent = `${Math.floor(data.main.temp)} °C`;
        humidity.textContent = `humidity: ${data.main.humidity}%`;
        windSpeed.textContent = `wind: ${Math.floor(data.wind.speed)} m/s`;
        weatherDescription.style.color = 'black';
        weatherDescription.textContent = data.weather[0].description;
    };
};
//*Get City
function getCity() {
    city.addEventListener('click', () => {
        city.innerText = '';
        city.focus();
    });
    if (localStorage.getItem('city') === null) {
        city.textContent = '[your city here]';
    } else {
        city.textContent = localStorage.getItem('city');
    }
}
function setCity(e) {
    if (e.type === 'keypress') {
        if (e.which === 13 || e.keyCode === 13) {
            if (e.target.innerText) {
                localStorage.setItem('city', e.target.innerText);
            } else e.target.innerText = localStorage.getItem('city');
            getWeather();
            city.blur();
        }
    } else {
        if (e.target.innerText) {
            localStorage.setItem('city', e.target.innerText);
        } else e.target.innerText = localStorage.getItem('city');
        getWeather();
    }
};

change.addEventListener('click', getImage);
name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);
focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);
document.addEventListener('DOMContentLoaded', getQuote);
quoteBtn.addEventListener('click', getQuote);
document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('keypress', setCity);
city.addEventListener('blur', setCity);

//*Run Time
addDate();
showTime();
setBgGreet();
getName();
getFocus();
changeImg();
getWeather();
getCity();