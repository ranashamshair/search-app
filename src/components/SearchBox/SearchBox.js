import React from 'react';
import SearchBar from '../SearchBar/SearchBar';


import './SearchBox.css';

function SearchBox({handleTabSelect, isLoading, loadChanges, openTabs}) {

    return (
        <div>
            <SearchBar handleTabSelect={handleTabSelect} isLoading={isLoading} loadChanges={loadChanges} openTabs={openTabs} />
        </div>
    );

}

export default SearchBox;
