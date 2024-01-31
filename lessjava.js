// Function to clear search and return to the home page
function clearsearch() {
    let search_element = document.getElementById("search");
    search_element.value = "";
}

// Function to refresh the page
function refreshPage() {
    location.reload();
}


function mike() {
    var recording = new webkitSpeechRecognition();
    recording.lang = "en-GB";
    recording.onresult = function (event) {
        console.log(event);
        document.getElementById('.search').value = event.result[0][0].transcript;
    }
    recording.start();
}

// for changing image in slide-show
let slideIndex = 0;
showSlides();

// function of automatic slider
function showSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 2500);
}

// expand search bar when clicked
function search_size(movie2) {
    // original_movies();
    if (window.innerWidth < 500) {
        return;
    }
    else {
        movie2.style.width = "30vw";
    }
}

// make seach to its inital value, when not clicked
const searchInput = document.getElementById('search');
searchInput.addEventListener('blur', function () {
    if (window.innerWidth < 500) {
        searchInput.style.width = "50vw"
        return;
    } else {
        searchInput.style.width = '200px'; 
    }
});


let watching = false;
let search_done = false;

document.addEventListener('DOMContentLoaded', function () {
    const movieContainers = document.querySelectorAll('.pictures');
    const moviesByCategory = {
        '2024': 'newrelaseMovies2024',
        'romanticmovies': 'romanticmovies',
        'southindian': 'southindianMovies',
        'hindiMovies': 'hindiMovies',
        'actionthrillerMovies': 'actionthrillerMovies',
        'suspensefullMovies': 'suspensefullMovies',
        'comedyMovies': 'comedyMovies',
        'horrorMovies': 'horrorMovies',
        'otherMovies' :'otherMovies'
    };

    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom-100 <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    movieContainers.forEach(movie => {
        
            for (const category in moviesByCategory) {
                if (movie.classList.contains(category) ) {
                    const movieListContainer = document.getElementById(moviesByCategory[category]);

                    // Only append if the container is initially in the viewport
                    if (isInViewport(movieListContainer) && !search_done) {
                        movie.style.display='block';
                        movieListContainer.appendChild(movie);

                    }

                    // Optionally, you can add an event listener to check and load on scroll
                   
                    window.addEventListener('scroll', () => {
                        if (isInViewport(movieListContainer) && !movieListContainer.contains(movie) && !search_done) {
                            movieListContainer.appendChild(movie);
                            movie.style.display='block';
                        }
                    });

                    break;
            }
        }
    });
});


function scrolldiv_left(this_movie_list) {
    scrollMovies(this_movie_list, window.innerWidth * 0.9);
}

function scrolldiv_right(this_movie_list) {
    scrollMovies(this_movie_list, -window.innerWidth * 0.9);
}

function scrollMovies(movieList, moveAmount) {
    movieList.scrollBy(moveAmount, 0);
    updateArrowVisibility(movieList);
}

function updateArrowVisibility(movieList) {
    const leftArrow = movieList.parentElement.querySelector('.left_arrow');
    const rightArrow = movieList.parentElement.querySelector('.right_arrow');

    leftArrow.style.display = movieList.scrollLeft > 0 ? 'block' : 'none';

    const canScrollRight = movieList.scrollLeft + movieList.clientWidth + 2 > movieList.scrollWidth;
    rightArrow.style.display = canScrollRight ? 'none' : 'block';
}



// to search movies 
let c=0;
const moveContainer = document.createElement('div');
moveContainer.className = 'arrow_container';
moveContainer.id='related_arrow_container';
function searchMovies() {

    moveContainer.style.display='none';
    search_done = true;
    dont_display_catogies_movies(); //dont display unnecessary thing

    let serach_movie = document.getElementById("search");
    let available_movies1 = document.getElementById('available_movies');
    available_movies1.style.display = "flex";


    //  for searched movie name 
    const input = document.getElementById('search').value.toLowerCase().trim();
    const movieContainers = document.querySelectorAll('.pictures');

    let result = false;
    let displayedMovies = []; // for storing displayed movie names

    // container to display available movies 
    let available_movies_container = document.querySelector('.search_available_movies');

    movieContainers.forEach((container) => {
        const movieName = container.querySelector('.text').textContent.toLowerCase().trim();

        if (movieName.includes(input) && serach_movie.value != "") {
            if (!displayedMovies.includes(movieName)) {
                container.style.display = 'block';
                available_movies_container.appendChild(container);
                displayedMovies.push(movieName);
                result = true;
            }
            else {
                container.style.display = 'none';
            }
        }
        else {
            container.style.display = 'none';
        }
    });

    const messageElement = document.getElementById('searchMessage'); // message box
    let container =document.querySelector('.arrow_container');
    
    if (!result && serach_movie.value != "") {
        container.style.display='block';
        messageElement.style.display = 'block';
        messageElement.textContent = 'Sorry, Movie not found. Here are some related movies:';
        refreshButton.style.display = 'block';
        showRelatedMovies(input); // to show related movies
    }
    else {
        container.style.display='none';
        messageElement.style.display = 'none';
        messageElement.textContent = '';
        refreshButton.style.display = 'none';
    }

    //  if nothing is search 
    if (serach_movie.value === "" && !watching) {
        refreshPage();
    }
}


