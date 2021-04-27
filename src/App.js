import React, {Component} from 'react';

import LotContainer from './components/LotContainer/LotContainer';
// import AuctionsContainer from './components/AuctionsContainer/AuctionsContainer'; work
import ArticleContainer from './components/ArticleContainer/ArticleContainer';
import SearchBox from './components/SearchBox/SearchBox';

import './App.css';
// import './assets/css/app.css';

import { Provider } from 'react-redux';
import store from './store/index';
import {getLots, getCategories, getPastLots, getAuctions, getOther, loadMore, updateTab, setNextPage} from './actions/index';
import PastLotContainer from "./components/PastLotContainer/PastLotContainer";
import {updateFiltersNew, updateSearch, updateSorting} from "./actions";
import AuctionsContainer from "./components/AuctionsContainer/AuctionsContainer";

window.store = store;
window.getLots = getLots;
window.getPastLots = getPastLots;
window.getCategories = getCategories;
window.getAuctions = getAuctions;
window.getOther = getOther;
window.loadMore = loadMore;
window.updateTab = updateTab;
window.setNextPage = setNextPage;

class App extends Component{
    constructor(props) {
        super(props);

        const params = this.parseUrl();

        this.state = {
            noResults: false,
            openTabs: params.tab || 'upcoming'
        };
        this.getFiltersFromUrlParams(params);
        this.handleTabSelect = this.handleTabSelect.bind(this);
        this._isMounted = false;
    }

    parseUrl() {
        const url = window.location.search;
        let query = url.substr(1);
        let result = {};
        query.split("&").forEach(function(part) {
            let item = part.split("=");
            result[item[0]] = decodeURIComponent(item[1]);
        });
        return result;
    }

    getFiltersFromUrlParams(params) {
        if (!params) params = this.parseUrl();

        const { tab = 'upcoming', search = '', categories = null, min_price = '', max_price = '', sort = '' } = params;

        if (this.state.currentTab !== tab) {
            store.dispatch(updateTab({currentTab: tab}));
        }

        store.dispatch(updateFiltersNew({
            selectedCategories: categories ? categories.split(',') : [],
            priceMin: min_price,
            priceMax: max_price,
        }, tab));

        if (this.state.search !== search) {
            store.dispatch(updateSearch({searchText: search}));
        }
        if (this.state.sorting !== sort) {
            store.dispatch(updateSorting({sorting: sort}));
        }
    }

    updateUrlParams() {
        const { openTabs = 'upcoming' } = this.state;
        const { currentTab = 'upcoming' } = store.getState();

        if (openTabs !== currentTab) {
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
            // store.dispatch(updateFiltersNew({
            //     selectedCategories: [],
            //     priceMin: '',
            //     priceMax: '',
            // }, openTabs));
        }
    }

    componentDidMount() {
        this._isMounted = true;

        store.subscribe(() => {
            if (this._isMounted) {
                const {
                    currentTab,
                    loading = false,
                    lotsCount = 0,
                    pastLotsCount = 0,
                    auctionsCount = 0,
                    postsCount = 0,
                } = store.getState();

                this.setState({
                    noResults: (!loading &&
                        (
                            (currentTab === 'upcoming' && lotsCount === 0) ||
                            (currentTab === 'past' && pastLotsCount === 0) ||
                            (currentTab === 'auctions' && auctionsCount === 0) ||
                            (currentTab === 'other' && postsCount === 0)
                        )
                    ),
                    openTabs: currentTab
                })
            }
        });

        window.addEventListener('popstate', () => {
            if(this._isMounted) this.getFiltersFromUrlParams();
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
        window.removeEventListener('popstate', () => {
            if(this._isMounted) this.getFiltersFromUrlParams();
        });
    }

    handleTabSelect (e) {
        e.preventDefault();

        this.setState({openTabs: e.target.name}, () => {
            if (this._isMounted) this.updateUrlParams();
        });
    }

    switchTabRenderer () {
        const { openTabs = 'upcoming' } = this.state;

        switch (openTabs) {
            case 'upcoming': return <LotContainer />;
            case 'past': return <PastLotContainer />;
            case 'auctions': return <AuctionsContainer />;
            case 'other': return <ArticleContainer />;
            default: return '';
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
