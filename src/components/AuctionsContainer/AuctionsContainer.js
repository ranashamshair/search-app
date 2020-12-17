import React, {Component} from 'react';

import BlockHeader from '../BlockHeader/BlockHeader';
import Auction from '../Auction/Auction';
import {connect} from "react-redux";
import {getAuctions} from '../../actions/index';
import store from "../../store";
import AuctionLoader from "../AuctionLoader/AuctionLoader";

class AuctionsContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };

        this.loadMore = this.loadMore.bind(this);
    }

    componentDidMount() {
        this.props.getAuctions();
    }


    loadMore(e) {
        const st = store.getState();

        st.auctionsLoading = true;
        st.pageAuctions +=1;

        store.dispatch( getAuctions(st) );
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
            auctions = this.props.auctions.map(item =>
                <Auction
                    key={'auction_' + item.id}
                    auctionId={item.id}
                    location={item.location}
                    link={item.link}
                    title={(item.title) ? item.title.rendered : ''}
                    datetime={item.date}
                    imgSrc={item.image_url}
                />
            );

        } else {
            if ( !this.props.loading ) {
                if(!this.state.loading && this.props.message){
                    auctions = <p className="error-message">{this.props.message}</p>;
                }else{
                    setTimeout(() => {
                        this.setState({loading: false});
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
        auctions: (state.auctions && state.auctions.auctions) ? state.auctions.auctions : [],
        message: state.auctionsMessage,
        page: state.pageAuctions,
        loading: state.newsLoading
    };
}

export default connect(
    mapStateToProps,
    { getAuctions }
)(AuctionsContainer);
