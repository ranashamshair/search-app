import React, {Component} from 'react';

import Loader from 'react-loader-spinner';

import './SearchBar.css';
import store from "../../store";

import SearchFiltersNew from '../SearchFiltersNew/SearchFiltersNew';

class SearchBar extends Component {

    constructor(props) {
        super(props);

        const storeState = store.getState();

        this.loadingsAfterMount = 0;
        this.state = {
            searchFiltersActive: true,
            query: '',
            submited: false,
            count: 1, // delete this when api return count of lots,
            currentTab: this.props.openTabs || storeState.currentTab || 'upcoming',
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

        const _this = this;

        store.subscribe(() => {
            if (_this._isMounted) {
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

                if (_this._isMounted && _this.loadingsAfterMount < 2) {
                    ++_this.loadingsAfterMount
                }

                const stateChanges = {
                    query: searchText,
                    currentTab: (_this.loadingsAfterMount !== 2) ? _this.props.openTabs || currentTab : currentTab,
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
    }

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
                    // this.state.submited ? (
                    this.props.isLoading ? (
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

                                    <div className="tabs mx-auto col-12 d-flex justify-content-center">
                                        {/*when click save type of lots and get request to api and save to redux*/}
                                        <button
                                          className={'text-uppercase py-2 px-lg-5 mr-md-3 mr-2 px-md-2' + (currentTab === 'upcoming' ? ' active' : '')}
                                          name="upcoming"
                                          onClick={this.props.handleTabSelect}>
                                            Upcoming {(lotsCount && currentTab === 'upcoming' && `(${lotsCount})`) || ''} {/*get data from redux store about count of lots (count field)*/}
                                        </button>
                                        <button
                                          className={'text-uppercase py-2 px-lg-5 mr-md-3 mr-2 px-md-2' + (currentTab === 'past' ? ' active' : '')}
                                          name="past"
                                          onClick={this.props.handleTabSelect}>
                                            Past {(pastLotsCount && currentTab === 'past' && `(${pastLotsCount})`) || ''} {/*get data from redux store about count of lots (count field)*/}
                                        </button>
                                        <button
                                          className={'text-uppercase py-2 px-lg-5 mr-md-3 mr-2 px-md-2' + (currentTab === 'auctions' ? ' active' : '')}
                                          name="auctions"
                                          onClick={this.props.handleTabSelect}>
                                            Auctions {(auctionsCount && currentTab === 'auctions' && `(${auctionsCount})`) || ''} {/*get data from redux store about count of lots (count field)*/}
                                        </button>
                                        <button
                                          className={'text-uppercase py-2 px-lg-5 mr-md-3 mr-2 px-md-2' + (currentTab === 'other' ? ' active' : '')}
                                          name="other"
                                          onClick={this.props.handleTabSelect}>
                                            Other {(postsCount && currentTab === 'other' && `(${postsCount})`) || ''} {/*get data from redux store about count of lots (count field)*/}
                                        </button>
                                    </div>

                                    <SearchFiltersNew loadChanges={this.props.loadChanges} />
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
