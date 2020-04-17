import {GET_CATEGORIES, GET_LOTS, UPDATE_FILTERS} from "../constants/action-types";

const initialState = {
    lots: [],
    categories: [],
    isLoading: false,
    staticFilters: {
        upcomingOnly: false,
        contentType: {
            lots: true,
            auctions: true,
            events: true,
            stories: true
        },
        categories: '',
        pricemin: '',
        pricemax: '',
    }
};

function rootReducer(state = initialState, action) {
    if (action.type === GET_LOTS) {
        return Object.assign({}, state, action.payload);
    }
    if (action.type === GET_CATEGORIES) {
        return Object.assign({}, state, { categories: action.payload.categories });
    }

    return state;
}

export default rootReducer;
