import {
    GET_AUCTIONS, GET_CATEGORIES, GET_LOTS, GET_PAST_LOTS, GET_POSTS, LOAD_MORE, NEXT_PAGE, UPDATE_FILTERS_NEW,
    UPDATE_SEARCH, UPDATE_SORTING, UPDATE_TAB
} from "../constants/action-types";

const initialState = {
    pagePast: 0,
    // pageAuctions: 0,
    // pageEvents: 0,
    pageNews: 0,
    searchQuery: '',

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
                loading: false,
            };

            return Object.assign({}, state, action.payload, changes);
        }
        case UPDATE_SORTING: {
            return Object.assign({}, state, { sorting: action.payload.sorting });
        }
        case UPDATE_SEARCH: {
            return Object.assign({}, state, { searchText: action.payload.searchText });
        }
        case LOAD_MORE: {
            console.log('payload: ', action.payload);
        //     TODO load more (pagination) !!!
            let changes = {
                loading: false,
            };

            const { items = [], count = 0, success = false, pageSize = 20, message = null } = action.payload;

            if (!success || items.length < pageSize) changes.page = -1;

            if (success) {
                changes.items = (state.items && (changes.page > 0 || changes.page === -1)) ? [...state.items, ...items] : items;
                changes.activeTabCounter = count;
            } else {
                changes.items = (state.items && state.items > 0) ? state.items: [];

                if (changes.items.length === 0 && message) changes.message = message;
            }

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
