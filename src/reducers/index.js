import {GET_CATEGORIES, GET_LOTS, GET_PAST_LOTS} from "../constants/action-types";

const initialState = {
    page: 0,
    pagePast: 0,
    searchQuery: '',
    lots: [],
    pastLots: [],
    categories: [],
    isLoading: false,
    upcomingLoading: false,
    pastLoading: false,
    staticFilters: {
        upcomingOnly: false,
        contentType: {
            lots: false,
            // auctions: false,
            events: false,
            stories: false
        },
        categories: [],
        pricemin: '',
        pricemax: '',
    }
};

function rootReducer(state = initialState, action) {
    if (action.type === GET_LOTS || action.type === GET_PAST_LOTS) {
        return Object.assign({}, state, action.payload);
    }
    if (action.type === GET_CATEGORIES) {
        return Object.assign({}, state, { categories: action.payload.categories });
    }

    return state;
}

export default rootReducer;
