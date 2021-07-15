import {
    INIT_DATA,
    LOAD_MORE,
    UPDATE_ALL_FROM_URL,
    UPDATE_FILTERS_NEW,
    UPDATE_SEARCH,
    UPDATE_SORTING,
    UPDATE_TAB
} from "../constants/action-types";

const initialState = {
    availableCategories: [],
    // FOR NEW VERSION !!!
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

    // last filters
    lastLotFilters: {
        categories: [],
        min: '',
        max: '',
    },
    lastPastLotFilters: {
        min: '',
        max: '',
    },
    lastAuctionFilters: {
        categories: [],
    },
    lastPostFilter: {
        categories: [],
    }
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
        case INIT_DATA: {
            const { currentTab = 'upcoming' } = state;

            let changes = procNewData(currentTab, state, {}, action.payload);

            if (currentTab !== state.currentTab) {
                changes.searchText = '';
                changes.selectedCategories= [];
                changes.priceMin= '';
                changes.priceMax= '';
            }

            return Object.assign({}, state, changes);
        }
        case UPDATE_TAB: {
            const { currentTab = 'upcoming', selectedCategories = [], priceMin = '', priceMax = '' } = action.payload;

            let changes = procNewData(currentTab, state, {page: 0, currentTab: currentTab}, action.payload);

            if (currentTab !== state.currentTab) {
                // changes.searchText = '';
                changes.selectedCategories = selectedCategories;
                changes.priceMin = priceMin;
                changes.priceMax = priceMax;
                changes.sorting = '';
            }

            return Object.assign({}, state, changes);
        }
        case UPDATE_FILTERS_NEW: {
            const { currentTab = 'upcoming' } = state;

            let changes = procNewData(currentTab, state, {page: 0}, action.payload);

            return Object.assign({}, state, changes);
        }
        case UPDATE_SORTING: {
            const { currentTab = 'upcoming' } = state;

            let changes = procNewData(currentTab, state, {page: 0, sorting: action.payload.sorting}, action.payload);

            return Object.assign({}, state, changes);
        }
        case UPDATE_SEARCH: {
            const { currentTab = 'upcoming' } = state;

            let changes = procNewData(currentTab, state, {page: 0, searchText: action.payload.searchText}, action.payload);

            return Object.assign({}, state, changes);
        }
        case LOAD_MORE: {
            let changes = {
                page: state.page + 1
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
        case UPDATE_ALL_FROM_URL: {
            const { currentTab = 'upcoming' } = action.payload;

            let changes = procNewData(currentTab, state, {page: 0}, action.payload);

            return Object.assign({}, state, action.payload, changes);
        }
        default: {
            return state;
        }
    }
}

const procNewData = (currentTab, state, changes, payload) => {
    changes = reduceRefreshedData(changes, payload);

    const { selectedCategories = [], priceMin = '', priceMax = '' } = payload;

    changes.availableCategories = state.availableCategories;

    if (currentTab === 'upcoming' || currentTab === 'past') {
        if (currentTab === 'upcoming' && payload.usedCategories) {
            changes.availableCategories = payload.usedCategories;
        }

        let uniqueItemsObj = null;
        if (changes.items.length > 0) {
            uniqueItemsObj = changes.items.reduce( (c, e) => {
                if (!c[e.ref]) c[e.ref] = e;
                return c;
            }, {});
        }

        if (currentTab === 'upcoming') {
            changes.lotsNew = uniqueItemsObj ? Object.values(uniqueItemsObj) : [];
            changes.lotsCount = changes.activeTabCounter;

            changes.lotsPast = [];
            changes.auctionsNew = [];
            changes.postsNew = [];


            changes.selectedCategories = selectedCategories;
            changes.priceMin = priceMin;
            changes.priceMax = priceMax;

            changes.lastLotFilters = {
                categories: selectedCategories,
                min: priceMin,
                max: priceMax,
            };
        } else {
            changes.lotsPast = uniqueItemsObj ? Object.values(uniqueItemsObj) : [];
            changes.pastLotsCount = changes.activeTabCounter;

            changes.lotsNew = [];
            changes.auctionsNew = [];
            changes.postsNew = [];

            changes.lastPastLotFilters = {
                min: priceMin,
                max: priceMax,
            };
        }
    } else if (currentTab === 'auctions') {
        if (payload.usedCategories) {
            changes.availableCategories = payload.usedCategories;
        }

        let uniqueItemsObj = null;
        if (changes.items.length) {
            uniqueItemsObj = changes.items.reduce( (c, e) => {
                if (!c[e.title]) c[e.title] = e;
                return c;
            }, {});
        }
        changes.auctionsNew = uniqueItemsObj ? Object.values(uniqueItemsObj) : [];
        changes.auctionsCount = changes.activeTabCounter;

        changes.lotsNew = [];
        changes.lotsPast = [];
        changes.postsNew = [];

        changes.lastAuctionFilters = {
            categories: selectedCategories,
        };
    } else {
        if (payload.usedCategories) {
            changes.availableCategories = payload.usedCategories;
        }

        changes.postsNew = [];
        if (changes.items.length) {
            changes.postsNew = changes.items;
        }
        changes.postsCount = changes.activeTabCounter;

        changes.lotsNew = [];
        changes.lotsPast = [];
        changes.auctionsNew = [];

        changes.lastPostFilter = {
            categories: selectedCategories,
        }
    }

    return changes;
};

export default rootReducer;