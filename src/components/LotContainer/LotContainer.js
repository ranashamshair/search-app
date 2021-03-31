import React, { Component } from 'react';

import Lot from '../Lot/Lot';
import LotLoader from '../LotLoader/LotLoader';
import {connect} from "react-redux";
import {getLots, loadMore, setNextPage} from '../../actions/index';
import store from "../../store";

class LotContainer extends Component {

    constructor(props) {
        super(props);

        const storeState = store.getState();

        this.state = {
            loading: true,
            page: 1,
            // for detecting changes !!!
            searchText: storeState.searchText || '',
            selectedCategories: storeState.selectedCategories || [],
            priceMin: storeState.priceMin || '',
            priceMax: storeState.priceMax || '',
            sorting: storeState.sorting || '',
        };
        this._isMounted = false;

        this.loadMore = this.loadMore.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.props.getLots(this.state);

        store.subscribe(() => {
            if (this._isMounted) {
                const storeState = store.getState();

                const {
                    searchText = '',
                    selectedCategories = [],
                    priceMin = '',
                    priceMax = '',
                    sorting = '',
                    page = 1
                } = storeState;

                const difference = selectedCategories
                    .filter(x => !this.state.selectedCategories.includes(x))
                    .concat(this.state.selectedCategories.filter(x => !selectedCategories.includes(x)));

                const changes = {};
                if (searchText !== this.state.searchText) changes.searchText = searchText;
                if (difference.length > 0) changes.selectedCategories = selectedCategories;
                if (priceMin !== this.state.priceMin) changes.priceMin = priceMin;
                if (priceMax !== this.state.priceMax) changes.priceMax = priceMax;
                if (sorting !== this.state.sorting) changes.sorting = sorting;

                if (Object.keys(changes).length > 0) {
                    changes.loading = true;
                    this.setState(changes, () => this.props.getLots(Object.assign(storeState, changes)));
                } else if (page > 1 && page !== this.state.page) {
                    this.setState({page: page}, () => store.dispatch( loadMore(storeState, storeState.currentTab) ) );
                }
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    loadMore(e) {
        store.dispatch( setNextPage() );
    }

    render() {
        let lots = [];

        let show = true;

        if ( this.state.loading ) {
            for (let i = 0; i < 4; i++) {
                lots.push(<LotLoader key={i}/>);
            }
        }

        // restore this when api is ready to work maybe
        if ( this.props.lots.length )
        {
            lots = this.props.lots.map(item =>
                <React.Fragment key={'lot_' + item.ref} >
                {
                    <Lot
                        lot={item}
                    />
                }
                </React.Fragment>
            );

        } else {
            if ( !this.props.loading ) {
                if(!this.state.loading && this.props.message){
                    show = false;
                    // lots = <p className="error-message">{this.props.message}</p>;
                }else{
                    setTimeout(() => {
                        if (this._isMounted) this.setState({loading: false});
                    }, 3000);
                }
            }
        }


        return show ? (
            <div className="px-0 py-1 px-md-4">
                {/*<BlockHeader title="Upcoming Lots" />*/}

                <div className="row row-spacing">
                    {lots}
                </div>

                {
                    (this.props.lots.length && this.props.page !== -1) ? (
                        <div className="col-12 text-center">
                            {/*change click function to load needed type of lots*/}
                            <button className="btn btn-load-more mt-3 mb-5" onClick={this.loadMore}>Load More</button>
                        </div>
                    ) : ''
                }
            </div>
        ) : '';

    }

}

function mapStateToProps(state) {
    return {
        lots: state.lotsNew || [],
        message: state.message,
        page: state.page,
        loading: state.loading
    };
}

export default connect(
    mapStateToProps,
    { getLots }
)(LotContainer);
