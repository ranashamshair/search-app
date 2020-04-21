import React, { Component } from 'react';
import FadeIn from 'react-fade-in';

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
            if ( !this.props.pastLoading ) {
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

                <button onClick={this.loadMoreUpcoming}>LOAD MORE</button>
            </div>
        );

    }

}

function mapStateToProps(state) {
    return {
        lots: state.lots,
    };
}

export default connect(
    mapStateToProps,
    { getLots }
)(LotContainer);

// export default LotContainer;
