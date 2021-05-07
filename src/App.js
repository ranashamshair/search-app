import React, {Component} from 'react';

import LotContainer from './components/LotContainer/LotContainer';
// import AuctionsContainer from './components/AuctionsContainer/AuctionsContainer'; work
import ArticleContainer from './components/ArticleContainer/ArticleContainer';
import SearchBox from './components/SearchBox/SearchBox';

import './App.css';
// import './assets/css/app.css';

import { Provider } from 'react-redux';
import store from './store/index';
import {
    getCategories,
    loadMore,
    updateTab,
    updateFromURL, initData
} from './actions/index';
import PastLotContainer from "./components/PastLotContainer/PastLotContainer";
import {updateFiltersNew, updateSearch, updateSorting} from "./actions";
import AuctionsContainer from "./components/AuctionsContainer/AuctionsContainer";

window.store = store;
window.getCategories = getCategories;
window.loadMore = loadMore;
window.updateTab = updateTab;
window.initData = initData;

class App extends Component{
    constructor(props) {
        super(props);

        const params = this.parseUrl();

        this.state = {
            loading: true,
            noResults: false,
            openTabs: params.tab || 'upcoming'
        };

        this.handleTabSelect = this.handleTabSelect.bind(this);
        this.applyChangesLoading = this.applyChangesLoading.bind(this);
        this._isMounted = false;
    }

    parseUrl() {
        const url = window.location.search;
        if (!url) return {};

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

        const changes = {
            selectedCategories: categories ? categories.split(',') : [],
            priceMin: min_price,
            priceMax: max_price,
        };

        if (this.state.currentTab !== tab) {
            changes.currentTab = tab;
        }
        if (this.state.search !== search) {
            changes.searchText = search;
        }
        if (this.state.sorting !== sort) {
            changes.sorting = sort
        }

        if (this._isMounted) this.setState({loading: true}, () => {
            if (this._isMounted) {
                store.dispatch( updateFromURL(Object.assign(store.getState(), changes)) );
            }
        });
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
                    lotsCount = 0,
                    pastLotsCount = 0,
                    auctionsCount = 0,
                    postsCount = 0,

                    message = '',
                    lastCompletedAction = '',
                } = store.getState();

                if (lastCompletedAction === 'GET_CATEGORIES') {
                    const params = this.parseUrl();
                    if (Object.keys(params).length > 0) {
                        this.getFiltersFromUrlParams(params);
                    } else {
                        store.dispatch( initData() );
                    }

                    this.setState({
                        openTabs: this.state.openTabs || 'upcoming'
                    })
                }
                else {
                    this.setState({
                        loading: false,
                        noResults: (
                            message !== '' &&
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
            }
        });

        window.addEventListener('popstate', () => {
            if(this._isMounted && !this.state.loading) this.getFiltersFromUrlParams();
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
        window.removeEventListener('popstate', () => {
            if(this._isMounted && !this.state.loading) this.getFiltersFromUrlParams();
        });
    }

    handleTabSelect (e) {
        e.preventDefault();

        this.setState({openTabs: e.target.name, loading: true}, () => {
            if (this._isMounted) this.updateUrlParams();
        });
    }

    applyChangesLoading (callback) {
        this.setState({loading: true}, () => {
            if (this._isMounted) callback();
        });
    }

    switchTabRenderer () {
        const { openTabs = 'upcoming', loading = false } = this.state;

        switch (openTabs) {
            case 'upcoming': return <LotContainer isLoading={loading} />;
            case 'past': return <PastLotContainer isLoading={loading} />;
            case 'auctions': return <AuctionsContainer isLoading={loading} />;
            case 'other': return <ArticleContainer isLoading={loading} />;
            default: return '';
        }
    }

    render() {
        const { noResults, loading, openTabs } = this.state;

        return (
            <div className="App">
                <Provider store={store}>
                    <SearchBox handleTabSelect={this.handleTabSelect} isLoading={loading} loadChanges={this.applyChangesLoading} openTabs={this.state.openTabs} />

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