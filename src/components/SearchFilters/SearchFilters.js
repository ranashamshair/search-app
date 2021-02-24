import React, { Component } from 'react';
import './SearchFilters.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons';

import {connect} from "react-redux";
import {getAuctions, getCategories, getEvents, getLots, getNews, getPastLots, updateFiltersOnly} from "../../actions";
import store from "../../store";
import Loader from "react-loader-spinner";


class SearchFilters extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // submited: false,
            submited: true,
            upcoming: false,
            types: {
                lots: false,
                auctions: false,
                events: false,
                stories: false
            },
            pricemin: '',
            pricemax: '',

            upcomingSaved: false,
            categoriesSaved: [],
            typesSaved: {
                lots: false,
                auctions: false,
                events: false,
                stories: false
            },
            priceminSaved: '',
            pricemaxSaved: '',

            filterCounter: 0,

            dropdowns: {
                upcoming: false,
                category: false,
                other: false
            }

        };

        this.saveUpcomingFilter = this.saveUpcomingFilter.bind(this);
        this.cancelUpcomingFilter = this.cancelUpcomingFilter.bind(this);
        this.saveCategoryFilter = this.saveCategoryFilter.bind(this);
        this.cancelCategoryFilter = this.cancelCategoryFilter.bind(this);
        this.saveOtherFilters = this.saveOtherFilters.bind(this);
        this.cancelOtherFilter = this.cancelOtherFilter.bind(this);
        this.handleChangeType = this.handleChangeType.bind(this);
        this.resetAll = this.resetAll.bind(this);
    }

    componentDidMount() {
        this.props.getCategories();

        this.checkFilterCount();

        const _this = this;

        store.subscribe(() => {
            const { upcomingLoading, pastLoading, newsLoading } = store.getState();

            if(!upcomingLoading && !pastLoading && !newsLoading && _this.state.submited){
                this.setState({submited: false});
            }
        });
    }

    handleChangeType(e) {
        const tg = e.target, { types } = this.state;

        types[tg.id] = tg.checked;

        this.setState({types: types})
    }


    checkFilterCount() {
        const { typesSaved } = this.state;

        let filterCounter = 0;

        if(typesSaved.lots) ++filterCounter;
        if(typesSaved.auctions) ++filterCounter;
        if(typesSaved.events) ++filterCounter;
        if(typesSaved.stories) ++filterCounter;

        this.setState({filterCounter: filterCounter});
    }

    categorySelected = categoryId => (this.state.categoriesSaved.indexOf(categoryId) !== -1);

    saveUpcomingFilter = e => {
        const { upcoming, dropdowns } = this.state;
        dropdowns.upcoming = false;

        this.setState({upcomingSaved: upcoming, dropdowns: dropdowns}, () => this.updateResults());
    };

    cancelUpcomingFilter = e => {
        const { upcomingSaved, dropdowns } = this.state;
        dropdowns.upcoming = false;

        this.setState({upcoming: upcomingSaved, dropdowns: dropdowns});
    };

    saveCategoryFilter = e => {
        const { dropdowns } = this.state;
        dropdowns.category = false;

        const categoriesEls = document.querySelectorAll('input[data-input="categories_chechbox"]:checked');

        const categories = [];
        if(categoriesEls && categoriesEls.length > 0){
            for(let ch of categoriesEls){
                categories.push(ch.value);
            }
        }

        this.setState({categoriesSaved: categories, dropdowns: dropdowns}, () => this.updateResults());
    };

    cancelCategoryFilter = e => {
        const { dropdowns } = this.state;
        dropdowns.category = false;

        this.resetCategoriesFilter();

        this.setState({dropdowns: dropdowns});
    };

    resetCategoriesFilter(clear = false){
        const categoriesEls = document.querySelectorAll('input[data-input="categories_chechbox"]');

        if(categoriesEls && categoriesEls.length > 0){
            for(let ch of categoriesEls){
                ch.checked = clear ? false : this.categorySelected(ch.value);
            }
        }
    }

    saveOtherFilters(e) {
        const { types, pricemin, pricemax, dropdowns } = this.state;
        dropdowns.other = false;

        this.setState({typesSaved: types, priceminSaved: pricemin, pricemaxSaved: pricemax, dropdowns: dropdowns}, () => {
            this.checkFilterCount(); this.updateResults()
        });
    }

    cancelOtherFilter(e) {
        const { typesSaved, priceminSaved, pricemaxSaved, dropdowns } = this.state;
        dropdowns.other = false;

        this.setState({types: typesSaved, pricemin: priceminSaved, pricemax: pricemaxSaved, dropdowns: dropdowns});
    }

    resetAll(e) {
        this.resetCategoriesFilter(true);

        this.setState({
            upcoming: false,
            types: {
                lots: false,
                // auctions: false,
                // events: false,
                stories: false
            },
            pricemin: '',
            pricemax: '',
            upcomingSaved: false,
            categoriesSaved: [],
            typesSaved: {
                lots: false,
                // auctions: false,
                // events: false,
                stories: false
            },
            priceminSaved: '',
            pricemaxSaved: '',

            filterCounter: 0,

            dropdowns: {
                upcoming: false,
                category: false,
                other: false,
            }

        }, () => this.updateResults(true))
    }

    updateResults(resetSearch = false) {
        this.setState({submited: true}, () => {
            const { upcomingSaved, categoriesSaved, typesSaved, priceminSaved, pricemaxSaved } = this.state;

            const payload = store.getState();

            payload.page = 0;
            payload.pagePast = 0;
            // payload.pageAuctions = 0;
            // payload.pageEvents = 0;
            payload.pageNews = 0;
            payload.upcomingLoading = true;
            payload.pastLoading = true;
            // payload.auctionsLoading = true;
            // payload.eventsLoading = true;
            payload.newsLoading = true;
            payload.staticFilters = {
                upcomingOnly: upcomingSaved,
                contentType: typesSaved,
                categories: categoriesSaved,
                pricemin: priceminSaved,
                pricemax: pricemaxSaved,
            };

            if(resetSearch) payload.searchQuery = '';


            let types = typesSaved;
            let allFiltersUnchecked = (!types.lots && !types.auctions && !types.events && !types.stories);

            if(allFiltersUnchecked || types.lots){
                store.dispatch( getLots(payload) );

                if(!upcomingSaved){
                    store.dispatch( getPastLots(payload) );
                }
            }
            // store.dispatch( getAuctions(payload) );
            // store.dispatch( getEvents(payload) );
            if(allFiltersUnchecked || types.stories){
                if(payload.searchQuery){
                    store.dispatch(getNews(payload));
                }else{
                    payload.news = [];
                    payload.newsLoading = false;
                    payload.newsMessage = "Empty search keyword";

                    store.dispatch(updateFiltersOnly(payload));
                }
            }
        });
    }

    render() {
        const { submited, upcoming, upcomingSaved, categoriesSaved, priceminSaved, pricemaxSaved, types, pricemin, pricemax, filterCounter, dropdowns } = this.state;


        // if(submited){
        //     setTimeout(() => {
        //         this.setState({submited: false})
        //     }, 2000)
        // }

        return (
            <>
                {
                    submited ? (
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

                <div className="col-12 col-lg-8 h-search-filter h-search-filter-show" id="container__filters">

                    <div className="filter-container">
                        <div className="btn-group">

                            <button className={ upcomingSaved ? 'h-search-filter-btn mr-3 show ui filter button primary' : 'h-search-filter-btn mr-3 show ui filter button'} type="button" id="UpcomingOnly" aria-haspopup="true" aria-expanded="false" onClick={() => {
                                dropdowns.upcoming = !dropdowns.upcoming;
                                this.setState({dropdowns: dropdowns})
                            }}>Upcoming Only</button>

                            <div className={dropdowns.upcoming ? 'dropdown-menu show' : 'dropdown-menu'} aria-labelledby="UpcomingOnly" >
                                <div className="dropdown-item-alt">
                                    <h6 className="font-weight-bold">Limit results to upcoming items only</h6>
                                    <p>Applies to lots, events and auctions</p>

                                    <div className="ui toggle checkbox">
                                        {/*<div className="custom-control custom-switch mb-3">*/}
                                        <input type="checkbox" name="upcoming_only" id="upcoming-only" checked={upcoming} onChange={e => this.setState({upcoming : e.target.checked})} />
                                        <label htmlFor="upcoming-only"><small>Upcoming Only</small></label>
                                        {/*</div>*/}

                                        <a className="btn btn-sm btn-cancel" onClick={this.cancelUpcomingFilter}>Cancel</a>
                                        <a className="btn btn-sm btn-save" onClick={this.saveUpcomingFilter}>Save</a>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="btn-group">

                            <button className={ (categoriesSaved.length > 0) ? 'h-search-filter-btn mr-3 show dropdown-toggle ui filter button primary has-counter' : 'h-search-filter-btn mr-3 show dropdown-toggle ui filter button' } data-offset="10" type="button" id="Categories" aria-haspopup="true" aria-expanded="false" onClick={() => {
                                dropdowns.category = !dropdowns.category;
                                if(!dropdowns.category) this.resetCategoriesFilter();

                                this.setState({dropdowns: dropdowns})
                            }}>
                                <i className="tags icon" />
                                Categories
                                {
                                    (categoriesSaved.length > 0) ? (<span id="counter__categories" className="ui black circular label">{categoriesSaved.length}</span>) : ''
                                }
                            </button>

                            <div className={dropdowns.category ? 'dropdown-menu show' : 'dropdown-menu'} aria-labelledby="Categories">
                                <div className="dropdown-item-alt">
                                    <h6 className="font-weight-bold">Categories</h6>
                                    <p className="mb-1">Filter your results by specialisms.</p>
                                    {
                                        this.props.categories.map(item => (
                                            <div className="ui checkbox" key={'category_' + item.id}>
                                                <input type="checkbox" data-input="categories_chechbox" id={'category_' + item.id} defaultChecked={this.categorySelected(item.id)} value={item.id} />
                                                <label htmlFor={'category_' + item.id}>{item.name}</label>
                                            </div>
                                        ))
                                    }
                                    <a className="btn btn-sm btn-cancel mt-2" onClick={this.cancelCategoryFilter}>Cancel</a>
                                    <a className="btn btn-sm btn-save mt-2" onClick={this.saveCategoryFilter}>Save</a>
                                </div>
                            </div>

                        </div>

                        <div className="btn-group">

                            <button className={
                                (filterCounter > 0) ? 'h-search-filter-btn mr-3 show ui filter button primary has-counter' : (
                                    (priceminSaved || pricemaxSaved) ? 'h-search-filter-btn mr-3 show ui filter button primary' : 'h-search-filter-btn mr-3 show ui filter button'
                                ) } type="button" id="OtherFilters" aria-haspopup="true" aria-expanded="false" onClick={() => {
                                dropdowns.other = !dropdowns.other;
                                this.setState({dropdowns: dropdowns})
                            }}>
                                <FontAwesomeIcon icon={faFilter} size="sm" />
                                Other Filters
                                {
                                    (filterCounter > 0) ? (<span id="counter__filter" className="ui black circular label">{filterCounter}</span>) : ''
                                }
                            </button>

                            <div className={dropdowns.other ? 'dropdown-menu show' : 'dropdown-menu'} aria-labelledby="OtherFilters">
                                {/*<div className="ui filter popup bottom left transition visible" aria-labelledby="OtherFilters">*/}
                                <div className="dropdown-item-alt">
                                    <h6 className="font-weight-bold">Type</h6>
                                    <p className="mb-1">Filter by type of content.</p>

                                    <div className="ui checkbox">
                                        <input type="checkbox" id="lots" onChange={this.handleChangeType} checked={types.lots} />
                                        <label htmlFor="lots">Lots</label>
                                    </div>
                                    {/*<div className="ui checkbox">*/}
                                    {/*    <input type="checkbox" id="auctions" onChange={this.handleChangeType} checked={types.auctions} />*/}
                                    {/*    <label htmlFor="auctions">Auctions</label>*/}
                                    {/*</div>*/}
                                    {/*<div className="ui checkbox">*/}
                                    {/*    <input type="checkbox" id="events" onChange={this.handleChangeType} checked={types.events} />*/}
                                    {/*    <label htmlFor="events">Events</label>*/}
                                    {/*</div>*/}
                                    <div className="ui checkbox">
                                        <input type="checkbox" id="stories" onChange={this.handleChangeType} checked={types.stories} />
                                        <label htmlFor="stories">News &amp; Stories</label>
                                    </div>

                                    <h6 className="font-weight-bold mt-3">Limit results to price range</h6>
                                    <p>Applies to lots only</p>

                                    <div className="input-group mb-3">
                                        <div className="ui right labeled input">
                                            <label htmlFor="amount" className="ui label">Low $</label>
                                            <input type="text" placeholder="Amount" id="amount" value={pricemin} onChange={e => this.setState({pricemin : e.target.value})} />
                                            <div className="ui basic label">.00</div>
                                        </div>
                                    </div>

                                    <div className="input-group mb-3">
                                        <div className="ui right labeled input">
                                            <label htmlFor="amount" className="ui label">High $</label>
                                            <input type="text" placeholder="Amount" id="amount" value={pricemax} onChange={e => this.setState({pricemax : e.target.value})} />
                                            <div className="ui basic label">.00</div>
                                        </div>
                                    </div>

                                    <a className="btn btn-sm btn-cancel" onClick={this.cancelOtherFilter}>Cancel</a>
                                    <a className="btn btn-sm btn-save" onClick={this.saveOtherFilters}>Save</a>

                                </div>
                            </div>

                        </div>

                        <div className="search-filter__anim-in-left">
                            <button type="button" className="h-search-filter-btn mr-3 show ui filter grey button" id="clear" onClick={this.resetAll}>
                                <i className="redo alternate icon"/>
                                {/*<FontAwesomeIcon icon={faRedo} size="sm" />*/}
                            </button>
                        </div>
                    </div>

                </div>
            </>
        );
    }
}

function mapStateToProps(state) {
    // console.log('store state: ', state);

    return {
        categories: state.categories
    };
}

export default connect(
    mapStateToProps,
    { getCategories }
)(SearchFilters);
