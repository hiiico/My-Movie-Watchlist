const inputTitle = document.querySelector('#title');
const inputDirector = document.querySelector('#director');
const inputYear = document.querySelector('#year');

const addBtn = document.querySelector('#add-movie');
addBtn.addEventListener('click', addMovie);

const editBtn = document.querySelector('#edit-movie');
editBtn.addEventListener('click', editMovie);

const loadBtn= document.querySelector('#load-movies');
loadBtn.addEventListener('click', loadMovies);

const movieList = document.querySelector('#movie-list');

const BASE_URL = 'http://localhost:3030/jsonstore/movies';
let movieId = null;

async function loadMovies() {
    try {
        const moviesRes = await fetch(BASE_URL);
        const moviesData = await moviesRes.json();
        const moviesArr = Object.values(moviesData);
console.log(moviesArr);

        movieList.innerHTML = '';

        moviesArr.forEach(movie => {
            const divMovie = document.createElement('div');
            divMovie.classList.add('movie');

            const divContent = document.createElement('div');
            divContent.classList.add('content');
            const pTitle = document.createElement('p');
            pTitle.textContent = movie.title;
            const pDirector = document.createElement('p');
            pDirector.textContent = movie.director;
            const pYear = document.createElement('p');
            pYear.textContent = movie.year;
            divContent.appendChild(pTitle);
            divContent.appendChild(pDirector);
            divContent.appendChild(pYear);

            divMovie.appendChild(divContent);

            const divContainer = document.createElement('div');
            divContainer.classList.add('buttons-container');
            const changeBtn = document.createElement('button');
            changeBtn.classList.add('change-btn');
            changeBtn.textContent = 'Edit';
            changeBtn.addEventListener('click', changeMovie);
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', deleteMovie);

            divContainer.appendChild(changeBtn);
            divContainer.appendChild(deleteBtn);

            divMovie.appendChild(divContainer);

            movieList.appendChild(divMovie);

            function changeMovie() {
                editBtn.disabled = false;
                addBtn.disabled = true;
                inputTitle.value = movie.title;
                inputDirector.value = movie.director;
                inputYear.value = movie.year;

                movieId = movie._id;
            }

            async function deleteMovie() {
                movieId = movie._id
                
                await fetch(`${BASE_URL}/${movieId}`, {
                    method: 'DELETE'
                })

                editBtn.disabled = true;
                addBtn.disabled = false;
                movieId = null;
                await loadMovies();
            }
            
        });

    } catch (err) {
        console.log(err);
    }
}

async function addMovie() {
    const title = inputTitle.value.trim();
    const director = inputDirector.value.trim();
    const year = Number(inputYear.value.trim());

    await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({title, director, year})
    });

    inputTitle.value = '';
    inputDirector.value = '';
    inputYear.value = '';

    await loadMovies();
}

async function editMovie() {
    const title = inputTitle.value.trim();
    const director = inputDirector.value.trim();
    const year = inputYear.value.trim();

    const _id = movieId;

    await fetch(`${BASE_URL}/${movieId}`, {
        method: 'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({title, director, year, _id})
    });

    inputTitle.value = '';
    inputDirector.value = '';
    inputYear.value = '';

    addBtn.disabled = true;
    editBtn.disabled = false;
    movieId = null;

    await loadMovies();
}
