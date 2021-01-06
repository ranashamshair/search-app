import React, { Component } from 'react';

import BlockHeader from '../BlockHeader/BlockHeader';
import Lot from '../Lot/Lot';
import LotLoader from '../LotLoader/LotLoader';
import {connect} from "react-redux";
import {getLots} from '../../actions/index';
import store from "../../store";

class LotContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };

        this.loadMoreUpcoming = this.loadMoreUpcoming.bind(this);
    }

    componentDidMount() {
        this.props.getLots();
    }

    loadMoreUpcoming(e) {
        const st = store.getState();

        st.upcomingLoading = true;
        st.page +=1;

        store.dispatch( getLots(st) );
    }


    render() {
        let lots = [];

        let show = true;

        // console.log('lot loading: ', this.state.loading);

        if ( this.state.loading ) {
            for (let i = 0; i < 4; i++) {
                lots.push(<LotLoader key={i}/>);
            }
        }

        // let i = 0;
        // while (this.state.loading) {
        //     lots.push(<LotLoader key={i}/>);
        //     ++i;
        // }

        if ( this.props.lots.length )
        {
            lots = this.props.lots.map(item =>
                <React.Fragment key={'lot_' + item.itemView.ref} >
                {
                    (item.itemView) ? (
                        <Lot
                            lot={item.itemView}
                        />
                    ) : ''
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
                        this.setState({loading: false});
                    }, 3000);
                }
            }
        }


        return show ? (
            <div>
                <BlockHeader title="Upcoming Lots" />

                <div className="row row-spacing">
                    {lots}
                </div>

                {
                    (this.props.lots.length && this.props.page !== -1) ? (
                        <div className="col-12 text-center">
                            <button className="btn btn-load-more mt-3 mb-5" onClick={this.loadMoreUpcoming}>Load More</button>
                        </div>
                    ) : ''
                }
            </div>
        ) : '';

    }

}

function mapStateToProps(state) {
    return {
        lots: state.lots,
        message: state.lotsMessage,
        page: state.page,
        upcomingLoading: state.upcomingLoading
    };
}

export default connect(
    mapStateToProps,
    { getLots }
)(LotContainer);
