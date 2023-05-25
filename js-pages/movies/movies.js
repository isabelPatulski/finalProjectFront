const MOVIE_API = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=54a941ed644bdc17078cdb84d84995f2&page=1";

const IMGPATH = "https://image.tmdb.org/t/p/w1280";





// initially get 20 movies
export function movieMethods(){
    getMovies(MOVIE_API);
}


export async function getMovies(url) {
    const resp = await fetch(url);
    const respData = await resp.json();
    showMovies(respData.results);
}

function showMovies(movies) {
    document.getElementById("main").innerHTML = "";

    movies.forEach((movie) => {
        const { poster_path, title, overview, id} = movie;

        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");

        movieEl.innerHTML = `
        <div id="${title}">
            <img
                src="${IMGPATH + poster_path}"
                alt="${title}"
            />

            <div class="movie-data">
                <h4>${title}</h4>   
            </div>
            <div class="overview">
                <h5>Overview:</h5>
                ${overview}
                <br>

                <a class="btn btn-primary" href="#/showShowings?movie=${title}&id=${id}"  
    
                data-navigo> 
                Showings 
                </a>
            
            </div>
        <div>
        `;
    
        main.appendChild(movieEl);
    });
}

