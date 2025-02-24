//feat: implement custom hook useMovies

import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
function Search({ query, setQuery }) {
  const inputEL = useRef(null);
  
  //focus search input + clear it  search when  hit enter
  useEffect(() => {
    
    //listen for Enter key
    function callback(e) {
      if (document.activeElement===inputEL.current) return;//if it is already focused...do nothing 
      
      if (e.code === "Enter"){
        inputEL.current.focus();//focus 
        setQuery("");
      } 
    }
    document.addEventListener("keydown", callback);

    return function () {
      //CLEANUP, prevents form adding the same event listner manytimes to our component on each mount/render
      document.removeEventListener("keydown", callback);
    };
  }, [setQuery]);
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEL}
    />
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>MY FAV MOVIES</h1>
    </div>
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
function MoviesList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}
function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>📆</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function Box({ children }) {
  //list movies form the search
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieDetailes({
  selectedId,
  onCloseMovie,
  handelAdd,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

const countRef = useRef(0);

  const watchdeUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  function handelAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    onAddWatched(newWatchedMovie);
  }
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genere,
  } = movie;
  useEffect(
    function () {
      async function getMovieDetailes() {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apiKEY=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetailes();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `movie | ${title}`;

      return function () {
        document.title = "movieeees";
      };
    },
    [title]
  );

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="details">
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull;{runtime}
              </p>
              <p>{genere}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    size={24}
                    maxRating={10}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button
                      className="btn-add"
                      onClick={() => handelAdd(movie)}
                    >
                      +Add to the list
                    </button>
                  )}
                </>
              ) : (
                <p>you rated this movie with {watchdeUserRating} ⭐</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>starring {actors}</p>
            <p>directed by {director}</p>
          </section>
        </div>
      )}
    </>
  );
}
function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
      <button
        className="btn-delete "
        onClick={() => onDeleteWatched(movie.imdbID)}
      >
        X
      </button>
    </li>
  );
}
function WatchedMoviesList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}
// function WatchedBox() {
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watched={watched} />
//           <WatchedMoviesList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }
function Main({ children }) {
  return <main className="main">{children}</main>;
}

const KEY = "b63ed038";

export default function App() {
  
    const [query, setQuery] = useState("");
    const [selectedId, setSelectedId] = useState(null);


    const {movies,isLoading,error} = useMovies(query);
    
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue);
  });

  function handelSelectMovie(id) {
    if (id === selectedId) handelCloseMovie();
    else setSelectedId(id);
  }
  function handelCloseMovie() {
    setSelectedId(null);
  }

  function handelAddWatched(movie) {
    setWatched([...watched, movie]);
    handelCloseMovie();
  }
  function handelDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      //load saved watched movies form localstorage

      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  useEffect(function () {
    //keyboard event listners
    function callback(e) {
      if (e.code === "Escape") handelCloseMovie();
    }

    document.addEventListener("keydown", callback);
    return function () {
      //CLEANUP, prevents form adding the same event listner manytimes to our component on each mount/render
      document.removeEventListener("keydown", callback);
    };
  }, []);
  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && !error && <Loader />}
          {!isLoading && !error && (
            <MoviesList movies={movies} onSelectMovie={handelSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetailes
              onCloseMovie={handelCloseMovie}
              onAddWatched={handelAddWatched}
              selectedId={selectedId}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                onDeleteWatched={handelDeleteWatched}
                watched={watched}
              />
            </>
          )}
        </Box>
        {/* <WatchedBox /> */}
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">loading ...</p>;
}
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}
