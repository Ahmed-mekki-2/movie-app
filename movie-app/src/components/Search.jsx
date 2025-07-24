import React from "react";



const Search = ({searchTerm,setSerrchTerm}) => {
    return (
        <div className="search" >
            <div>
                <img src="search.svg" alt="search" />
                <input type="text"                 
                placeholder="Search through thounsands of movies"
                value={searchTerm}
                onChange={(event) => setSerrchTerm(event.target.value)} />
            </div>
        </div>
)
}



export default Search