import React, { Component } from 'react';
import SearchFilters from '../SearchFilters/SearchFilters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import './SearchBar.css';
import store from "../../store";
import {getLots, getPastLots} from "../../actions";

class SearchBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchFiltersActive: true,
            query: '',
        };

        this.delay = 0;

        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
        this.showSearchFilters = this.showSearchFilters.bind(this);

    }

    componentDidMount() {
        const menu_btn = document.getElementById('menu_search_form_btn');

        if(menu_btn){
            menu_btn.addEventListener('click', e => {
                const el = document.getElementById('searchBox');

                if(el && el.classList.contains('show')){
                    menu_btn.classList.remove('open');
                    menu_btn.querySelector('#to_open').style.display = "block";
                }
                else{
                    menu_btn.classList.add('open');
                    menu_btn.querySelector('#to_open').style.display = "none";
                }
            });
        }


        store.subscribe(() => {
            const {searchQuery} = store.getState();

            this.setState({query: searchQuery})
        });

        // this.showSearchFilters();
    }


    handleSearchSubmit = (e) => {
        e.preventDefault();

        // const searchFormContainer = document.querySelector('#searchBox');
        //
        // searchFormContainer.classList.remove('h-site-search--search-empty');
        //
        // this.setState({
        //     searchFiltersActive: true
        // });

        const { query } = this.state;
        const { staticFilters } = store.getState();

        store.dispatch( getLots({
            page: 0,
            upcomingLoading: true,
            searchQuery: query,
            staticFilters: staticFilters
        }) );

        store.dispatch( getPastLots({
            pagePast: 0,
            pastLoading: true,
            searchQuery: query,
            staticFilters: staticFilters
        }) );
        
    };

    showSearchFilters = (e) => {

        const menu_btn = document.getElementById('menu_search_form_btn');

        menu_btn.classList.add('open');
        // menu_btn.innerHTML =

        // const searchFilter = document.querySelector('.h-search-filter');
        // const searchFilterButtons = document.querySelectorAll('.h-search-filter-btn');
        //
        // searchFilter.classList.add('h-search-filter-show');
        //
        // searchFilterButtons.forEach( (button, i) => {
        //     setInterval(function() {
        //
        //         button.classList.add('show');
        //
        //     }, this.delay * i)
        // });
        //
    }

    render() {
        return (
            <div className="collapse position-fixed h-site-search--search-wrap" id="searchBox">
                
                <section className="searchBox h-site-search--search">
                    
                    <form action="/" className="h-site-search--form" onSubmit={this.handleSearchSubmit}>
                        <div className="container">
                            <div className="row justify-content-center">

                                <div className="col-12 col-lg-4 form-group form-item h-form-group h-form-item d-flex flex-column flex-lg-row align-items-lg-center">
                                    <div className="ui icon input">
                                        <label htmlFor="search" className="sr-only">Search Auctions/Lots</label>
                                        <input type="text" id="search" className="form-control h-form-control" placeholder="Enter the terms you wish to search for" value={this.state.query} onChange={e => this.setState({query: e.target.value})} />
                                        <button type="submit" className="position-relative"><FontAwesomeIcon icon={faSearch} size="sm" /></button>
                                    </div>
                                </div>

                                <SearchFilters searchFiltersActive={this.showSearchFilters} />                        

                            </div>
                        </div>
                    </form>
                        
                </section>                
    
            </div>
        );
    }
    
    
    
}

export default SearchBar;
