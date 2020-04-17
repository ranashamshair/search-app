import React, {Component} from 'react';

import LotContainer from './components/LotContainer/LotContainer';
import AuctionsContainer from './components/AuctionsContainer/AuctionsContainer';
import ArticleContainer from './components/ArticleContainer/ArticleContainer';
import SearchBox from './components/SearchBox/SearchBox';

import './App.css';
// import './assets/css/app.css';

import { Provider } from 'react-redux';
import store from './store/index';
import { getLots, getCategories, updateFilters } from './actions/index';

window.store = store;
window.getLots = getLots;
window.getCategories = getCategories;
window.updateFilters = updateFilters;


class App extends Component{
    constructor(props) {
        super(props);

        this.state = {
            types: {
                lots: false,
                // auctions: false,
                events: false,
                stories: false
            },
        }
    }

    componentDidMount() {
        store.subscribe(() => {
            const {staticFilters} = store.getState();

            this.setState({types: staticFilters.contentType})
        });
    }

    render() {
        const { types } = this.state;

        console.log('ACTIVE TYPES: ', types);

        let allFiltersUnchecked = (!types.lots && !types.events && !types.stories);

        return (
            <div className="App">
                <Provider store={store}>
                    <SearchBox />

                    <main className="main-content">
                        <section className="section">

                            <div className="container">

                                { (allFiltersUnchecked || types.lots) ? (<LotContainer />) : '' }

                                {/*<AuctionsContainer />*/}

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
