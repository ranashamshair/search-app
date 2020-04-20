import {GET_CATEGORIES, GET_LOTS} from "../constants/action-types";

const initialState = {
    page: 0,
    searchQuery: '',
    lots: [],
    categories: [],
    isLoading: false,
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
    if (action.type === GET_LOTS) {
        console.log('action.payload: ', action.payload);
        return Object.assign({}, state, action.payload);
    }
    if (action.type === GET_CATEGORIES) {
        return Object.assign({}, state, { categories: action.payload.categories });
    }

    return state;
}

export default rootReducer;
