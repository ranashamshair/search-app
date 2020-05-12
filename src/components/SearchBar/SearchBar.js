import React, { Component } from 'react';
import SearchFilters from '../SearchFilters/SearchFilters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import './SearchBar.css';
import store from "../../store";
import {getLots, getPastLots, getAuctions, getEvents, getNews} from "../../actions";

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
            menu_btn.querySelector('#to_open').style.display = "none";

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

        const { query } = this.state;
        const payload = store.getState();

        payload.page = 0;
        payload.upcomingLoading = true;
        payload.searchQuery = query;
        payload.pagePast = 0;
        payload.pastLoading = true;
        // payload.pageAuctions = 0;
        // payload.auctionsLoading = true;
        // payload.pageEvents = 0;
        // payload.eventsLoading = true;
        payload.pageNews = 0;
        payload.newsLoading = true;
        payload.changedSearch = true;

        store.dispatch( getLots(payload) );

        store.dispatch( getPastLots(payload) );

        // store.dispatch( getAuctions(payload) );
        //
        // store.dispatch( getEvents(payload) );

        store.dispatch( getNews(payload) );
        
    };

    showSearchFilters = (e) => {

        const menu_btn = document.getElementById('menu_search_form_btn');

        menu_btn.classList.add('open');
    };

    render() {
        return (
            <div className="collapse position-fixed h-site-search--search-wrap show" id="searchBox">
                
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
