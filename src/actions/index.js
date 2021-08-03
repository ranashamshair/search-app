import {
    // GET_CATEGORIES,
    INIT_DATA,
    LOAD_MORE, RESET_FILTERS, UPDATE_ALL_FROM_URL,
    UPDATE_FILTERS_NEW,
    UPDATE_SEARCH,
    UPDATE_SORTING,
    UPDATE_TAB
} from "../constants/action-types";
import axios from "axios";


// const baseUrl = 'https://johnmoran.hksndev2.co.uk/wp-json';
// const baseUrl = 'https://johnmoranstage.invaluable.com/wp-json';
// const baseUrl = 'https://hksndev2.co.uk/contemporary/wp-json';
// const baseUrl = 'https://www.dzendzianandsons.com/wp-json';
const baseUrl = '/wp-json';

const requestOptions = {
    headers: {
        // 'id': 'V053C9yWvo45XsOxKB',
        'id': 's2DUnuzU3TVfk44ZNp',
    }
};

const orderParams = (sorting = '', type = null) => {
    if (sorting === '') {
        if (!type) return '';

        else {
            switch (type) {
                case 'upcoming': return 'sort_by=date&sort_order=asc';
                case 'past': return 'sort_by=date&sort_order=desc';
                case 'auctions': return 'sort_by=date&sort_order=desc';
                case 'other': return 'sort_by=date&sort_order=desc';
                default: return '';
            }
        }
    }

    const sort = sorting.split('||');
    return `sort_by=${sort[0]}&sort_order=${sort[1]}`;
};

const lotFilter = (params, isPast = false) => {
    const { searchText = null, selectedCategories = [], priceMin = null, priceMax = null, pageSize = 20, page = 0, sorting = '' } = params;

    const qs = [];
    if (searchText) qs.push('keyword=' + searchText);
    if (priceMin || priceMax) {
        if (priceMin && !priceMax) {
            qs.push('pricemin=' + priceMin);
            qs.push('pricemax=99999');
        } else if (!priceMin && priceMax) {
            qs.push('pricemin=0');
            qs.push('pricemax=' + priceMax);
        } else {
            qs.push('pricemin=' + priceMin);
            qs.push('pricemax=' + priceMax);
        }
    }
    if(selectedCategories.length > 0) qs.push('categories=' + selectedCategories.join(' '));
    qs.push('size=' + pageSize);
    qs.push('page=' + page);

    const ord = orderParams(sorting, isPast ? 'past' : 'upcoming');

    return qs.length > 0 ? '?' + qs.join('&') + (ord ? '&' + ord : '') : '';
};

const auctionFilter = (params) => {
    const { searchText = null, selectedCategories = [], pageSize = 20, page = 0, sorting = '' } = params;

    const qs = [];
    if (searchText) qs.push('keyword=' + searchText);
    if(selectedCategories.length > 0) qs.push('categories=' + selectedCategories.join(' '));
    qs.push('size=' + pageSize);
    qs.push('page=' + page);

    const ord = orderParams(sorting, 'auctions');

    return qs.length > 0 ? '?' + qs.join('&') + (ord ? '&' + ord : '') : '';
};

const otherFilter = (params) => {
    const { searchText = null, selectedCategories = [], pageSize = 20, page = 0, sorting = '' } = params;

    const qs = [];
    if (searchText) qs.push('keyword=' + searchText);
    if(selectedCategories.length > 0) qs.push('categories=' + selectedCategories.join(' '));
    qs.push('size=' + pageSize);
    qs.push('page=' + page);

    const ord = orderParams(sorting, 'other');

    return qs.length > 0 ? '?' + qs.join('&') + (ord ? '&' + ord : '') : '';
};

async function getLotsNew(payload = null, refresh = false, past = false) {
    let route = baseUrl + (past ? '/searchlots/inv/past' : '/searchlots/inv/upcoming') + ((payload && !refresh) ? lotFilter(payload, past) : `?${ ((payload && payload.searchText) ? `keyword=${payload.searchText}&`: '') + orderParams('', past ? 'past': 'upcoming')}`);
    const params = payload ? { ...payload } : {};

    try {
        const response = await axios.get(route, requestOptions);

        if (response.data.count === 0) {
            throw new Error('Nothing found');
        }

        params.items = response.data.data;
        params.count = response.data.count;
        if (!past) params.usedCategories = response.data.used_categories;
        params.success = true;
    } catch (error) {
        // console.log(error);
        params.success = false;
        params.message = (typeof error === 'string') ? error : ((error.hasOwnProperty('response') && error.response)  ? error.response.data.message : (error.message || ''));
    }

    return params;
}

async function getAuctionsNew(payload = null, refresh = false) {
    let route = baseUrl + '/searchlots/inv/auctions' + ((payload && !refresh) ? auctionFilter(payload) : `?${ ((payload && payload.searchText) ? `keyword=${payload.searchText}&`: '') + orderParams('', 'auctions')}`);
    const params = payload ? { ...payload } : {};

    try {
        const response = await axios.get(route, requestOptions);

        params.items = response.data.data;
        params.count = response.data.count;
        params.usedCategories = response.data.used_categories;
        params.success = true;
    } catch (error) {
        // console.log(error);
        params.success = false;
        params.message = (typeof error === 'string') ? error : ((error.hasOwnProperty('response') && error.response)  ? error.response.data.message : '');
    }

    return params;
}

