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

        if ( this.state.loading ) {
            for (let i = 0; i < 4; i++) {
                lots.push(<LotLoader key={i}/>);
            }
        }

        if ( this.props.lots.length )
        {
            lots = this.props.lots.map(item =>
                <>
                {
                    (item.itemView) ? (
                        <Lot
                            key={'lot_' + item.itemView.ref}
                            lot={item.itemView}
                        />
                    ) : ''
                }
                </>
            );
            
        } else {
            if ( !this.props.upcomingLoading ) {
                setTimeout(() => {
                    this.setState({loading: false});
                }, 3000);
            }
        }


        return (
            <div>
                <BlockHeader title="Upcoming Lots" />

                <div className="row row-spacing">
                    {lots}
                </div>

                {
                    (this.props.page !== -1) ? (
                        <div className="col-12 text-center">
                            <button className="btn btn-load-more mt-3 mb-5" onClick={this.loadMoreUpcoming}>Load More</button>
                        </div>
                    ) : ''
                }
            </div>
        );

    }

}

function mapStateToProps(state) {
    return {
        lots: state.lots,
        page: state.page,
        upcomingLoading: state.upcomingLoading
    };
}

export default connect(
    mapStateToProps,
    { getLots }
)(LotContainer);
