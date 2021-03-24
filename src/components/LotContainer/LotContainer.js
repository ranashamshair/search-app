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

        store.subscribe(() => {
            const storeState = store.getState();

            const {
                searchText = '',
                selectedCategories: [],
                priceMin = '',
                priceMax = '',
                sorting = '',
            } = storeState;

            const changes = {};
            if (searchText !== this.state.searchText) changes.searchText = searchText;
            // if (selectedCategories !== this.state.selectedCategories) changes.selectedCategories = selectedCategories;
            if (priceMin !== this.state.priceMin) changes.priceMin = priceMin;
            if (priceMax !== this.state.priceMax) changes.priceMax = priceMax;
            if (sorting !== this.state.sorting) changes.sorting = sorting;

            if (Object.keys(changes).length > 0) {
                changes.loading = true;
                this.setState(changes, () => this.props.getLots(Object.assign(storeState, changes)));
            }
        });
    }

    loadMoreUpcoming(e) {
        const st = store.getState();

        st.upcomingLoading = true;
        st.page +=1;

        // TODO specia function for load more !!!
        // store.dispatch( getLots(st) );
    }


    render() {
        let lots = [];

        let show = true;

        // const data = {
        //     upcoming: {
        //         data: [
        //             {
        //                 currencySymbol:
        //                 "CAD",
        //                 estimateHigh:
        //                 60,
        //                 estimateLow:
        //                 30,
        //                 lotNumber:
        //                 35,
        //                 photo:
        //                 "https://image.invaluable.com/housePhotos/maynardsfineart/62/693662/H0759-L241284367.jpg",
        //                 bid:
        //                 20,
        //                 ref:
        //                 "6A74B5FB47",
        //                 title:
        //                 "David Mitchell, 'The Bone Clocks', first edition,",
        //                 saleTitle:
        //                 "David Mitchell, 'The Bone Clocks', first edition,",
        //                 saleDate:
        //                 "DATE CONVERTED TO UNIX_TIMESTAMP"
        //             },
        //             {
        //                 currencySymbol: "CAD",
        //                 estimateHigh: 60,
        //                 estimateLow: 30,
        //                 lotNumber: 35,
        //                 photo: "",
        //                 bid: 20,
        //                 ref: "6A74B5FB48",
        //                 title: "David Mitchell, 'The Bone Clocks', first edition,",
        //                 saleTitle: "David Mitchell, 'The Bone Clocks', first edition,",
        //                 saleDate: "DATE CONVERTED TO UNIX_TIMESTAMP"
        //             },
        //             {
        //                 currencySymbol:
        //                 "CAD",
        //                 estimateHigh:
        //                 60,
        //                 estimateLow:
        //                 30,
        //                 lotNumber:
        //                 35,
        //                 photo:
        //                 "https://image.invaluable.com/housePhotos/maynardsfineart/62/693662/H0759-L241284367.jpg",
        //                 bid:
        //                 20,
        //                 ref:
        //                 "6A74B5FB49",
        //                 title:
        //                 "David Mitchell, 'The Bone Clocks', first edition,",
        //                 saleTitle:
        //                 "David Mitchell, 'The Bone Clocks', first edition,",
        //                 saleDate:
        //                 "DATE CONVERTED TO UNIX_TIMESTAMP"
        //             },
        //         ],
        //         count: 3,
        //         used_categories: [
        //             '123', '456', '789'
        //         ],
        //     },
        //
        //     past: {
        //         data: [
        //             {
        //                 currencySymbol: "$",
        //                 estimateHigh: 60,
        //                 estimateLow: 40,
        //                 lotNumber: 241,
        //                 lotNumberExtension: "",
        //                 photo: "",
        //                 priceResult: 55,
        //                 ref: "001D711C98",
        //                 title: "A royal Worcester ewer of squat lenticular form,",
        //                 saleTitle: "A royal Worcester ewer of squat lenticular form,",
        //                 saleDate: "DATE CONVERTED TO UNIX_TIMESTAMP"
        //             },
        //             {
        //                 currencySymbol: "$",
        //                 estimateHigh: 60,
        //                 estimateLow: 40,
        //                 lotNumber: 241,
        //                 lotNumberExtension: "",
        //                 photo: "https://stageimg.invaluable.com/housePhotos/Maynards/33/468333/H0759-L41582879.jpg",
        //                 priceResult: 0,
        //                 ref: "001D711C99",
        //                 title: "A royal Worcester ewer of squat lenticular form,",
        //                 saleTitle: "A royal Worcester ewer of squat lenticular form,",
        //                 saleDate: "DATE CONVERTED TO UNIX_TIMESTAMP"
        //             },
        //             {
        //                 currencySymbol: "$",
        //                 estimateHigh: 60,
        //                 estimateLow: 40,
        //                 lotNumber: 241,
        //                 lotNumberExtension: "",
        //                 photo: "https://stageimg.invaluable.com/housePhotos/Maynards/33/468333/H0759-L41582879.jpg",
        //                 priceResult: 55,
        //                 ref: "001D711B01",
        //                 title: "A royal Worcester ewer of squat lenticular form,",
        //                 saleTitle: "A royal Worcester ewer of squat lenticular form,",
        //                 saleDate: "DATE CONVERTED TO UNIX_TIMESTAMP"
        //             },
        //         ],
        //         count: 3,
        //         used_categories: [
        //             '123', '456', '789'
        //         ],
        //     },
        //
        //     auctions: {
        //         data: [
        //             {
        //                 photo: "https://stageimg.invaluable.com/housePhotos/Maynards/33/468333/H0759-L41582879.jpg",
        //                 ref: "001D711C97",
        //                 title: "A royal Worcester ewer of squat lenticular form,",
        //                 location: {
        //                     city: "Kharkov",
        //                     state: null,
        //                     country: "ua"
        //                 },
        //                 date: "DATE CONVERTED TO UNIX_TIMESTAMP"
        //             },
        //             {
        //                 photo: "https://stageimg.invaluable.com/housePhotos/Maynards/33/468333/H0759-L41582879.jpg",
        //                 ref: "001D711C98",
        //                 title: "A royal Worcester ewer of squat lenticular form,",
        //                 location: {
        //                     city: "Kharkov",
        //                     state: "12432",
        //                     country: "ua"
        //                 },
        //                 date: "DATE CONVERTED TO UNIX_TIMESTAMP"
        //             },
        //             {
        //                 photo: "https://stageimg.invaluable.com/housePhotos/Maynards/33/468333/H0759-L41582879.jpg",
        //                 ref: "001D711C99",
        //                 title: "A royal Worcester ewer of squat lenticular form,",
        //                 location: {
        //                     city: "Kharkov",
        //                     state: null,
        //                     country: "ua"
        //                 },
        //                 date: "DATE CONVERTED TO UNIX_TIMESTAMP"
        //             },
        //         ],
        //         count: 3,
        //         used_categories: [
        //             '123', '456', '789'
        //         ],
        //     },
        //
        //     other: {
        //         data: [
        //             {
        //                 title: "Test title",
        //                 photo: "https://stageimg.invaluable.com/housePhotos/Maynards/33/468333/H0759-L41582879.jpg",
        //                 except: "--------test test-----------------",
        //                 detailsUrl: "http://test.com"
        //             },
        //             {
        //                 title: "Test title2",
        //                 photo: "https://stageimg.invaluable.com/housePhotos/Maynards/33/468333/H0759-L41582879.jpg",
        //                 except: "--------test test2-----------------",
        //                 detailsUrl: "http://test.com"
        //             },
        //             {
        //                 title: "Test title3",
        //                 photo: "https://stageimg.invaluable.com/housePhotos/Maynards/33/468333/H0759-L41582879.jpg",
        //                 except: "--------test test3-----------------",
        //                 detailsUrl: "http://test.com"
        //             },
        //         ],
        //         count: 3,
        //         used_categories: [
        //             '123', '456', '789'
        //         ],
        //     }
        // };

        // console.log('lot loading: ', this.state.loading);

        if ( this.state.loading ) {
            for (let i = 0; i < 4; i++) {
                lots.push(<LotLoader key={i}/>);
            }
        }

        // restore this when api is ready to work maybe
        if ( this.props.lots.length )
        {
            lots = this.props.lots.map(item =>
                <React.Fragment key={'lot_' + item.ref} >
                {
                    <Lot
                        lot={item}
                    />
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
            <div className="px-0 py-1 px-md-4">
                {/*<BlockHeader title="Upcoming Lots" />*/}

                <div className="row row-spacing">
                    {lots}
                </div>

                {
                    (this.props.lots.length && this.props.page !== -1) ? (
                        <div className="col-12 text-center">
                            {/*change click function to load needed type of lots*/}
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
        lots: state.lotsNew || [],
        message: state.message,
        page: state.page,
        loading: state.loading
    };
}

export default connect(
    mapStateToProps,
    { getLots }
)(LotContainer);