async function getOtherNew(payload = null, refresh = false) {
    let route = baseUrl + '/searchlots/inv/search' + ((payload && !refresh) ? otherFilter(payload) : `?${ ((payload && payload.searchText) ? `keyword=${payload.searchText}&`: '') + orderParams('', 'other')}`);

    const params = payload ? { ...payload } : {};

    try {
        const response = await axios.get(route, requestOptions);

        params.items = response.data.data;
        params.count = response.data.count;
        params.usedCategories = response.data.used_categories;
        params.success = true;
    } catch (error) {
        // console.log(error);
        params.success = false;
        params.message = (typeof error === 'string') ? error : ((error.hasOwnProperty('response') && error.response)  ? error.response.data.message : '');
    }

    return params;
}



export function updateFromURL(payload = null) {
    return async (dispatch) => {
        const { currentTab = 'upcoming' } = payload;

        let newParams = null;

        switch (currentTab) {
            case 'upcoming': newParams = await getLotsNew(payload); break;
            case 'past': newParams = await getLotsNew(payload, false, true); break;
            case 'auctions': newParams = await getAuctionsNew(payload); break;
            case 'other': newParams = await getOtherNew(payload); break;
        }

        return dispatch({type: UPDATE_ALL_FROM_URL, payload: newParams});
    }
}

export function updateTab(payload = {}) {
    return async (dispatch) => {
        const { currentTab = 'upcoming' } = payload;

        let newParams = null;

        switch (currentTab) {
            case 'upcoming': newParams = await getLotsNew(payload); break;
            case 'past': newParams = await getLotsNew(payload, false, true); break;
            case 'auctions': newParams = await getAuctionsNew(payload); break;
            case 'other': newParams = await getOtherNew(payload); break;
        }

        return dispatch({type: UPDATE_TAB, payload: newParams});
    }
}

export function updateFiltersNew(payload = {}, tab = 'upcoming') {
    return async (dispatch) => {
        let newParams = null;

        switch (tab) {
            case 'upcoming': newParams = await getLotsNew(payload); break;
            case 'past': newParams = await getLotsNew(payload, false, true); break;
            case 'auctions': newParams = await getAuctionsNew(payload); break;
            case 'other': newParams = await getOtherNew(payload); break;
        }

        return dispatch({type: UPDATE_FILTERS_NEW, payload: newParams});
    };
}

export function updateSorting(payload = null) {
    return async (dispatch) => {
        const { currentTab = 'upcoming' } = payload;

        let newParams = null;

        switch (currentTab) {
            case 'upcoming': newParams = await getLotsNew(payload); break;
            case 'past': newParams = await getLotsNew(payload, false, true); break;
            case 'auctions': newParams = await getAuctionsNew(payload); break;
            case 'other': newParams = await getOtherNew(payload); break;
        }

        return dispatch({type: UPDATE_SORTING, payload: newParams});
    };
}

export function updateSearch(payload = null) {
    return async (dispatch) => {
        const { currentTab = 'upcoming' } = payload;

        let newParams = null;

        switch (currentTab) {
            case 'upcoming': newParams = await getLotsNew(payload); break;
            case 'past': newParams = await getLotsNew(payload, false, true); break;
            case 'auctions': newParams = await getAuctionsNew(payload); break;
            case 'other': newParams = await getOtherNew(payload); break;
        }

        return dispatch({type: UPDATE_SEARCH, payload: newParams});
    };
}

export function loadMore(payload = null, tab = 'upcoming') {
    return async (dispatch) => {
        let newParams = null;

        if (payload.page === 0) ++payload.page;

        switch (tab) {
            case 'upcoming': newParams = await getLotsNew(payload); break;
            case 'past': newParams = await getLotsNew(payload, false, true); break;
            case 'auctions': newParams = await getAuctionsNew(payload); break;
            case 'other': newParams = await getOtherNew(payload); break;
        }

        return dispatch({type: LOAD_MORE, payload: newParams});
    };
}

export function resetFilters(search = '', tab = 'upcoming') {
    return async (dispatch) => {
        let newParams = null;

        const payload = {
            currentTab: tab,
            searchText: search,
            selectedCategories: [],
            priceMin: '',
            priceMax: '',
            sorting: ''
        };

        switch (tab) {
            case 'upcoming': newParams = await getLotsNew(payload); break;
            case 'past': newParams = await getLotsNew(payload, false, true); break;
            case 'auctions': newParams = await getAuctionsNew(payload); break;
            case 'other': newParams = await getOtherNew(payload); break;
        }

        return dispatch({type: RESET_FILTERS, payload: newParams});
    }
}

export function initData() {
    return async (dispatch) => {
        let newParams = await getLotsNew({});

        return dispatch({type: INIT_DATA, payload: newParams});
    };
}