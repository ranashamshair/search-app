import {
    GET_AUCTIONS, GET_CATEGORIES, GET_EVENTS, GET_LOTS, GET_NEWS, GET_PAST_LOTS, UPDATE_FILTERS_NEW,
    UPDATE_FILTERS_ONLY, UPDATE_SEARCH, UPDATE_SORTING, UPDATE_TAB
} from "../constants/action-types";

const initialState = {
    page: 0,
    pagePast: 0,
    // pageAuctions: 0,
    // pageEvents: 0,
    pageNews: 0,
    searchQuery: '',
    lots: [],
    pastLots: [],
    // auctions: [],
    // events: [],
    news: [],
    lotsMessage: '',
    pastLotsMessage: '',
    // auctionsMessage: '',
    // eventsMessage: '',
    newsMessage: '',
    categories: [],
    // upcomingLoading: false,
    upcomingLoading: true,
    // pastLoading: false,
    pastLoading: true,
    // auctionsLoading: false,
    // eventsLoading: false,
    newsLoading: true,
    // newsLoading: false,
    staticFilters: {
        upcomingOnly: false,
        contentType: {
            lots: false,
            // auctions: false,
            // events: false,
            stories: false
        },
        categories: [],
        pricemin: '',
        pricemax: '',
    },
    changedLots: false,
    changedPastLots: false,
    // changedAuctions: false,
    // changedEvents: false,
    changedArticles: false,

    // FOR NEW VERSION !!!
    searchText: '',
    currentTab: 'upcoming',
    selectedCategories: [],
    priceMin: '',
    priceMax: '',
    sorting: '',
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case GET_LOTS: {
            const obj = Object.assign({}, state, action.payload);

            if(obj.lots.length){
                let uniqueLotsObj = obj.lots.reduce( (c, e) => {
                    if (!c[e.itemView.ref]) c[e.itemView.ref] = e;
                    return c;
                }, {});
                obj.lots = Object.values(uniqueLotsObj)
            }

            return obj;
        }
        case GET_PAST_LOTS: {
            const obj = Object.assign({}, state, action.payload);

            if(obj.pastLots.length){
                let uniquePastLotsObj = obj.pastLots.reduce( (c, e) => {
                    if (!c[e.itemView.ref]) c[e.itemView.ref] = e;
                    return c;
                }, {});
                obj.pastLots = Object.values(uniquePastLotsObj)
            }

            return obj;
        }
        case GET_NEWS: {
            const obj = Object.assign({}, state, action.payload);

            if(obj.news.length){
                let uniqueNewsObj = obj.news.reduce( (c, e) => {
                    if (!c[e.id]) c[e.id] = e;
                    return c;
                }, {});
                obj.news = Object.values(uniqueNewsObj)
            }

            return obj;
        }
        case GET_CATEGORIES: {
            return Object.assign({}, state, { categories: action.payload.categories });
        }
        case UPDATE_FILTERS_ONLY: {
            return Object.assign({}, state, action.payload);
        }
        case UPDATE_TAB: {
            return Object.assign({}, state, { currentTab: action.payload.currentTab });
        }
        case UPDATE_FILTERS_NEW: {
            return Object.assign({}, state, action.payload);
        }
        case UPDATE_SORTING: {
            return Object.assign({}, state, { sorting: action.payload.sorting });
        }
        case UPDATE_SEARCH: {
            return Object.assign({}, state, { searchText: action.payload.searchText });
        }
        default: {
            return state;
        }
    }
}

export default rootReducer;
