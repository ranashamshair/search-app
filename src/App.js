import React, {Component} from 'react';

import LotContainer from './components/LotContainer/LotContainer';
import AuctionsContainer from './components/AuctionsContainer/AuctionsContainer';
import ArticleContainer from './components/ArticleContainer/ArticleContainer';
import SearchBox from './components/SearchBox/SearchBox';

import './App.css';
// import './assets/css/app.css';

import { Provider } from 'react-redux';
import store from './store/index';
import {getLots, getCategories, getPastLots, getAuctions, getEvents, getNews} from './actions/index';
import PastLotContainer from "./components/PastLotContainer/PastLotContainer";
import EventContainer from "./components/EventContainer/EventContainer";

window.store = store;
window.getLots = getLots;
window.getPastLots = getPastLots;
window.getCategories = getCategories;
window.getAuctions = getAuctions;
window.getEvents = getEvents;
window.getNews = getNews;


class App extends Component{
    constructor(props) {
        super(props);

        this.state = {
            upcomingOnly: false,
            types: {
                lots: false,
                // auctions: false,
                // events: false,
                stories: false
            },
        }
    }

    componentDidMount() {
        store.subscribe(() => {
            const {staticFilters} = store.getState();

            this.setState({types: staticFilters.contentType, upcomingOnly: staticFilters.upcomingOnly})
        });
    }

    render() {
        const { upcomingOnly, types } = this.state;

        let allFiltersUnchecked = (!types.lots && !types.auctions && !types.events && !types.stories);

        return (
            <div className="App">
                <Provider store={store}>
                    <SearchBox />

                    <main className="main-content">
                        <section className="section">

                            <div className="container">

                                {
                                    (allFiltersUnchecked || types.lots) ? (
                                        <>
                                            <LotContainer />
                                            {
                                                (!upcomingOnly) ? (
                                                    <PastLotContainer />
                                                ) : ''
                                            }
                                        </>
                                    ) : ''
                                }

                                {/*{ (allFiltersUnchecked || types.auctions) ? (<AuctionsContainer />) : '' }*/}

                                {/*{ (allFiltersUnchecked || types.events) ? (<EventContainer />) : '' }*/}

                                { (allFiltersUnchecked || types.stories) ? (<ArticleContainer />) : '' }

                            </div>

                        </section>
                    </main>
                </Provider>
            </div>
        );
    }

}

export default App;
