import {
    GET_CATEGORIES,
    INIT_DATA,
    LOAD_MORE,
    UPDATE_ALL_FROM_URL,
    UPDATE_FILTERS_NEW,
    UPDATE_SEARCH,
    UPDATE_SORTING,
    UPDATE_TAB
} from "../constants/action-types";

const initialState = {
    allCategories: [],
    availableCategories: [],
    // FOR NEW VERSION !!!
    lastCompletedAction: '',
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
    const actionChanges = { lastCompletedAction: action.type };

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

            return Object.assign({}, state, changes, actionChanges);
        }
        case GET_CATEGORIES: {
            return Object.assign({}, state, { allCategories: action.payload.categories }, actionChanges);
        }
        case UPDATE_TAB: {
            const { currentTab = 'upcoming' } = action.payload;

            let changes = procNewData(currentTab, state, {page: 0, currentTab: currentTab}, action.payload);

            if (currentTab !== state.currentTab) {
                changes.searchText = '';
                changes.selectedCategories= [];
                changes.priceMin= '';
                changes.priceMax= '';
            }

            return Object.assign({}, state, changes, actionChanges);
        }
        case UPDATE_FILTERS_NEW: {
            const { currentTab = 'upcoming' } = state;

            let changes = procNewData(currentTab, state, {page: 0}, action.payload, false);

            return Object.assign({}, state, changes, actionChanges);
        }
        case UPDATE_SORTING: {
            const { currentTab = 'upcoming' } = state;

            let changes = procNewData(currentTab, state, {page: 0, sorting: action.payload.sorting}, action.payload, false);

            return Object.assign({}, state, changes, actionChanges);
        }
        case UPDATE_SEARCH: {
            const { currentTab = 'upcoming' } = state;

            let changes = procNewData(currentTab, state, {page: 0, searchText: action.payload.searchText}, action.payload, false);

            return Object.assign({}, state, changes, actionChanges);
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

            return Object.assign({}, state, changes, actionChanges);
        }
        case UPDATE_ALL_FROM_URL: {
            const { currentTab = 'upcoming' } = action.payload;

            let changes = procNewData(currentTab, state, {page: 0}, action.payload, false);

            return Object.assign({}, state, action.payload, changes, actionChanges);
        }
        default: {
            return state;
        }
    }
}

const procNewData = (currentTab, state, changes, payload, removeFilters = true) => {
    changes = reduceRefreshedData(changes, payload);

    if (currentTab === 'upcoming' || currentTab === 'past') {
        // if (!removeFilters && currentTab === 'upcoming' && state.allCategories.length > 0 && payload.categoryIds) {
        if (currentTab === 'upcoming' && state.allCategories.length > 0 && payload.categoryIds) {
            changes.availableCategories = state.allCategories.filter(item => payload.categoryIds.indexOf(item.id.toString()) !== -1);
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
        } else {
            changes.lotsPast = uniqueItemsObj ? Object.values(uniqueItemsObj) : [];
            changes.pastLotsCount = changes.activeTabCounter;

            changes.lotsNew = [];
            changes.auctionsNew = [];
            changes.postsNew = [];
        }
    } else if (currentTab === 'auctions') {
        // if (!removeFilters && state.allCategories.length > 0 && payload.categoryIds) {
        if (state.allCategories.length > 0 && payload.categoryIds) {
            changes.availableCategories = state.allCategories.filter(item => payload.categoryIds.indexOf(item.id) !== -1);
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
    } else {
        // if (!removeFilters && state.allCategories.length > 0 && payload.categoryIds) {
        if (state.allCategories.length > 0 && payload.categoryIds) {
            changes.availableCategories = state.allCategories.filter(item => payload.categoryIds.indexOf(item.id) !== -1);
        }

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

        changes.lotsNew = [];
        changes.lotsPast = [];
        changes.auctionsNew = [];
    }

    return changes;
};

export default rootReducer;
