import {
    GET_AUCTIONS, GET_CATEGORIES, GET_LOTS, GET_PAST_LOTS, GET_POSTS, LOAD_MORE, NEXT_PAGE, UPDATE_FILTERS_NEW,
    UPDATE_SEARCH, UPDATE_SORTING, UPDATE_TAB
} from "../constants/action-types";

const initialState = {
    // FOR NEW VERSION !!!
    loading: '',
    lotsNew: [],
    lotsPast: [],
    auctionsNew: [],
    postsNew: [],
    page: 1,
    dataChanged: false,
    message: '',
    searchText: '',
    currentTab: 'upcoming',
    selectedCategories: [],
    priceMin: '',
    priceMax: '',
    sorting: '',
    lotsCount: 0,
    pastLotsCount: 0,
    auctionsCount: 0,
    postsCount: 0,
    activeTabCounter: 0,
};

const reduceRefreshedData = (changes = {}, payload) => {
    const { items = [], count = 0, success = false, pageSize = 20, message = null } = payload;

    if (!success || items.length < pageSize) changes.page = -1;

    if (success) {
        changes.items = items;
        changes.activeTabCounter = count;
    } else {
        changes.items = [];

        if (message) changes.message = message;
    }

    return changes;
};

// TODO cleanup after API !!!
function rootReducer(state = initialState, action) {
    switch (action.type) {
        case GET_LOTS: {
            // TODO !!!
            let changes = {
                page: 1,
                loading: false,
            };

            changes = reduceRefreshedData(changes, action.payload);

            console.log('GET LOTS changes: ', changes);

            if (changes.items.length) {
                let uniqueItemsObj = changes.items.reduce( (c, e) => {
                    if (!c[e.ref]) c[e.ref] = e;
                    return c;
                }, {});
                changes.lotsNew = Object.values(uniqueItemsObj);
                changes.lotsCount = changes.activeTabCounter;
            }

            return Object.assign({}, state, changes);
        }
        case GET_PAST_LOTS: {
            let changes = {
                page: 1,
                loading: false,
            };

            changes = reduceRefreshedData(changes, action.payload);

            console.log('GET PAST LOTS changes: ', changes);

            if (changes.items.length) {
                let uniqueItemsObj = changes.items.reduce( (c, e) => {
                    if (!c[e.ref]) c[e.ref] = e;
                    return c;
                }, {});
                changes.lotsPast = Object.values(uniqueItemsObj);
                changes.pastLotsCount = changes.activeTabCounter;
            }

            return Object.assign({}, state, changes);
        }
        case GET_AUCTIONS: {
            let changes = {
                page: 1,
                loading: false,
            };

            changes = reduceRefreshedData(changes, action.payload);

            console.log('GET AUCTIONS changes: ', changes);

            if (changes.items.length) {
                let uniqueItemsObj = changes.items.reduce( (c, e) => {
                    if (!c[e.title]) c[e.title] = e;
                    return c;
                }, {});
                changes.auctionsNew = Object.values(uniqueItemsObj);
                changes.auctionsCount = changes.activeTabCounter;
            }

            return Object.assign({}, state, changes);
        }
        case GET_POSTS: {
            let changes = {
                page: 1,
                loading: false,
            };

            changes = reduceRefreshedData(changes, action.payload);

            console.log('GET OTHER changes: ', changes);

            if (changes.items.length) {
            //     let uniqueItemsObj = changes.items.reduce( (c, e) => {
            //         if (!c[e.title]) c[e.title] = e;
            //         return c;
            //     }, {});
            //     changes.postsNew = Object.values(uniqueItemsObj);
                changes.postsNew = changes.items;
                changes.postsCount = changes.activeTabCounter;
            }

            return Object.assign({}, state, changes);
        }
        case GET_CATEGORIES: {
            return Object.assign({}, state, { categories: action.payload.categories });
        }
        case UPDATE_TAB: {
            const { currentTab = 'upcoming' } = action.payload;

            let changes = {
                page: 1,
                currentTab: currentTab,
            };

            return Object.assign({}, state, changes);
        }
        case UPDATE_FILTERS_NEW: {
            let changes = {
                page: 1,
                loading: true,
            };

            return Object.assign({}, state, action.payload, changes);
        }
        case UPDATE_SORTING: {
            return Object.assign({}, state, { sorting: action.payload.sorting, loading: true });
        }
        case UPDATE_SEARCH: {
            return Object.assign({}, state, { searchText: action.payload.searchText, loading: true });
        }
        case LOAD_MORE: {
            let changes = {
                loading: false,
            };

            const { items = [], success = false, pageSize = 20, message = null, currentTab = 'upcoming' } = action.payload;

            if (!success || items.length < pageSize) changes.page = -1;

            if (success) {
                switch (currentTab) {
                    case 'upcoming': changes.lotsNew = (state.lotsNew && state.lotsNew.length > 0) ? [...state.lotsNew, ...items] : items; break;
                    case 'past': changes.lotsPast = (state.lotsPast && state.lotsPast.length > 0) ? [...state.lotsPast, ...items] : items; break;
                    case 'auctions': changes.auctionsNew = (state.auctionsNew && state.auctionsNew.length > 0) ? [...state.auctionsNew, ...items] : items; break;
                    case 'other': changes.postsNew = (state.postsNew && state.postsNew.length > 0) ? [...state.postsNew, ...items] : items; break;
                }
                delete changes.items;
            } else {
                switch (currentTab) {
                    case 'upcoming': {
                        changes.lotsNew = (state.lotsNew && state.lotsNew.length > 0) ? state.lotsNew: [];
                        if (changes.lotsNew.length === 0 && message) changes.message = message;
                        break;
                    }
                    case 'past': {
                        changes.lotsPast = (state.lotsPast && state.lotsPast.length > 0) ? state.lotsPast: [];
                        if (changes.lotsPast.length === 0 && message) changes.message = message;
                        break;
                    }
                    case 'auctions': {
                        changes.auctionsNew = (state.auctionsNew && state.auctionsNew.length > 0) ? state.auctionsNew: [];
                        if (changes.auctionsNew.length === 0 && message) changes.message = message;
                        break;
                    }
                    case 'other': {
                        changes.postsNew = (state.postsNew && state.postsNew.length > 0) ? state.postsNew: [];
                        if (changes.postsNew.length === 0 && message) changes.message = message;
                        break;
                    }
                }
            }

            console.log('LOAD_MORE reducer loading :', changes.loading);

            return Object.assign({}, state, changes);
        }
        case NEXT_PAGE: {
            return Object.assign({}, state, {page: state.page + 1});
        }
        default: {
            return state;
        }
    }
}

export default rootReducer;
