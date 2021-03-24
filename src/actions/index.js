import {
    GET_AUCTIONS,
    GET_CATEGORIES,
    GET_LOTS,
    GET_PAST_LOTS,
    GET_POSTS,
    LOAD_MORE,
    UPDATE_FILTERS_NEW,
    UPDATE_FILTERS_ONLY,
    UPDATE_SEARCH,
    UPDATE_SORTING,
    UPDATE_TAB
} from "../constants/action-types";
import axios from "axios";


// const baseUrl = 'https://johnmoran.hksndev2.co.uk/wp-json';
// const baseUrl = 'https://johnmoranstage.invaluable.com/wp-json';
const baseUrl = 'http://hksndev2.co.uk/contemporary/wp-json';
// const baseUrl = '/wp-json';

const pageSize = 20;

const requestOptions = {
    headers: {
        'id': 'V053C9yWvo45XsOxKB'
    }
};

export function updateFiltersOnly(payload = null) {
    return function (dispatch) {
        return dispatch({
            type: UPDATE_FILTERS_ONLY,
            payload: payload
        });
    }
}

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

            // TODO fix categories !!!
            return dispatch({
                type: GET_CATEGORIES,
                payload: {
                    categories: response.data || []
                    // isLoading: false
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
}


const lotFilter = (params) => {
    const { searchText = null, selectedCategories = [], priceMin = null, priceMax = null, pageSize = 20, page = 1, sorting = '' } = params;

    const qs = [];
    if (searchText) qs.push('keyword=' + searchText);
    if (priceMin) qs.push('pricemin=' + priceMin);
    if (priceMax) qs.push('pricemax=' + priceMax);
    if(selectedCategories.length > 0) qs.push('categories=' + selectedCategories.join(' '));
    qs.push('size=' + pageSize);
    qs.push('page=' + page);

    return qs.length > 0 ? '?' + qs.join('&') : '';
};

const auctionFilter = (params) => {
    const { searchText = null, pageSize = 20, page = 1, sorting = '' } = params;

    // TODO finish !!!
    const qs = [];
    if (searchText) qs.push('keyword=' + searchText);
    qs.push('size=' + pageSize);
    qs.push('page=' + page);

    return qs.length > 0 ? '?' + qs.join('&') : '';
};

const otherFilter = (params) => {
    const { searchText = null, pageSize = 20, page = 1, sorting = '' } = params;

    // TODO finish !!!
    const qs = [];
    if (searchText) qs.push('keyword=' + searchText);
    qs.push('size=' + pageSize);
    qs.push('page=' + page);

    return qs.length > 0 ? '?' + qs.join('&') : '';
};

// const success = (params, info, refresh = false) => {
//     if(info.data.length < pageSize) payload.page = -1;
//
//     if(refresh){
//         params.items = info.data;
//     }else{
//         params.items = (params.items && (params.page > 0 || params.page === -1)) ? [...params.items, ...info.data] : info.data;
//     }
//     params.activeTabCounter = info.count;
//
//     return params;
// };

// const error = (params, errInfo, refresh = false) => {
//     console.log(error);
//
//     params.items = (params.items && params.items > 0) ? params.items: [];
//     params.page = -1;
//
//     if(params.items.length === 0 && errInfo.message) params.message = errInfo.message;
//
//     return params;
// };

// TODO new versions + new functions !!!
async function getLotsNew(payload = null, refresh = false, past = false) {

    let route = baseUrl + (past ? '/searchlots/inv/past' : '/searchlots/inv/upcoming') + (payload ? lotFilter(payload) : '');
    const params = payload ? { ...payload } : {};

    try {
        const response = await axios.get(route, requestOptions);

        console.log('response: ', response);

        params.items = response.data.data;
        params.count = response.data.count;
        params.success = true;
    } catch (error) {
        console.log(error);
        params.message = error.response.data.message;
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
        params.success = true;
    } catch (error) {
        console.log(error);
        params.message = error.response.data.message;
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
        params.success = true;
    } catch (error) {
        console.log(error);
        params.message = error.response.data.message;
    }

    return params;
}


// TODO save URL params changes in store !!!
export function updateTab(payload = null) {
    return async (dispatch) => {
        // let newParams = null;

        // switch (payload.currentTab) {
        //     case 'upcoming': newParams = await getLotsNew(payload, true); break;
        //     case 'past': newParams = await getLotsNew(payload, true, true); break;
        //     case 'auctions': newParams = await getAuctionsNew(payload, true); break;
        //     case 'other': newParams = await getOtherNew(payload, true); break;
        // }

        console.log('newTAB: ', payload);

        return dispatch({type: UPDATE_TAB, payload: payload});
    }
}

export function updateFiltersNew(payload = null, tab = 'upcoming') {
    return async (dispatch) => {
        // let newParams = null;

        // switch (tab) {
        //     case 'upcoming': newParams = await getLotsNew(payload, true); break;
        //     case 'past': newParams = await getLotsNew(payload, true, true); break;
        //     case 'auctions': newParams = await getAuctionsNew(payload, true); break;
        //     case 'other': newParams = await getOtherNew(payload, true); break;
        // }

        return dispatch({type: UPDATE_FILTERS_NEW, payload: payload});
    };
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
