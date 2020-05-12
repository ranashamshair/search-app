import {GET_AUCTIONS, GET_CATEGORIES, GET_EVENTS, GET_LOTS, GET_NEWS, GET_PAST_LOTS} from "../constants/action-types";

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
    upcomingLoading: false,
    pastLoading: false,
    // auctionsLoading: false,
    // eventsLoading: false,
    newsLoading: false,
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
    changedSearch: false
};

function rootReducer(state = initialState, action) {
    if (
        action.type === GET_LOTS ||
        action.type === GET_PAST_LOTS ||
        // action.type === GET_AUCTIONS ||
        // action.type === GET_EVENTS ||
        action.type === GET_NEWS
    ) {
        return Object.assign({}, state, action.payload);
    }
    if (action.type === GET_CATEGORIES) {
        return Object.assign({}, state, { categories: action.payload.categories });
    }

    return state;
}

export default rootReducer;
