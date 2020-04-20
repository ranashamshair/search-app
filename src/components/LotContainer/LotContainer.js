import React, { Component } from 'react';
import FadeIn from 'react-fade-in';

import BlockHeader from '../BlockHeader/BlockHeader';
import Lot from '../Lot/Lot';
import LotLoader from '../LotLoader/LotLoader';
import {connect} from "react-redux";
import {getLots, updateFilters} from '../../actions/index';
import store from "../../store";

class LotContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {page: 0};

        this.loadMore = this.loadMore.bind(this);
    }

    componentDidMount() {
        this.props.getLots();

        store.subscribe(() => {
            const {page} = store.getState();

            console.log('state page: ', page);

            this.setState({page: page});
        });
    }

    loadMore(e) {
        const st = store.getState();

        st.isLoading = true;
        st.page +=1;

        store.dispatch( updateFilters(st) );
    }

    render() {
        console.log('this.props.lots: ', this.props.lots);

        let lots = [];

        for (let i = 0; i < 4; i++) {
            lots.push(<LotLoader key={i} />)
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
            
        }

        return (
            <div>
                <BlockHeader title="Lots" />

                <div className="row row-spacing">

                    {lots}

                </div>

                <button onClick={this.loadMore}>LOAD MORE</button>
            </div>
        );

    }

}

function mapStateToProps(state) {
    return {
        lots: state.lots.slice(0, 10)
    };
}

export default connect(
    mapStateToProps,
    { getLots }
)(LotContainer);

// export default LotContainer;
