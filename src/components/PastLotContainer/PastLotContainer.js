import React, { Component } from 'react';

import '../LotContainer/LotContainer.css'

import BlockHeader from '../BlockHeader/BlockHeader';
import Lot from '../Lot/Lot';
import LotLoader from '../LotLoader/LotLoader';
import {connect} from "react-redux";
import {getPastLots} from '../../actions/index';
import store from "../../store";

class LotContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };

        this.loadMorePast = this.loadMorePast.bind(this);
    }

    componentDidMount() {
        this.props.getPastLots();
    }


    loadMorePast(e) {
        const st = store.getState();

        st.pastLoading = true;
        st.pagePast +=1;

        store.dispatch( getPastLots(st) );
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
            console.log('this.props.pastLots:  ', this.props.pastLots);

            pastLots = this.props.pastLots.map(item =>
                <>
                    {
                        (item.itemView) ? (
                            <Lot
                                key={'past_lot_' + item.itemView.ref}
                                lot={item.itemView}
                                isPast={true}
                            />
                        ) : ''
                    }
                </>
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
                    (this.props.page !== -1) ? (
                        <div className="col-12 text-center">
                            <button className="btn btn-load-more mt-3 mb-5" onClick={this.loadMorePast}>Load More</button>
                        </div>
                    ) : ''
                }
            </div>
        ) : '';

    }

}

function mapStateToProps(state) {
    return {
        pastLots: state.pastLots,
        message: state.pastLotsMessage,
        page: state.pagePast,
        pastLoading: state.pastLoading
    };
}

export default connect(
    mapStateToProps,
    { getPastLots }
)(LotContainer);
