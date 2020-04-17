import React, { Component } from 'react';
import './SearchFilters.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faFilter, faRedo } from '@fortawesome/free-solid-svg-icons';

import Checkbox from '../CheckBox/CheckBox';
import {connect} from "react-redux";
import {getCategories, getLots, updateFilters} from "../../actions";
import store from "../../store";


class SearchFilters extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            upcoming: false,
            categories: [],
            types: {
                lots: true,
                auctions: true,
                events: true,
                stories: true
            },
            pricemin: '',
            pricemax: '',

            upcomingSaved: false,
            categoriesSaved: [],
            typesSaved: {
                lots: true,
                auctions: true,
                events: true,
                stories: true
            },
            priceminSaved: '',
            pricemaxSaved: '',

        };

        this.handleClickInsideDropdown = this.handleClickInsideDropdown.bind(this);
        this.saveUpcomingFilter = this.saveUpcomingFilter.bind(this);
        this.cancelUpcomingFilter = this.cancelUpcomingFilter.bind(this);
        this.saveOtherFilters = this.saveOtherFilters.bind(this);
        this.cancelOtherFilter = this.cancelOtherFilter.bind(this);
        this.handleChangeType = this.handleChangeType.bind(this);
        this.resetAll = this.resetAll.bind(this);
    }

    componentDidMount() {
        this.props.getCategories()
    }


    handleClickInsideDropdown(e) {
        return false;
    }

    handleChangeType(e) {
        const tg = e.target, { types } = this.state;

        console.log('target: ', tg);

        types[tg.id] = tg.checked;

        console.log('CHANGED TYPES: ', types);

        this.setState({types: types})
    }



    saveUpcomingFilter(e) {
        this.setState({upcomingSaved: this.state.upcoming}, () => this.updateLots());
    }

    cancelUpcomingFilter(e) {
        this.setState({upcoming: this.state.upcomingSaved});
    }

    saveOtherFilters(e) {
        const { types, pricemin, pricemax } = this.state;

        this.setState({typesSaved: types, priceminSaved: pricemin, pricemaxSaved: pricemax}, () => this.updateLots());
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
                lots: true,
                auctions: true,
                events: true,
                stories: true
            },
            pricemin: '',
            pricemax: '',
            upcomingSaved: false,
            categoriesSaved: [],
            typesSaved: {
                lots: true,
                auctions: true,
                events: true,
                stories: true
            },
            priceminSaved: '',
            pricemaxSaved: '',

        }, () => this.updateLots())
    }



    updateLots() {
        const { upcomingSaved, categoriesSaved, typesSaved, priceminSaved, pricemaxSaved } = this.state;

        store.dispatch( updateFilters({
            isLoading: true,
            staticFilters: {
                upcomingOnly: upcomingSaved,
                contentType: typesSaved,
                categories: categoriesSaved,
                pricemin: priceminSaved,
                pricemax: pricemaxSaved,
            }
        }) );
    }




    render() {
        const { upcoming, types, pricemin, pricemax } = this.state;

        return (
            <>
                <div className="col-12 col-lg-8 h-search-filter h-search-filter-show" id="container__filters">

                    <div className="btn-group">
                    
                        <button className="h-search-filter-btn mr-3 show" type="button" id="UpcomingOnly" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Upcoming Only</button>

                        <div className="dropdown-menu" aria-labelledby="UpcomingOnly" >
                            <div className="dropdown-item" onClick={this.handleClickInsideDropdown}>
                                <h6 className="font-weight-bold">Limit results to upcoming items only</h6>  
                                <p>Applies to lots, events and auctions</p>
                                
                                <div className="custom-control custom-switch mb-3">
                                    <input type="checkbox" className="custom-control-input" id="upcoming-only" value={upcoming} onChange={e => this.setState({upcoming : !!e.target.value})} />
                                    <label className="custom-control-label" htmlFor="upcoming-only">Upcoming Only</label>
                                </div>

                                <a className="btn btn-sm btn-cancel" onClick={this.cancelUpcomingFilter}>Cancel</a>
                                <a className="btn btn-sm btn-save" onClick={this.saveUpcomingFilter}>Save</a>
                            </div>
                        </div>

                    </div>

                    <div className="btn-group">

                        <button className="h-search-filter-btn mr-3 show dropdown-toggle" data-offset="10" type="button" id="Categories" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <FontAwesomeIcon icon={faTag} size="1x" />
                            Categories
                        </button>

                        <div className="dropdown-menu" aria-labelledby="Categories">
                            <div className="dropdown-item">
                                <h6 className="font-weight-bold">Categories</h6>  
                                <p className="mb-1">Filter your results by specialisms.</p>
                                {
                                    this.props.categories.map(item => (
                                        <Checkbox label={item.name} key={'category_' + item.id} attr={'category_' + item.id} />
                                    ))
                                }
                                <a className="btn btn-sm btn-cancel mt-2">Cancel</a>
                                <a className="btn btn-sm btn-save mt-2">Save</a>
                            </div>
                        </div>

                    </div>

                    <div className="btn-group">

                        <button className="h-search-filter-btn mr-3 show" type="button" id="OtherFilters" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <FontAwesomeIcon icon={faFilter} size="sm" />
                            Other Filters
                        </button>

                        <div className="dropdown-menu" aria-labelledby="OtherFilters">
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
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="low">Low $</span>
                                    </div>
                                    <input type="text" className="form-control" placeholder="Amount" aria-label="Amount" aria-describedby="low" value={pricemin} onChange={e => this.setState({pricemin : e.target.value})} />
                                    <div className="input-group-append">
                                        <span className="input-group-text" id="low">.00</span>
                                    </div>
                                </div>

                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="high">High $</span>
                                    </div>
                                    <input type="text" className="form-control" placeholder="Amount" aria-label="Amount" aria-describedby="high" value={pricemax} onChange={e => this.setState({pricemax : e.target.value})} />
                                    <div className="input-group-append">
                                        <span className="input-group-text" id="high">.00</span>
                                    </div>
                                </div>

                                <a className="btn btn-sm btn-cancel" onClick={this.cancelOtherFilter}>Cancel</a>
                                <a className="btn btn-sm btn-save" onClick={this.saveOtherFilters}>Save</a>

                            </div>
                        </div>

                    </div>


                    <button className="h-search-filter-btn mr-3 show ui filter grey button" id="clear" onClick={this.resetAll}>
                        <FontAwesomeIcon icon={faRedo} size="sm" />
                    </button>

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