// get movies data
function extractMovieData() {
    const movieElements = document.querySelectorAll('.pictures');
    const movies = [];

    movieElements.forEach((element) => {
        const name = element.querySelector('.text').textContent;
        const link = element.querySelector('.link').href;
        const image = element.querySelector('.img').src;
        movies.push({ name, link, image });
        // fuse_best_movie.push({ "title": name });
    });
    return movies;
}

let related_Movies = false;
// show some related movies related to searche movie

function showRelatedMovies(searchQuery) {
    related_Movies = true;
    const relatedMoviesContainer = document.getElementById("relatedMovies");
    relatedMoviesContainer.style.display = "flex";
    clearRelatedMovies();

    const movies = extractMovieData();
    const uniqueMovies = Array.from(new Set(movies.map(movie => movie.name.toLowerCase())))
        .filter(name => !name.includes(searchQuery.toLowerCase()));

    const sortedMovies = uniqueMovies.sort((a, b) => getMatchCount(b, searchQuery.toLowerCase()) - getMatchCount(a, searchQuery.toLowerCase()));

    sortedMovies.slice(0, 15).forEach(movieName => {
        const movie = movies.find(movie => movie.name.toLowerCase() === movieName);
        const movieDiv = createMovieElement(movie);
        movieDiv.style.display='block';
        const mainContainer = document.querySelector('.show_related_movies');
        mainContainer.appendChild(movieDiv);
    });

    moveContainer.style.display='block';
    
    const arrowIcon_right = document.createElement('i');
    arrowIcon_right.className = 'bx bx-chevron-right right_arrow';
    arrowIcon_right.setAttribute("onclick", 'scrolldiv_left(relatedMovies)');

    const arrowIcon_left = document.createElement('i');
    arrowIcon_left.className = 'bx bx-chevron-left left_arrow';
    arrowIcon_left.setAttribute("onclick", 'scrolldiv_right(relatedMovies)');

    const arrowAndMovieContainer = document.getElementById('related_movie_container');
    moveContainer.appendChild(arrowIcon_right);
    moveContainer.appendChild(arrowIcon_left);
    arrowAndMovieContainer.appendChild(moveContainer);
}


function createMovieElement(movie) {
    const movieDiv = document.createElement('div');
    movieDiv.className = 'pictures';
    

    movieDiv.onclick = function () {
        watch_movies_from_related_movies(movie.link);
    };

    const img = document.createElement('img');
    img.className = 'img';
    img.src = movie.image;
    img.alt = movie.name;

    const playButton = document.createElement('a');
    playButton.className = 'bx bx-play-circle play-btn';

    const textDiv = document.createElement('h2');
    textDiv.className = 'text';
    textDiv.textContent = movie.name;

    textDiv.appendChild(playButton);
    movieDiv.appendChild(img);
    movieDiv.appendChild(textDiv);

    img.addEventListener('load', () => {
        const imgHeight = img.clientHeight;
        playButton.style.position = 'absolute';
        playButton.style.top = '40%';
        playButton.style.left = '50%';

        playButton.style.transform = 'translate(-50%, -50%)';
        playButton.style.marginTop = `-${imgHeight / 2}px`;
    });

    return movieDiv;
}

// Rest of the code remains unchanged...
function clearRelatedMovies() {
    const relatedMoviesContainer = document.getElementById('relatedMovies');
    relatedMoviesContainer.innerHTML = '';
}


// Function to get the count of character matches between two strings
function getMatchCount(movieName, searchQuery) {
    let matchCount = 0;
    for (let i = 0; i < searchQuery.length; i++) {
        if (movieName.includes(searchQuery[i])) {
            matchCount++;
        }
    }
    return matchCount;
}


// function watchmovie(movie_link) {
//     if (!search_done) {
//         dont_display_catogies_movies();
//         console.log("home");
//         watching = true;
//         show_movie_on_click(movie_link);
//     }
//     if (search_done) {
//         show_movie_on_click(movie_link);
//         watchmovie_while_searching();
//     }
// }
function watchmovie(movie_link) {
    if (!search_done) {
        dont_display_catogies_movies();
        console.log("home");
        watching = true;
        show_movie_on_click(movie_link);
    }
    if (search_done) {
        show_movie_on_click(movie_link);
        watchmovie_while_searching();
    }

}

