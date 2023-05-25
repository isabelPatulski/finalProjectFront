import { LOCAL_SERVER_URL } from "../../settings.js";

const BACKEND_URL = LOCAL_SERVER_URL + "/showings"
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const movieURL = "https://api.themoviedb.org/3/movie/"
const APIkey = "?api_key=54a941ed644bdc17078cdb84d84995f2"



export function showingsMethods(match){
    let movieId = match.params.id
    getMovie(movieURL + movieId + APIkey);
    getShowings(BACKEND_URL)
}


async function getMovie(url) {
    const response = await fetch(url);
    const data = await response.json();
    showMovie(data);
}

function showMovie(movie) {
    document.getElementById("movieinfo").innerHTML = "";
    const { poster_path, title, overview, release_date, vote_average, backdrop_path, runtime} = movie;

        const movieEl = document.createElement("div");
        movieEl.classList.add("selectedMovie");

        movieEl.innerHTML = `
        <div id="content-movie" style="background: src("${IMGPATH+backdrop_path}")>
            <h2>${title}</h2>
            <img
                src="${IMGPATH + poster_path}"
                alt="${title}"
            />
            <div class="movie-info">
            <h5>Summery:</h5>
            <p id="overview-text">${overview}</p
            <p id="release_date">Release Date - ${release_date} </p>
            <p id="vote_average">Public Rating - ${vote_average}/10 </p>        
            <p id="vote_average">Movie Length - ${runtime} minutes </p>
            
        <div>
        `;

        movieinfo.appendChild(movieEl);
    }


    async function getShowings(url) {
        const resp = await fetch(url);
        const respData = await resp.json();
        showShowings(respData);
    }

    async function showShowings(showings) {
        document.getElementById("showDates").innerHTML = "";
        
        showings.forEach((show) => {
        const { date, time, price, cinema, movie} = show;

        const showingE1 = document.createElement("div");
        showingE1.classList.add("showingDay");
        showingE1.innerHTML = `
                    <h2>${date}</h2>
                    `;

        const showingE2 = document.createElement("div");
            showingE2.classList.add("showingTimes");
            showingE2.innerHTML = `
                <div class="showingTime">
                <a class="btn btn-primary" href="#/showSeats?movie=${movie}&hall=${cinema}&price=${price}&date=${date}&time=${time}"  
                data-navigo> 
                ${time}
                </a>
            `;
            showDates.appendChild(showingE1);
            showDates.appendChild(showingE2);
        })
    }

