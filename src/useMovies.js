import { useEffect, useState } from "react";

const KEY = "68533e66";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, SetIsLoading] = useState(false);
  const [isError, SetError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          SetIsLoading(true);

          SetError("");
          const res = await fetch(
            ` http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok) {
            throw new Error("Something went worng with fetching movies");
          }

          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie Not found !");

          setMovies(data.Search);
        } catch (err) {
          if (err.name !== "AbortError") {
            SetError(err.message);
          }
        } finally {
          SetIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        SetError("");
        //handleCloseSelectedMovie();
        return;
      }

      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, isError };
}