// dont display movie when serch is done or movie is played
function dont_display_catogies_movies() {
    //  for image slider
    let image_slider = document.getElementById('show'); // Don't display image slider
    image_slider.style.display = 'none';

    let movies_list = document.getElementById('listofmovies');
    movies_list.style.display = "none";
}


function watchmovie_while_searching() {
    clearsearch();
    watching = true;
    let available_movies1 = document.getElementById('available_movies');
    available_movies1.style.display = "none";
}

function watch_movies_from_related_movies(movie_link) {
    moveContainer.style.display='none';
    clearsearch();
    show_movie_on_click(movie_link);
    let related_Movies = document.getElementById("relatedMovies");
    let search = document.getElementById('searchMessage');
    let refresh_Button = document.getElementById('refreshButton');

    related_Movies.style.display = "none";
    search.style.display = "none";
    refresh_Button.style.display = "none";

}



function show_movie_on_click(link) {
    
    var existingContainer = document.getElementById('movie_on_click');
    if (existingContainer) {
        existingContainer.parentNode.removeChild(existingContainer);
    }

    // Create the container div
    var outer_containerDiv = document.createElement('div');
    outer_containerDiv.className = 'outer_watch_movie_container';
    
    var containerDiv = document.createElement('div');
    containerDiv.className = 'watch_movie_container';
    containerDiv.id = 'movie_on_click';

    // Create the paragraph element
    var paragraphElement = document.createElement('p');
    paragraphElement.className = 'website_name_in_watching_movies';
    paragraphElement.textContent = 'Latest Movies';

    // Create the share button icon
    var icon_container = document.createElement('div');
    icon_container.className = 'icon_container';

    var shareButtonIcon = document.createElement('i');
    shareButtonIcon.className = 'bx bx-share-alt sharebutton';
    shareButtonIcon.addEventListener('click', function () {
        // Call the shareVideo function when the share button is clicked
        shareVideo(link);
    });

    var delete_button = document.createElement('i');
    delete_button.className = "bx bx-message-x delete_button";
    delete_button.setAttribute("onclick", 'refreshPage()')

    icon_container.appendChild(shareButtonIcon);
    icon_container.appendChild(delete_button);

    // Create the iframe without setting the src attribute initially
    var iframeElement = document.createElement('iframe');
    // iframeElement.setAttribute('preload', 'auto');

    iframeElement.className = 'watch_movie_frame';
    iframeElement.setAttribute('webkitallowfullscreen', '');
    iframeElement.setAttribute('mozallowfullscreen', '');
    iframeElement.setAttribute('allowfullscreen', '');
    
    iframeElement.src = link;
    // Set the preload attribute to load metadata only
   

    // Append the elements to the container div
    containerDiv.appendChild(paragraphElement);
    containerDiv.appendChild(icon_container);
    containerDiv.appendChild(iframeElement);

    // Append the container div to the document body (you can replace document.body with the desired parent element)
    document.body.appendChild(containerDiv);

    console.log('1');
    blockVideoIcon();
    
    

}

function shareVideo(videoLink) {
    if (navigator.share) {
        navigator.share({
            title: 'Shared Video',
            text: 'Check out this video!',
            url: window.href
        })
        .then(() => console.log('Successfully shared',window.hr))
        .catch((error) => console.error('Error sharing:', error));
    } else {
        alert('Web Share API not supported on this browser');
    }
}

function customShare(videoLink) {
    var shareOptions = [
        { platform: 'WhatsApp', iconClass: 'fab fa-whatsapp', url: 'whatsapp://send?text=' + encodeURIComponent(videoLink) },
        { platform: 'Facebook', iconClass: 'fab fa-facebook-f', url: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(videoLink) },
        { platform: 'Email', iconClass: 'fas fa-envelope', url: 'mailto:?body=' + encodeURIComponent(videoLink) },
        // Add more platforms as needed
    ];

    // Create a custom sharing menu
    var menuContainer = document.createElement('div');
    menuContainer.className = 'custom-share-menu';

    shareOptions.forEach(function (option) {
        var optionLink = document.createElement('a');
        optionLink.href = option.url;
        optionLink.target = '_blank';

        var optionIcon = document.createElement('i');
        optionIcon.className = option.iconClass;

        optionLink.appendChild(optionIcon);
        menuContainer.appendChild(optionLink);
    });

    // Append the custom sharing menu to the document body
    document.body.appendChild(menuContainer);
}


function blockVideoIcon() {
    console.log('yes');
    let icon = document.querySelector('.dkyyqF');

    if (icon) {
        console.log(icon.href);
    } else {
        console.log('Element with class .dkyyqF not found.');
    }
}

// Call the function
blockVideoIcon();


// Call the function




//  dont show inspect pannel or view source code
// document.addEventListener("contextmenu",function(e){
//     e.preventDefault()
// },false);