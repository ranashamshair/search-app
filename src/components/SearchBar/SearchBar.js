import React, { Component } from 'react';
import SearchFilters from '../SearchFilters/SearchFilters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import Loader from 'react-loader-spinner';

import './SearchBar.css';
import store from "../../store";
import {getLots, getPastLots, getAuctions, getEvents, getNews, updateFiltersOnly} from "../../actions";

class SearchBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchFiltersActive: true,
            query: '',
            submited: false
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

        this.setState({submited: true}, () => {
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
            payload.changedLots = true;
            payload.changedPastLots = true;
            // payload.changedAuctions = true;
            // payload.changedEvents = true;
            payload.changedArticles = true;

            let types = payload.staticFilters.contentType;
            let allFiltersUnchecked = (!types.lots && !types.auctions && !types.events && !types.stories);

            if(allFiltersUnchecked || types.lots) {
                store.dispatch(getLots(payload));

                if(!payload.staticFilters.upcomingOnly){
                    store.dispatch(getPastLots(payload));
                }
            }
            // store.dispatch( getAuctions(payload) );
            // store.dispatch( getEvents(payload) );
            if(allFiltersUnchecked || types.stories) {
                if(payload.searchQuery){
                    store.dispatch(getNews(payload));
                }
                else{
                    payload.news = [];
                    payload.newsLoading = false;
                    payload.newsMessage = "Empty search keyword";

                    store.dispatch(updateFiltersOnly(payload));
                }
            }
        })
        
    };

    showSearchFilters = (e) => {

        const menu_btn = document.getElementById('menu_search_form_btn');

        menu_btn.classList.add('open');
    };

    render() {
        if(this.state.submited){
            setTimeout(() => {
                this.setState({submited: false})
            }, 2000)
        }

        return (
            <>
                {
                    this.state.submited ? (
                        <div className="preloader-blur">
                            <Loader
                                type="ThreeDots"
                                color="#8C2828"
                                height={50}
                                width={50}
                                timeout={2000}
                            />
                        </div>
                    ) : ''
                }

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

            </>
        );
    }
    
    
    
}

export default SearchBar;
