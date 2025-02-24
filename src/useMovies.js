import { useState, useEffect } from "react";
const KEY = "b63ed038";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      //api fetching and api requests cleanup
      const controller = new AbortController(); //for aborting api requests resulted form fast keystorks (race condition)
      async function fetchMovies() {
        // if(!query) return;
        try {
          setError("");
          setIsLoading(true);

          const res = await fetch(
            `https://www.omdbapi.com/?apiKEY=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("something went wrong with fetching movies");
          const data = await res.json();
          if (data.Response === "False")
            throw new Error("movie not found !!!!");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        //if nothing worthy yet entered for search
        setMovies([]);
        setError("");
        return;
      }
    //   handelCloseMovie();
      fetchMovies();
      return function () {
        controller.abort();
      }; //clean up effect
    },
    [query]
  );


  return {movies,isLoading,error}
}
