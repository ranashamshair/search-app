import React, {Component} from 'react';

import BlockHeader from '../BlockHeader/BlockHeader';
import Auction from '../Auction/Auction';
import {connect} from "react-redux";
import {getAuctions, loadMore, setNextPage} from '../../actions/index';
import store from "../../store";
import AuctionLoader from "../AuctionLoader/AuctionLoader";

class AuctionsContainer extends Component {
    constructor(props) {
        super(props);

        const storeState = store.getState();

        this.state = {
            loading: true,
            page: 1,
            // for detecting changes !!!
            searchText: storeState.searchText || '',
            selectedCategories: storeState.selectedCategories || [],
            sorting: storeState.sorting || '',
        };
        this._isMounted = false;

        this.loadMore = this.loadMore.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.props.getAuctions(this.state);

        store.subscribe(() => {
            if (this._isMounted) {
                const storeState = store.getState();

                const {
                    searchText = '',
                    selectedCategories = [],
                    sorting = '',
                    page = 1
                } = storeState;

                const difference = selectedCategories
                    .filter(x => !this.state.selectedCategories.includes(x))
                    .concat(this.state.selectedCategories.filter(x => !selectedCategories.includes(x)));

                const changes = {};
                if (searchText !== this.state.searchText) changes.searchText = searchText;
                if (difference.length > 0) changes.selectedCategories = selectedCategories;
                if (sorting !== this.state.sorting) changes.sorting = sorting;

                if (Object.keys(changes).length > 0) {
                    changes.loading = true;
                    this.setState(changes, () => {
                        if (this._isMounted) this.props.getAuctions(Object.assign(storeState, changes))
                    });
                } else if (page > 1 && page !== this.state.page) {
                    this.setState({page: page}, () => {
                        if (this._isMounted) store.dispatch( loadMore(storeState, storeState.currentTab) )
                    });
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
        let auctions = [];

        if ( this.state.loading ) {
            for (let i = 0; i < 4; i++) {
                auctions.push(<AuctionLoader key={'auction_' + i} />);
            }
        }

        if ( this.props.auctions.length )
        {
            auctions = this.props.auctions.map((item, key) =>
                <Auction
                    key={'auction_' + key}
                    auctionId={item.id}
                    location={item.location}
                    // link={item.link}
                    title={item.title}
                    datetime={item.date}
                    imgSrc={item.photo}
                />
            );

        } else {
            if ( !this.props.loading ) {
                if(!this.state.loading && this.props.message){
                    auctions = <p className="error-message">{this.props.message}</p>;
                }else{
                    setTimeout(() => {
                        if (this._isMounted) this.setState({loading: false});
                    }, 3000);
                }
            }
        }


        return (
            <div>
                <BlockHeader title="Auctions" />

                <div className="row row-spacing">
                    {auctions}
                </div>

                {
                    (this.props.page !== -1) ? (
                        <div className="col-12 text-center">
                            <button className="btn btn-load-more mt-3 mb-5" onClick={this.loadMore}>Load More</button>
                        </div>
                    ) : ''
                }
            </div>
        );
    }
    
}

function mapStateToProps(state) {
    return {
        auctions: state.auctionsNew || [],
        message: state.message,
        page: state.page,
        loading: state.loading
    };
}

export default connect(
    mapStateToProps,
    { getAuctions }
)(AuctionsContainer);
