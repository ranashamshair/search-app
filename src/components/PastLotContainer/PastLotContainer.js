import React, { Component } from 'react';

import '../LotContainer/LotContainer.css'

import BlockHeader from '../BlockHeader/BlockHeader';
import Lot from '../Lot/Lot';
import LotLoader from '../LotLoader/LotLoader';
import {connect} from "react-redux";
import {loadMore} from '../../actions/index';
import store from "../../store";

class LotContainer extends Component {

    constructor(props) {
        super(props);

        const storeState = store.getState();

        this.state = {
            loading: true,
            page: 0,
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
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    loadMore(e) {
        const storeState = store.getState();
        this.props.loadMore(storeState, storeState.currentTab);
    }

    render() {
        let pastLots = [];

        let show = true;

        if ( this.props.isLoading ) {
            for (let i = 0; i < 4; i++) {
                pastLots.push(<LotLoader key={i} />);
            }
        }

        if ( this.props.pastLots.length && !this.props.isLoading )
        {
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
            if ( !this.props.isLoading ) {
                if(this.props.message){
                    show = false;
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
    };
}

export default connect(
    mapStateToProps,
    { loadMore }
)(LotContainer);