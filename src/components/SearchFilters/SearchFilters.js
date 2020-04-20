import React, { Component } from 'react';
import './SearchFilters.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons';

import {connect} from "react-redux";
import {getCategories, updateFilters} from "../../actions";
import store from "../../store";


class SearchFilters extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            upcoming: false,
            categories: [],
            types: {
                lots: false,
                // auctions: true,
                events: false,
                stories: false
            },
            pricemin: '',
            pricemax: '',

            upcomingSaved: false,
            categoriesSaved: [],
            typesSaved: {
                lots: false,
                // auctions: true,
                events: false,
                stories: false
            },
            priceminSaved: '',
            pricemaxSaved: '',

            filterCounter: 0,

        };

        this.handleClickInsideDropdown = this.handleClickInsideDropdown.bind(this);
        this.saveUpcomingFilter = this.saveUpcomingFilter.bind(this);
        this.cancelUpcomingFilter = this.cancelUpcomingFilter.bind(this);
        this.checkedCategory = this.checkedCategory.bind(this);
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
    }

    handleClickInsideDropdown(e) {
        return false;
    }

    handleChangeType(e) {
        console.log('event: ', e);

        const tg = e.target, { types } = this.state;

        types[tg.id] = tg.checked;

        this.setState({types: types})
    }


    checkFilterCount() {
        const { typesSaved } = this.state;

        let filterCounter = 0;

        if(typesSaved.lots) ++filterCounter;
        // if(typesSaved.auctions) ++filterCounter;
        if(typesSaved.events) ++filterCounter;
        if(typesSaved.stories) ++filterCounter;

        this.setState({filterCounter: filterCounter});
    }

    checkedCategory(e) {
        console.log('event: ', e);

        const {categories, categoriesSaved} = this.state;
        console.log('categoriesSaved: ', categoriesSaved);
        const val = e.target.value;

        if(e.target.checked){
            categories.push(val);
        }else{
            categories.splice(categories.indexOf(val), 1);
        }

        console.log('categories: ', categories);
        // console.log('categoriesSaved: ', categoriesSaved);

        this.setState({categories: categories});
    }

    categorySelected = categoryId => (this.state.categories.indexOf(categoryId) !== -1);


    saveUpcomingFilter = e => {
        console.log('save this.state.upcoming :  ', this.state.upcoming);
        this.setState({upcomingSaved: this.state.upcoming}, () => this.updateLots());
    };

    cancelUpcomingFilter = e => this.setState({upcoming: this.state.upcomingSaved});


    saveCategoryFilter = e => {
        this.setState({categoriesSaved: this.state.categories}, () => this.updateLots());
    };

    cancelCategoryFilter = e => this.setState({categories: this.state.categoriesSaved});

    saveOtherFilters(e) {
        const { types, pricemin, pricemax } = this.state;

        this.setState({typesSaved: types, priceminSaved: pricemin, pricemaxSaved: pricemax}, () => {
            this.checkFilterCount(); this.updateLots()
        });
    }

    cancelOtherFilter(e) {
        const { typesSaved, priceminSaved, pricemaxSaved } = this.state;

        console.log('typesSaved: ', typesSaved);

        this.setState({types: typesSaved, pricemin: priceminSaved, pricemax: pricemaxSaved});
    }

    resetAll(e) {
        this.setState({
            upcoming: false,
            categories: [],
            types: {
                lots: false,
                // auctions: true,
                events: false,
                stories: false
            },
            pricemin: '',
            pricemax: '',
            upcomingSaved: false,
            categoriesSaved: [],
            typesSaved: {
                lots: false,
                // auctions: true,
                events: false,
                stories: false
            },
            priceminSaved: '',
            pricemaxSaved: '',

            filterCounter: 0,

        }, () => this.updateLots(true))
    }



    updateLots(resetSearch = false) {
        const { upcomingSaved, categoriesSaved, typesSaved, priceminSaved, pricemaxSaved } = this.state;

        let payload = {
            page: 0,
            isLoading: true,
            staticFilters: {
                upcomingOnly: upcomingSaved,
                contentType: typesSaved,
                categories: categoriesSaved,
                pricemin: priceminSaved,
                pricemax: pricemaxSaved,
            }
        };

        if(resetSearch) payload.searchQuery = '';

        store.dispatch( updateFilters(payload) );
    }




    render() {
        const { upcoming, upcomingSaved, categoriesSaved, types, pricemin, pricemax, filterCounter } = this.state;

        return (
            <>
                <div className="col-12 col-lg-8 h-search-filter h-search-filter-show" id="container__filters">

                    <div className="filter-container">
                        <div className="btn-group">

                            <button className={ upcomingSaved ? 'h-search-filter-btn mr-3 show ui filter button primary' : 'h-search-filter-btn mr-3 show ui filter button'} type="button" id="UpcomingOnly" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Upcoming Only</button>

                            <div className="dropdown-menu" aria-labelledby="UpcomingOnly" >
                                <div className="dropdown-item" onClick={this.handleClickInsideDropdown}>
                                    <h6 className="font-weight-bold">Limit results to upcoming items only</h6>
                                    <p>Applies to lots, events and auctions</p>

                                    <div className="ui toggle checkbox">
                                        {/*<div className="custom-control custom-switch mb-3">*/}
                                        <input type="checkbox" name="upcoming_only" id="upcoming-only" value={upcoming} onChange={e => this.setState({upcoming : e.target.checked})} />
                                        <label htmlFor="upcoming-only"><small>Upcoming Only</small></label>
                                        {/*</div>*/}

                                        <a className="btn btn-sm btn-cancel" onClick={this.cancelUpcomingFilter}>Cancel</a>
                                        <a className="btn btn-sm btn-save" onClick={this.saveUpcomingFilter}>Save</a>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="btn-group">

                            <button className={ (categoriesSaved.length > 0) ? 'h-search-filter-btn mr-3 show dropdown-toggle ui filter button primary has-counter' : 'h-search-filter-btn mr-3 show dropdown-toggle ui filter button' } data-offset="10" type="button" id="Categories" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="tags icon" />
                                Categories
                                {
                                    (categoriesSaved.length > 0) ? (<span id="counter__categories" className="ui black circular label">{categoriesSaved.length}</span>) : ''
                                }
                            </button>

                            <div className="dropdown-menu" aria-labelledby="Categories">
                                <div className="dropdown-item">
                                    <h6 className="font-weight-bold">Categories</h6>
                                    <p className="mb-1">Filter your results by specialisms.</p>
                                    {
                                        this.props.categories.map(item => (
                                            <div className="ui checkbox" key={'category_' + item.id}>
                                                <input type="checkbox" id={'category_' + item.id} onChange={this.checkedCategory} checked={this.categorySelected(item.id)} value={item.id} />
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

                            <button className={ (filterCounter > 0) ? 'h-search-filter-btn mr-3 show ui filter button primary has-counter' : 'h-search-filter-btn mr-3 show ui filter button' } type="button" id="OtherFilters" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <FontAwesomeIcon icon={faFilter} size="sm" />
                                Other Filters
                                {
                                    (filterCounter > 0) ? (<span id="counter__filter" className="ui black circular label">{filterCounter}</span>) : ''
                                }
                            </button>

                            <div className="dropdown-menu" aria-labelledby="OtherFilters">
                                {/*<div className="ui filter popup bottom left transition visible" aria-labelledby="OtherFilters">*/}
                                <div className="dropdown-item">
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
                                    <div className="ui checkbox">
                                        <input type="checkbox" id="events" onChange={this.handleChangeType} checked={types.events} />
                                        <label htmlFor="events">Events</label>
                                    </div>
                                    <div className="ui checkbox">
                                        <input type="checkbox" id="stories" onChange={this.handleChangeType} checked={types.stories} />
                                        <label htmlFor="stories">News &amp; Stories</label>
                                    </div>

                                    {/*<Checkbox label="Lots" attr="lots" />*/}
                                    {/*<Checkbox label="Auctions" attr="auctions" />*/}
                                    {/*<Checkbox label="Events" attr="events" />*/}
                                    {/*<Checkbox label="News &amp; Stories" attr="news-stories" />*/}

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
                            <button className="h-search-filter-btn mr-3 show ui filter grey button" id="clear" onClick={this.resetAll}>
                                <i className="redo alternate icon"/>
                                {/*<FontAwesomeIcon icon={faRedo} size="sm" />*/}
                            </button>
                        </div>
                    </div>


                    {/*<div className="search-filter__anim-in-left search-filter__anim-reset show">*/}
                    {/*    <div className="ui filter grey button" id="clear" title="Clear Filters" onClick={this.resetAll}>*/}
                    {/*        <i className="redo alternate icon" />*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                </div>
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        categories: state.categories
    };
}

export default connect(
    mapStateToProps,
    { getCategories }
)(SearchFilters);
