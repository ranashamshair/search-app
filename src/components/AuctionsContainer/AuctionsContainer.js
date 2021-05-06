import React, {Component} from 'react';

import BlockHeader from '../BlockHeader/BlockHeader';
import Auction from '../Auction/Auction';
import {connect} from "react-redux";
import {loadMore} from '../../actions/index';
import store from "../../store";
import AuctionLoader from "../AuctionLoader/AuctionLoader";

class AuctionsContainer extends Component {
    constructor(props) {
        super(props);

        const storeState = store.getState();

        this.state = {
            loading: true,
            page: 0,
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
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    loadMore(e) {
        const storeState = store.getState();
        this.props.loadMore(storeState, storeState.currentTab);
    }

    render() {
        let auctions = [];

        if ( this.props.isLoading ) {
            for (let i = 0; i < 4; i++) {
                auctions.push(<AuctionLoader key={'auction_' + i} />);
            }
        }

        if ( this.props.auctions.length && !this.props.isLoading )
        {
            auctions = this.props.auctions.map((item, key) =>
                <Auction
                    key={'auction_' + key}
                    auctionId={item.id}
                    location={item.location}
                    link={item.permalink}
                    title={item.title}
                    datetime={item.date}
                    imgSrc={item.photo}
                />
            );

        } else {
            if ( !this.props.isLoading ) {
                if(this.props.message){
                    auctions = <p className="error-message">{this.props.message}</p>;
                }else{
                    // setTimeout(() => {
                    //     if (this._isMounted) this.setState({loading: false});
                    // }, 3000);
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
    };
}

export default connect(
    mapStateToProps,
    { loadMore }
)(AuctionsContainer);
