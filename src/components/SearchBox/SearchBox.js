import React from 'react';
import SearchBar from '../SearchBar/SearchBar';


import './SearchBox.css';

function SearchBox({handleTabSelect}) {

    return (
        <div>
            <SearchBar handleTabSelect={handleTabSelect} />
        </div>
    );

}

export default SearchBox;
