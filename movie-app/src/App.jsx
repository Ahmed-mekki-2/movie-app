import React, { useEffect,useState } from "react";
import Search from "./components/search";
import MovieCard from "./components/MovieCard";
import {useDebounce} from "react-use";
import { updateSearchCount } from "./appwrite";




const API_BASE_URL =`https://api.themoviedb.org/3`


const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS ={
  method : 'GET',
  headers:{
    accept:'application/json',
    Authorization: `bearer ${API_KEY}`
  }
}



const App =() => {
  const [searchTerm,setSerchTerm] = useState('');
  const [errorMessage,setErrorMessage] = useState('');
  const [movieListe,setMovieListe] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [DebounceSearch,setDebounceSearcheTerm] = useState('');


  //preventiong too many api requests at the time
  //waiting for user to not type for 700ms
  useDebounce(() => setDebounceSearcheTerm(searchTerm),700,[searchTerm])

  const fetchMovies = async (query='') => {
    setIsLoading(true);
    setErrorMessage('');


    try{

      const endpoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
       : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok){
        throw new Error("Failed to fetch movies");
        
      }

      const data = await response.json();
      

      if(data.response == 'false'){
        setErrorMessage(data.Error || 'Failed to fetch a movie');
        setMovieListe([]);
        return;
      }
      setMovieListe(data.results || []);
      
      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0]);
      }


    }catch(error){
        console.error(`error fetching the movies: ${error}`);
        setErrorMessage('please try again later');

    }
    finally{
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies(DebounceSearch);

  },[DebounceSearch]);
  return (
    <main>
    <div className="pattern" />
    <div className="wrapper">
      
      <header>
        <img src="./hero.png" alt="hero banner" />
        <h1>Find <span className="text-gradient">Movie</span> you'll enjoy without huslle</h1>
        <Search searchTerm={searchTerm} setSerrchTerm={setSerchTerm} />
        
      
      </header>
      
      <section className="all-movies">
        <h2 className="mt-[40px]">All Movies</h2>
    

        {isLoading ? (  <spinner />):
         errorMessage ? (<p className="text-red-500">{errorMessage}</p>):
         <ul>
          {movieListe.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
            
          ))}
         </ul>
        }



      </section>
      

    
    </div>
</main>

)
}

export default App;


