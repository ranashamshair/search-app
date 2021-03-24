import React, {Component} from 'react';

import LotContainer from './components/LotContainer/LotContainer';
// import AuctionsContainer from './components/AuctionsContainer/AuctionsContainer'; work
import ArticleContainer from './components/ArticleContainer/ArticleContainer';
import SearchBox from './components/SearchBox/SearchBox';

import './App.css';
// import './assets/css/app.css';

import { Provider } from 'react-redux';
import store from './store/index';
import {getLots, getCategories, getPastLots, getAuctions, getOther, updateTab} from './actions/index';
import PastLotContainer from "./components/PastLotContainer/PastLotContainer";
import {updateFiltersNew} from "./actions";
import AuctionsContainer from "./components/AuctionsContainer/AuctionsContainer";

window.store = store;
window.getLots = getLots;
window.getPastLots = getPastLots;
window.getCategories = getCategories;
window.getAuctions = getAuctions;
window.getOther = getOther;
// window.getOther = loadMore;
window.updateTab = updateTab;

class App extends Component{
    constructor(props) {
        super(props);

        this.state = {
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

        console.log('APP update tab openTabs: ', openTabs)
        store.dispatch(updateTab({currentTab: openTabs}));
        store.dispatch(updateFiltersNew({
            selectedCategories: [],
            priceMin: '',
            priceMax: '',
        }, openTabs));
    }

    componentDidMount() {
        store.subscribe(() => {
            // const {staticFilters, lots, pastLots, news, submited, currentTab} = store.getState();

            // this.setState({types: staticFilters.contentType, upcomingOnly: staticFilters.upcomingOnly, noResults: (!submited && !lots.length && !pastLots.length && !news.length), openTabs: currentTab})
        });
    }

    handleTabSelect (e) {
        e.preventDefault();

        this.setState({openTabs: e.target.name}, () => this.updateUrlParams());
    }

    switchTabRenderer () {
        const { openTabs = 'upcoming' } = this.state;

        switch (openTabs) {
            case 'upcoming': return <LotContainer />;
            case 'past': return <PastLotContainer />;
            case 'auctions': return <AuctionsContainer />;
            case 'other': return <ArticleContainer />;
        }
    }

    render() {
        const { noResults } = this.state;

        return (
            <div className="App">
                <Provider store={store}>
                    <SearchBox handleTabSelect={this.handleTabSelect} />

                    <main className="main-content">
                        <section className="section">

                            <div className="container">
                                {
                                    noResults ? (<p className="error-message">No results</p>) : this.switchTabRenderer()
                                }
                            </div>

                        </section>
                    </main>
                </Provider>
            </div>
        );
    }

}

export default App;
