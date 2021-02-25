import React, {Component} from 'react';

import LotContainer from './components/LotContainer/LotContainer';
// import AuctionsContainer from './components/AuctionsContainer/AuctionsContainer'; work
import ArticleContainer from './components/ArticleContainer/ArticleContainer';
import SearchBox from './components/SearchBox/SearchBox';

import './App.css';
// import './assets/css/app.css';

import { Provider } from 'react-redux';
import store from './store/index';
import {getLots, getCategories, getPastLots, getAuctions, getEvents, getNews, updateTab} from './actions/index';
import PastLotContainer from "./components/PastLotContainer/PastLotContainer";
import {updateFiltersNew} from "./actions";
// import EventContainer from "./components/EventContainer/EventContainer"; work

window.store = store;
window.getLots = getLots;
window.getPastLots = getPastLots;
window.getCategories = getCategories;
window.getAuctions = getAuctions;
window.getEvents = getEvents;
window.getNews = getNews;
window.updateTab = updateTab;

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
            noResults: false,
            openTabs: "upcoming"
        };
        this.handleTabSelect = this.handleTabSelect.bind(this);
    }

    updateUrlParams() {
        const { openTabs = 'upcoming' } = this.state;

        if (window.history.pushState) {
            let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            const params = [];

            if (openTabs) params.push('tab=' + openTabs);

            if (params.length) {
                newUrl += '?' + params.join('&');
            }
            window.history.pushState({path:newUrl},'',newUrl);
        }

        store.dispatch(updateTab({currentTab: openTabs}));
        store.dispatch(updateFiltersNew({
            selectedCategories: [],
            priceMin: '',
            priceMax: '',
        }));
    }

    componentDidMount() {
        store.subscribe(() => {
            const {staticFilters, lots, pastLots, news, submited, currentTab} = store.getState();

            this.setState({types: staticFilters.contentType, upcomingOnly: staticFilters.upcomingOnly, noResults: (!submited && !lots.length && !pastLots.length && !news.length), openTabs: currentTab})
        });
    }

    handleTabSelect (e) {
        e.preventDefault();

        this.setState({openTabs: e.target.name}, () => this.updateUrlParams());
    }

    render() {
        const { upcomingOnly, types, noResults } = this.state;

        let allFiltersUnchecked = (!types.lots && !types.auctions && !types.events && !types.stories);

        return (
            <div className="App">
                <Provider store={store}>
                    <SearchBox handleTabSelect={this.handleTabSelect} />

                    <main className="main-content">
                        <section className="section">

                            <div className="container">
                                {
                                    noResults ? (<p className="error-message">No results</p>) : ''
                                }

                                {
                                    (allFiltersUnchecked || types.lots) ? (
                                        <>
                                            <LotContainer tab={this.state.openTabs} />
                                            {/*{*/}
                                            {/*    (!upcomingOnly) ? (*/}
                                            {/*        <PastLotContainer />*/}
                                            {/*    ) : ''*/}
                                            {/*}*/}
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
