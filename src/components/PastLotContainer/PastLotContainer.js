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

        if ( this.state.loading ) {
            for (let i = 0; i < 4; i++) {
                pastLots.push(<LotLoader key={i} />);
            }
        }

        if ( this.props.pastLots.length )
        {
            pastLots = this.props.pastLots.map(item =>
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
            if ( !this.props.pastLoading ) {
                setTimeout(() => {
                    this.setState({loading: false});
                }, 3000);
            }
        }

        return (
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
        );

    }

}

function mapStateToProps(state) {
    return {
        pastLots: state.pastLots,
        page: state.pagePast,
        pastLoading: state.pastLoading
    };
}

export default connect(
    mapStateToProps,
    { getPastLots }
)(LotContainer);
