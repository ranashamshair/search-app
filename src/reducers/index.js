import {
    GET_AUCTIONS, GET_CATEGORIES, GET_EVENTS, GET_LOTS, GET_NEWS, GET_PAST_LOTS,
    UPDATE_FILTERS_ONLY
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
    changedLots: false,
    changedPastLots: false,
    // changedAuctions: false,
    // changedEvents: false,
    changedArticles: false,
};

function rootReducer(state = initialState, action) {
    if (
        action.type === GET_LOTS ||
        action.type === GET_PAST_LOTS ||
        // action.type === GET_AUCTIONS ||
        // action.type === GET_EVENTS ||
        action.type === GET_NEWS
    ) {
        const obj = Object.assign({}, state, action.payload);

        if(obj.lots.length){
            let uniqueLotsObj = obj.lots.reduce( (c, e) => {
                if (!c[e.itemView.ref]) c[e.itemView.ref] = e;
                return c;
            }, {});
            obj.lots = Object.values(uniqueLotsObj)
        }

        if(obj.pastLots.length){
            let uniquePastLotsObj = obj.pastLots.reduce( (c, e) => {
                if (!c[e.itemView.ref]) c[e.itemView.ref] = e;
                return c;
            }, {});
            obj.pastLots = Object.values(uniquePastLotsObj)
        }

        if(obj.news.length){
            let uniqueNewsObj = obj.news.reduce( (c, e) => {
                if (!c[e.id]) c[e.id] = e;
                return c;
            }, {});
            obj.news = Object.values(uniqueNewsObj)
        }

        return obj;
    }
    if (action.type === GET_CATEGORIES) {
        return Object.assign({}, state, { categories: action.payload.categories });
    }
    if (action.type === UPDATE_FILTERS_ONLY) {
        return Object.assign({}, state, action.payload);
    }

    return state;
}

export default rootReducer;
