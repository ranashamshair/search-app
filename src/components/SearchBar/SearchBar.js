import React, { Component } from 'react';
import SearchFilters from '../SearchFilters/SearchFilters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import './SearchBar.css';

class SearchBar extends Component {

    constructor(props) {
        super(props)

        this.state = {
            searchFiltersActive: false
        }

        this.delay = 200;

        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
        this.showSearchFilters = this.showSearchFilters.bind(this);

    }

    handleSearchSubmit = (e) => {
        e.preventDefault();

        const searchFormContainer = document.querySelector('#searchBox');
        
        searchFormContainer.classList.remove('h-site-search--search-empty');
        
        this.setState({
            searchFiltersActive: true
        });

        this.showSearchFilters();
        
    }

    showSearchFilters = (e) => {

        const searchFilter = document.querySelector('.h-search-filter');
        const searchFilterButtons = document.querySelectorAll('.h-search-filter-btn');

        searchFilter.classList.add('h-search-filter-show');

        searchFilterButtons.forEach( (button, i) => {
            setInterval(function() {

                button.classList.add('show');

            }, this.delay * i)
        }); 
        
    }

    render() {
        return (
            <>
                
                <section id="searchBox" className="searchBox position-fixed collapse h-site-search--search h-site-search--search-empty">
                    
                    <form action="/" className="h-site-search--form" onSubmit={this.handleSearchSubmit}>
                        <div className="container">
                            <div className="row justify-content-center">

                                <div className="col-12 col-lg-4 form-group form-item h-form-group h-form-item d-flex flex-column flex-lg-row align-items-lg-center">
                                    <label htmlFor="search" className="sr-only">Search Auctions/Lots</label>
                                    <input type="text" id="search" className="form-control h-form-control" placeholder="Enter the terms you wish to search for" />
                                    <button type="submit" className="position-relative"><FontAwesomeIcon icon={faSearch} size="sm" /></button>
                                </div>

                                <SearchFilters searchFiltersActive={this.showSearchFilters} />                        

                            </div>
                        </div>
                    </form>
                        
                </section>                
    
            </>
        );
    }
    
    
    
}

export default SearchBar;