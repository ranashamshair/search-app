import React, {Component} from 'react';
import SearchFilters from '../SearchFilters/SearchFilters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import Loader from 'react-loader-spinner';

import './SearchBar.css';
import store from "../../store";
import {getLots, getPastLots, getNews, updateFiltersOnly, updateSearch} from "../../actions"; //  getAuctions, getEvents,

import SearchFiltersNew from '../SearchFiltersNew/SearchFiltersNew';

import data from '../../requestApi.json';

class SearchBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchFiltersActive: true,
            query: '',
            submited: false,
            count: 1, // delete this when api return count of lots,
            currentTab: 'upcoming',
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

        const _this = this;

        store.subscribe(() => {
            const {searchQuery, upcomingLoading, pastLoading, newsLoading, currentTab } = store.getState();

            console.log('LOADING: ', upcomingLoading, pastLoading, newsLoading);
            console.log('LOADING RES: ', (!upcomingLoading && !pastLoading && !newsLoading && _this.state.submited));

            if(!upcomingLoading && !pastLoading && !newsLoading && _this.state.submited){
                this.setState({query: searchQuery, submited: false, currentTab: currentTab})
            }else{
                this.setState({query: searchQuery, currentTab: currentTab})
            }
        });

        // this.showSearchFilters();
    }

    handleButtonClick = (e) => {
        const buttons = document.querySelectorAll('.tabs button');
        buttons.map = [].map;
        buttons.map((item) => item.classList.contains('active') ? item.classList.remove('active') : '')
        e.target.classList.add('active');
    }

    handleSearchSubmit = (e) => {
        e.preventDefault();

        const { currentTab, query } = this.state;
        // TODO finish URL params for search !!!
        // if (window.history.pushState) {
        //     let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        //     const params = [];
        //
        //     if (currentTab) params.push('tab=' + currentTab);
        //     if (query) params.push('search=' + query);
        //
        //     if (params.length) {
        //         newUrl += '?' + params.join('&');
        //     }
        //
        //     window.history.pushState({path:newUrl},'',newUrl);
        // }

        store.dispatch(updateSearch({searchText: query }));

        // TODO remake this method !!!
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
        const { currentTab } = this.state;

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
                                timeout={100000}
                            />
                        </div>
                    ) : ''
                }

                <div className="collapse h-site-search--search-wrap show" id="searchBox"> {/*position - fixed  searchBox change id to remove action hide filter block*/}

                    <section className="searchBox h-site-search--search p-0 pt-4 px-md-4 pt-md-5">

                        <form action="/" className="h-site-search--form" onSubmit={this.handleSearchSubmit}>
                            <div className="container">
                                <div className="column justify-content-center">

                                    <div className="mx-auto pb-5 col-12 col-md-6 col-lg-6 col-xl-4 form-group form-item h-form-group h-form-item d-flex flex-column flex-lg-row align-items-lg-center">
                                        <div className="ui icon input">
                                            <label htmlFor="search" className="sr-only">Search Auctions/Lots</label>
                                            <input type="text" id="search" className="form-control h-form-control" placeholder="Enter the terms you wish to search for" value={this.state.query} onChange={e => this.setState({query: e.target.value})} />
                                            <button type="submit" className="position-relative w-25"><FontAwesomeIcon icon={faSearch} size="sm" /></button>
                                        </div>
                                    </div>

                                    <div className="tabs mx-auto col-12 d-flex justify-content-center">
                                        {/*when click save type of lots and get request to api and save to redux*/}
                                        <button
                                          className={'text-uppercase py-2 px-lg-5 mr-md-3 mr-2 px-md-2' + (currentTab === 'upcoming' ? ' active' : '')}
                                          name="upcoming"
                                          onClick={this.props.handleTabSelect}>
                                            Upcoming ({data.upcoming.count}) {/*get data from redux store about count of lots (count field)*/}
                                        </button>
                                        <button
                                          className={'text-uppercase py-2 px-lg-5 mr-md-3 mr-2 px-md-2' + (currentTab === 'past' ? ' active' : '')}
                                          name="past"
                                          onClick={this.props.handleTabSelect}>
                                            Past ({data.past.count}) {/*get data from redux store about count of lots (count field)*/}
                                        </button>
                                        <button
                                          className={'text-uppercase py-2 px-lg-5 mr-md-3 mr-2 px-md-2' + (currentTab === 'auctions' ? ' active' : '')}
                                          name="auctions"
                                          onClick={this.props.handleTabSelect}>
                                            Auctions ({data.auctions.count}) {/*get data from redux store about count of lots (count field)*/}
                                        </button>
                                        <button
                                          className={'text-uppercase py-2 px-lg-5 mr-md-3 mr-2 px-md-2' + (currentTab === 'other' ? ' active' : '')}
                                          name="other"
                                          onClick={this.props.handleTabSelect}>
                                            Other ({data.other.count}) {/*get data from redux store about count of lots (count field)*/}
                                        </button>
                                    </div>

                                    {/*<SearchFilters searchFiltersActive={this.showSearchFilters} />*/}
                                    <SearchFiltersNew />
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
