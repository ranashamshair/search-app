import React, { Component } from 'react';

import '../LotContainer/LotContainer.css'

import BlockHeader from '../BlockHeader/BlockHeader';
import Lot from '../Lot/Lot';
import LotLoader from '../LotLoader/LotLoader';
import {connect} from "react-redux";
import {getPastLots, loadMore, setNextPage} from '../../actions/index';
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

        this.loadMore = this.loadMore.bind(this);
    }

    componentDidMount() {
        this.props.getPastLots(this.state);

        store.subscribe(() => {
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
                this.setState(changes, () => this.props.getPastLots(Object.assign(storeState, changes)));
            } else if (page > 1 && page !== this.state.page) {
                this.setState({page: page}, () => store.dispatch( loadMore(storeState, storeState.currentTab) ) );
            }

        });
    }


    loadMore(e) {
        store.dispatch( setNextPage() );
    }

    render() {
        let pastLots = [];

        let show = true;

        if ( this.state.loading ) {
            for (let i = 0; i < 4; i++) {
                pastLots.push(<LotLoader key={i} />);
            }
        }

        if ( this.props.pastLots.length )
        {
            // console.log('this.props.pastLots:  ', this.props.pastLots);

            pastLots = this.props.pastLots.map(item =>
                <React.Fragment key={'past_lot_' + item.ref}>
                    {
                        <Lot
                            lot={item}
                            isPast={true}
                        />
                    }
                </React.Fragment>
            );

        } else {
            if ( !this.props.loading ) {
                if(!this.state.loading && this.props.message){
                    show = false;
                    // pastLots = <p className="error-message">{this.props.message}</p>;
                }else{
                    setTimeout(() => {
                        this.setState({loading: false});
                    }, 3000);
                }
            }
        }

        return show ? (
            <div>
                <BlockHeader title="Past Lots" />

                <div className="row row-spacing">
                    {pastLots}
                </div>

                {
                    (this.props.pastLots.length && this.props.page !== -1) ? (
                        <div className="col-12 text-center">
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
        pastLots: state.lotsPast || [],
        message: state.message,
        page: state.page,
        loading: state.loading
    };
}

export default connect(
    mapStateToProps,
    { getPastLots }
)(LotContainer);
