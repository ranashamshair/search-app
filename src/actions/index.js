import {
    GET_AUCTIONS,
    GET_CATEGORIES,
    GET_LOTS,
    GET_PAST_LOTS,
    GET_POSTS,
    LOAD_MORE, NEXT_PAGE,
    UPDATE_FILTERS_NEW,
    UPDATE_SEARCH,
    UPDATE_SORTING,
    UPDATE_TAB
} from "../constants/action-types";
import axios from "axios";


// const baseUrl = 'https://johnmoran.hksndev2.co.uk/wp-json';
// const baseUrl = 'https://johnmoranstage.invaluable.com/wp-json';
const baseUrl = 'http://hksndev2.co.uk/contemporary/wp-json';
// const baseUrl = '/wp-json';

const requestOptions = {
    headers: {
        'id': 'V053C9yWvo45XsOxKB',
    }
};

export function getLots(payload = null) {
    return async (dispatch) => {
        const newParams = await getLotsNew(payload, true);

        return dispatch({type: GET_LOTS, payload: newParams});
    }
}

export function getPastLots(payload = null) {
    return async (dispatch) => {
        const newParams = await getLotsNew(payload, true, true);

        return dispatch({type: GET_PAST_LOTS, payload: newParams});
    }
}

export function getAuctions(payload = null) {
    return async (dispatch) => {
        const newParams = await getAuctionsNew(payload, true, true);

        return dispatch({type: GET_AUCTIONS, payload: newParams});
    }
}

export function getOther(payload = null) {
    return async (dispatch) => {
        const newParams = await getOtherNew(payload, true, true);

        return dispatch({type: GET_POSTS, payload: newParams});
    }
}

export function getCategories(payload = null) {
    return async (dispatch) => {
        try {
            const response = await axios.get( baseUrl + '/searchlots/inv/categories', requestOptions);

            return dispatch({
                type: GET_CATEGORIES,
                payload: {
                    categories: response.data || []
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
}

const orderParams = (sorting = '', type = null) => {
    if (sorting === '') {
        if (!type) return '';

        else {
            switch (type) {
                case 'upcoming': return 'sort_by=date&sort_order=asc';
                case 'past': return 'sort_by=date&sort_order=desc';
                case 'auctions': return 'sort_by=date&sort_order=asc';
                case 'other': return 'sort_by=date&sort_order=desc';
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
    let route = baseUrl + (past ? '/searchlots/inv/past' : '/searchlots/inv/upcoming') + (payload ? lotFilter(payload, past) : '');
    const params = payload ? { ...payload } : {};

    try {
        const response = await axios.get(route, requestOptions);

        params.items = response.data.data;
        params.count = response.data.count;
        if (!past) params.categoryIds = response.data.used_categories;
        params.success = true;
    } catch (error) {
        console.log('error: ', error);
        params.message = (typeof error === 'string') ? error : ((error.hasOwnProperty('response') && error.response)  ? error.response.data.message : '');
    }

    return params;
}

async function getAuctionsNew(payload = null, refresh = false) {
    let route = baseUrl + '/searchlots/inv/auctions' + (payload ? auctionFilter(payload) : '');

    const params = payload ? { ...payload } : {};

    try {
        const response = await axios.get(route, requestOptions);

        params.items = response.data.data;
        params.count = response.data.count;
        params.categoryIds = response.data.used_categories;
        params.success = true;
    } catch (error) {
        console.log(error);
        params.message = (typeof error === 'string') ? error : ((error.hasOwnProperty('response') && error.response)  ? error.response.data.message : '');
    }

    return params;
}

async function getOtherNew(payload = null, refresh = false) {
    let route = baseUrl + '/searchlots/inv/search' + (payload ? otherFilter(payload) : '');

    const params = payload ? { ...payload } : {};

    try {
        const response = await axios.get(route, requestOptions);

        params.items = response.data.data;
        params.count = response.data.count;
        params.categoryIds = response.data.used_categories;
        params.success = true;
    } catch (error) {
        console.log(error);
        params.message = (typeof error === 'string') ? error : ((error.hasOwnProperty('response') && error.response)  ? error.response.data.message : '');
    }

    return params;
}


export function updateTab(payload = null) {
    return async (dispatch) => (dispatch({type: UPDATE_TAB, payload: payload}));
}

export function updateFiltersNew(payload = null, tab = 'upcoming') {
    return async (dispatch) => (dispatch({type: UPDATE_FILTERS_NEW, payload: payload}));
}

export function updateSorting(payload = null) {
    return (dispatch) => (dispatch({type: UPDATE_SORTING, payload: payload}));
}

export function updateSearch(payload = null) {
    return (dispatch) => (dispatch({type: UPDATE_SEARCH, payload: payload}));
}

export function loadMore(payload = null, tab = 'upcoming') {
    return async (dispatch) => {
        let newParams = null;

        switch (tab) {
            case 'upcoming': newParams = await getLotsNew(payload); break;
            case 'past': newParams = await getLotsNew(payload, false, true); break;
            case 'auctions': newParams = await getAuctionsNew(payload); break;
            case 'other': newParams = await getOtherNew(payload); break;
        }

        return dispatch({type: LOAD_MORE, payload: newParams});
    };
}

export function setNextPage() {
    return (dispatch) => (dispatch({type: NEXT_PAGE, payload: {}}));
}

