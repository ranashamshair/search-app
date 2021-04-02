import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import Loader from 'react-loader-spinner';

import './SearchBar.css';
import store from "../../store";
import {updateSearch,} from "../../actions"; //  getAuctions, getEvents,

import SearchFiltersNew from '../SearchFiltersNew/SearchFiltersNew';

// import data from '../../requestApi.json';

class SearchBar extends Component {

    constructor(props) {
        super(props);

        const storeState = store.getState();

        this.state = {
            searchFiltersActive: true,
            query: '',
            submited: false,
            count: 1, // delete this when api return count of lots,
            currentTab: storeState.currentTab || 'upcoming',
            sorting: storeState.sorting || '',
            categories: storeState.selectedCategories || [],
            pricemin: storeState.priceMin || '',
            pricemax: storeState.priceMax || '',

            lotsCount: storeState.lotsCount || 0,
            pastLotsCount: storeState.pastLotsCount || 0,
            auctionsCount: storeState.auctionsCount || 0,
            postsCount: storeState.postsCount || 0,
        };
        this._isMounted = false;

        this.delay = 0;

        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
        this.showSearchFilters = this.showSearchFilters.bind(this);
    }

    toggleFilter(menu_btn) {
        const el = document.getElementById('searchBox');

        if(el && el.classList.contains('show')){
            menu_btn.classList.remove('open');
            menu_btn.querySelector('#to_open').style.display = "block";
        }
        else{
            menu_btn.classList.add('open');
            menu_btn.querySelector('#to_open').style.display = "none";
        }
    }

    componentDidMount() {
        this._isMounted = true;
        const menu_btn = document.getElementById('menu_search_form_btn');

        if(menu_btn){
            menu_btn.querySelector('#to_open').style.display = "none";

            menu_btn.addEventListener('click', e => this.toggleFilter(menu_btn));
        }

        const _this = this;

        store.subscribe(() => {
            if (this._isMounted) {
                const {
                    searchText,
                    sorting,
                    loading,
                    currentTab,
                    selectedCategories,
                    priceMin,
                    priceMax,

                    lotsCount,
                    pastLotsCount,
                    auctionsCount,
                    postsCount
                } = store.getState();

                const stateChanges = {
                    query: searchText,
                    currentTab: currentTab,
                    sorting: sorting,
                    categories: selectedCategories,
                    pricemin: priceMin,
                    pricemax: priceMax,
                    lotsCount: lotsCount,
                    pastLotsCount: pastLotsCount,
                    auctionsCount: auctionsCount,
                    postsCount: postsCount,
                };

                if(!loading && _this.state.submited){
                    stateChanges.submited = false;
                }

                this.setState(stateChanges);
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false;

        const menu_btn = document.getElementById('menu_search_form_btn');
        if (menu_btn) {
            menu_btn.removeEventListener('click', e => this.toggleFilter(menu_btn));
        }
    }

    handleSearchSubmit = (e) => {
        e.preventDefault();

        const {
            currentTab,
            query,
            sorting,
            categories,
            pricemin,
            pricemax
        } = this.state;

        const storeState = store.getState();

        if (
            storeState.currentTab !== currentTab ||
            storeState.searchText !== query ||
            storeState.sorting !== sorting ||
            storeState.priceMin !== pricemin ||
            storeState.priceMax !== pricemax
        ) {
            if (window.history.pushState) {
                let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                const params = [];

                if (currentTab) params.push('tab=' + currentTab);
                if (query) params.push('search=' + query);

                if (categories.length) {
                    params.push('categories=' + categories.join(','));
                }

                if (pricemin) params.push('min_price=' + pricemin);
                if (pricemax) params.push('max_price=' + pricemax);
                if (sorting) params.push('sort=' + sorting);

                if (params.length) {
                    newUrl += '?' + params.join('&');
                }

                window.history.pushState({path:newUrl},'',newUrl);
            }

            store.dispatch(updateSearch({searchText: query }));
        }
    };

    showSearchFilters = (e) => {
        const menu_btn = document.getElementById('menu_search_form_btn');

        menu_btn.classList.add('open');
    };


    render() {
        const {
            currentTab,
            lotsCount,
            pastLotsCount,
            auctionsCount,
            postsCount
        } = this.state;

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

                        <form action="/" className="h-site-search--form">
                            <div className="container">
                                <div className="column justify-content-center">

                                    <div className="mx-auto pb-5 col-12 col-md-6 col-lg-6 col-xl-4 form-group form-item h-form-group h-form-item d-flex flex-column flex-lg-row align-items-lg-center">
                                        <div className="ui icon input">
                                            <label htmlFor="search" className="sr-only">Search Auctions/Lots</label>
                                            <input type="text" id="search" className="form-control h-form-control" placeholder="Enter the terms you wish to search for" value={this.state.query} onChange={e => this.setState({query: e.target.value})} />
                                            <button type="submit" className="position-relative w-25" onClick={this.handleSearchSubmit}><FontAwesomeIcon icon={faSearch} size="sm" /></button>
                                        </div>
                                    </div>

                                    <div className="tabs mx-auto col-12 d-flex justify-content-center">
                                        {/*when click save type of lots and get request to api and save to redux*/}
                                        <button
                                          className={'text-uppercase py-2 px-lg-5 mr-md-3 mr-2 px-md-2' + (currentTab === 'upcoming' ? ' active' : '')}
                                          name="upcoming"
                                          onClick={this.props.handleTabSelect}>
                                            Upcoming {(lotsCount && `(${lotsCount})`) || ''} {/*get data from redux store about count of lots (count field)*/}
                                        </button>
                                        <button
                                          className={'text-uppercase py-2 px-lg-5 mr-md-3 mr-2 px-md-2' + (currentTab === 'past' ? ' active' : '')}
                                          name="past"
                                          onClick={this.props.handleTabSelect}>
                                            Past {(pastLotsCount && `(${pastLotsCount})`) || ''} {/*get data from redux store about count of lots (count field)*/}
                                        </button>
                                        <button
                                          className={'text-uppercase py-2 px-lg-5 mr-md-3 mr-2 px-md-2' + (currentTab === 'auctions' ? ' active' : '')}
                                          name="auctions"
                                          onClick={this.props.handleTabSelect}>
                                            Auctions {(auctionsCount && `(${auctionsCount})`) || ''} {/*get data from redux store about count of lots (count field)*/}
                                        </button>
                                        <button
                                          className={'text-uppercase py-2 px-lg-5 mr-md-3 mr-2 px-md-2' + (currentTab === 'other' ? ' active' : '')}
                                          name="other"
                                          onClick={this.props.handleTabSelect}>
                                            Other {(postsCount && `(${postsCount})`) || ''} {/*get data from redux store about count of lots (count field)*/}
                                        </button>
                                    </div>

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
