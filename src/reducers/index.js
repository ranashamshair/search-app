import {
    GET_AUCTIONS, GET_CATEGORIES, GET_LOTS, GET_PAST_LOTS, GET_POSTS, LOAD_MORE, NEXT_PAGE, UPDATE_ALL_FROM_URL,
    UPDATE_FILTERS_NEW,
    UPDATE_SEARCH, UPDATE_SORTING, UPDATE_TAB
} from "../constants/action-types";

const initialState = {
    allCategories: [],
    availableCategories: [],
    // FOR NEW VERSION !!!
    firstInitialized: false,
    loading: '',
    lotsNew: [],
    lotsPast: [],
    auctionsNew: [],
    postsNew: [],
    page: 0,
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
        changes.activeTabCounter = 0;

        if (message) changes.message = message;
    }

    return changes;
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case GET_LOTS: {
            let changes = {
                page: 0,
                loading: false,
            };

            if (state.allCategories.length > 0 && action.payload.categoryIds) {
                changes.availableCategories = state.allCategories.filter(item => action.payload.categoryIds.indexOf(item.id.toString()) !== -1);
            }

            changes = reduceRefreshedData(changes, action.payload);

            let uniqueItemsObj = null;
            if (changes.items.length > 0) {
                uniqueItemsObj = changes.items.reduce( (c, e) => {
                    if (!c[e.ref]) c[e.ref] = e;
                    return c;
                }, {});
            }

            changes.lotsNew = uniqueItemsObj ? Object.values(uniqueItemsObj) : [];
            changes.lotsCount = changes.activeTabCounter;

            return Object.assign({}, state, changes);
        }
        case GET_PAST_LOTS: {
            let changes = {
                page: 0,
                loading: false,
            };

            changes = reduceRefreshedData(changes, action.payload);

            let uniqueItemsObj = null;
            if (changes.items.length) {
                uniqueItemsObj = changes.items.reduce( (c, e) => {
                    if (!c[e.ref]) c[e.ref] = e;
                    return c;
                }, {});
            }
            changes.lotsPast = uniqueItemsObj ? Object.values(uniqueItemsObj) : [];
            changes.pastLotsCount = changes.activeTabCounter;

            return Object.assign({}, state, changes);
        }
        case GET_AUCTIONS: {
            let changes = {
                page: 0,
                loading: false,
            };

            if (state.allCategories.length > 0 && action.payload.categoryIds) {
                changes.availableCategories = state.allCategories.filter(item => action.payload.categoryIds.indexOf(item.id) !== -1);
            }

            changes = reduceRefreshedData(changes, action.payload);

            let uniqueItemsObj = null;
            if (changes.items.length) {
                uniqueItemsObj = changes.items.reduce( (c, e) => {
                    if (!c[e.title]) c[e.title] = e;
                    return c;
                }, {});
            }
            changes.auctionsNew = uniqueItemsObj ? Object.values(uniqueItemsObj) : [];
            changes.auctionsCount = changes.activeTabCounter;

            return Object.assign({}, state, changes);
        }
        case GET_POSTS: {
            let changes = {
                page: 0,
                loading: false,
            };

            if (state.allCategories.length > 0 && action.payload.categoryIds) {
                changes.availableCategories = state.allCategories.filter(item => action.payload.categoryIds.indexOf(item.id) !== -1);
            }

            changes = reduceRefreshedData(changes, action.payload);

            changes.postsNew = [];
            if (changes.items.length) {
            //     let uniqueItemsObj = changes.items.reduce( (c, e) => {
            //         if (!c[e.title]) c[e.title] = e;
            //         return c;
            //     }, {});
            //     changes.postsNew = Object.values(uniqueItemsObj);
                changes.postsNew = changes.items;
            }
            changes.postsCount = changes.activeTabCounter;

            return Object.assign({}, state, changes);
        }
        case GET_CATEGORIES: {
            return Object.assign({}, state, { allCategories: action.payload.categories });
        }
        case UPDATE_TAB: {
            const { currentTab = 'upcoming' } = action.payload;

            let changes = {
                page: 0,
                currentTab: currentTab,
                loading: true,
            };

            if (currentTab !== state.currentTab) {
                changes.searchText = '';
                changes.selectedCategories= [];
                changes.priceMin= '';
                changes.priceMax= '';
            }

            return Object.assign({}, state, changes);
        }
        case UPDATE_FILTERS_NEW: {
            let changes = {
                page: 0,
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
                    case 'upcoming': {
                        changes.lotsNew = (state.lotsNew && state.lotsNew.length > 0) ? [...state.lotsNew, ...items] : items;

                        let uniqueItemsObj = changes.lotsNew.reduce( (c, e) => {
                            if (!c[e.ref]) c[e.ref] = e;
                            return c;
                        }, {});

                        changes.lotsNew = uniqueItemsObj ? Object.values(uniqueItemsObj) : [];
                    } break;
                    case 'past': {
                        changes.lotsPast = (state.lotsPast && state.lotsPast.length > 0) ? [...state.lotsPast, ...items] : items;

                        let uniqueItemsObj = changes.lotsPast.reduce( (c, e) => {
                            if (!c[e.ref]) c[e.ref] = e;
                            return c;
                        }, {});

                        changes.lotsPast = uniqueItemsObj ? Object.values(uniqueItemsObj) : [];
                    } break;
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

            return Object.assign({}, state, changes);
        }
        case NEXT_PAGE: {
            return Object.assign({}, state, {page: state.page + 1});
        }
        case UPDATE_ALL_FROM_URL: {
            return Object.assign({}, state, action.payload);
        }
        default: {
            return state;
        }
    }
}

export default rootReducer;
