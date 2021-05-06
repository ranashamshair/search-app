import React, { Component } from 'react';

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
        let lots = [];

        let show = true;

        if ( this.props.isLoading ) {
            for (let i = 0; i < 4; i++) {
                lots.push(<LotLoader key={i}/>);
            }
        }

        // restore this when api is ready to work maybe
        if ( this.props.lots.length && !this.props.isLoading )
        {
            lots = this.props.lots.map(item =>
                <React.Fragment key={'lot_' + item.ref} >
                {
                    <Lot
                        lot={item}
                        isPast={false}
                    />
                }
                </React.Fragment>
            );

        } else {
            if ( !this.props.isLoading ) {
                if(this.props.message){
                    show = false;
                    // lots = <p className="error-message">{this.props.message}</p>;
                }else{
                    // setTimeout(() => {
                    //     if (this._isMounted) this.setState({loading: false});
                    // }, 3000);
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
    };
}

export default connect(
    mapStateToProps,
    { loadMore }
)(LotContainer);
