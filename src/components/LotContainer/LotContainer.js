import React, { Component } from 'react';
import FadeIn from 'react-fade-in';

import BlockHeader from '../BlockHeader/BlockHeader';
import Lot from '../Lot/Lot';
import LotLoader from '../LotLoader/LotLoader';
import {connect} from "react-redux";
import { getLots } from '../../actions/index';
import store from "../../store";

class LotContainer extends Component {

    constructor(props) {
        super(props);

        // this.state = {
        //     lots: [],
        //     isLoading: true
        // }

    }

    componentDidMount() {
        this.props.getLots();

        store.subscribe(() => console.log('load after filters change:  ', store.getState()));
    }

    render() {

        let lots = [];

        for (let i = 0; i < 4; i++) {
            lots.push(<LotLoader key={i} />)
        }

        
        if ( this.props.lots.length )
        {
            lots = this.props.lots.map(item =>
                
                <Lot 
                    key={item.id}
                    lotNumber={item.lotNumber} 
                    artist={item.artist}
                    provenance={item.provenance}
                    estimate={item.estimate}
                    imgSrc={item.imgSrc}
                />
                
                );
            
        }

        return (
            <div>
                <BlockHeader title="Lots" />

                <div className="row row-spacing">

                    

                        {lots}

                    
                    

                </div>
                
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
