import {
    GET_AUCTIONS, GET_CATEGORIES, GET_EVENTS, GET_LOTS, GET_NEWS, GET_PAST_LOTS, UPDATE_FILTERS_NEW,
    UPDATE_FILTERS_ONLY, UPDATE_SEARCH, UPDATE_SORTING, UPDATE_TAB
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

function procLotFilters(route, params = null, upcoming = false) {
    if(params){
        const filters = params.staticFilters;
        const qs = [];

        if(params.searchQuery){
            qs.push('keyword=' + params.searchQuery);
        }

        if(filters){
            if(filters.pricemin) qs.push('pricemin=' + filters.pricemin);
            if(filters.pricemin) qs.push('pricemax=' + filters.pricemax);
            if(upcoming && filters.categories && filters.categories.length > 0){
                const categories = [];
                for (let c of filters.categories) {
                    if(c.indexOf('i') === -1) continue;

                    categories.push(c.replace('i', ''));
                }

                qs.push('categories=' + categories.join(' '));
            }
        }
        qs.push('size=' + pageSize);

        if(params.page > 0) qs.push('page=' + params.page);
        if(qs.length > 0) route += '?' + qs.join('&');
    }

    return route;
}

function procSearchFilters(route, params = null, type = null) {
    if(params){
        const filters = params.staticFilters;
        const qs = [];

        if(params.searchQuery) qs.push('keyword=' + params.searchQuery);

        if(filters){
            if(filters.categories && filters.categories.length > 0){
                const categories = [];
                for (let c of filters.categories) {
                    if(c.indexOf('i') !== -1) continue;

                    categories.push(c);
                }

                qs.push('categories=' + categories.join(','));
            }
        }
        if(type) qs.push('type=' + type);

        qs.push('size=' + pageSize);

        if(params.pageSearch > 0) qs.push('page=' + params.pageSearch);

        if(qs.length > 0) route += '?' + qs.join('&');
    }

    return route;
}

function procRes(params = null, response, itemsKey, loaderKey, pageKey, searchKey, msgKey = null, success = true, isSearch = false) {
    console.log('params: ', params);
    console.log('response: ', response);
    if(!params) params = {};

    if(success){
        if(
            (!isSearch && response.data.length < pageSize) ||
            (isSearch && response.data && response.data[itemsKey].length < pageSize)
        ) params[pageKey] = -1;

        let data = isSearch ? response.data[itemsKey] : response.data;

        // console.log('itemsKey: ', itemsKey);
        // console.log('params: ', params);

        if(params[searchKey]){
            params[itemsKey] = data;
        }else{
            params[itemsKey] = (params[itemsKey] && (params[pageKey] > 0 || params[pageKey] === -1)) ? [...params[itemsKey], ...data] : data;
        }

        params[loaderKey] = false;
    }else{
        params[itemsKey] = (params[itemsKey] && params[pageKey] > 0) ? params[itemsKey]: [];
        params[pageKey] = -1;
        params[loaderKey] = false;

        if(msgKey && params[itemsKey].length === 0 && response.message) params[msgKey] = response.message;
    }

    params[searchKey] = false;

    console.log('NEW params: ', params);

    return params;
}

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
        let route = procLotFilters(baseUrl + '/searchlots/inv/upcoming', payload, true);

        try {
            const response = await axios.get(route, requestOptions);

            return dispatch({
                type: GET_LOTS,
                // payload: procLots(payload, response, 'lots', 'upcomingLoading', 'page', 'changedLots')
                payload: procRes(payload, response, 'lots', 'upcomingLoading', 'page', 'changedLots')
            });
        } catch (error) {
            console.log(error);

            return dispatch({
                type: GET_LOTS,
                // payload: procLots(payload, error.response.data, 'lots', 'upcomingLoading', 'page', 'changedLots', 'lotsMessage', false)
                payload: procRes(payload, error.response.data, 'lots', 'upcomingLoading', 'page', 'changedLots', 'lotsMessage', false)
            });
        }
    }
}

export function getPastLots(payload = null) {
    return async (dispatch) => {
        let route = procLotFilters(baseUrl + '/searchlots/inv/past', payload);

        try {
            const response = await axios.get(route, requestOptions);

            return dispatch({
                type: GET_PAST_LOTS,
                payload: procRes(payload, response, 'pastLots', 'pastLoading', 'pagePast', 'changedPastLots')
            });
        } catch (error) {
            console.log(error);

            return dispatch({
                type: GET_PAST_LOTS,
                payload: procRes(payload, error.response.data, 'pastLots', 'pastLoading', 'pagePast', 'changedPastLots', 'pastLotsMessage', false)
            });
        }
    }
}

export function getAuctions(payload = null) {
    return async (dispatch) => {
        let route = procSearchFilters(baseUrl + '/searchlots/inv/auctions', payload, 'auctions');

        try {
            const response = await axios.get(route, requestOptions);

            return dispatch({
                type: GET_AUCTIONS,
                payload: procRes(payload, response, 'auctions', 'auctionsLoading', 'pageAuctions', 'changedAuctions')
            });
        } catch (error) {
            console.log(error);

            return dispatch({
                type: GET_AUCTIONS,
                payload: procRes(payload, error.response.data, 'auctions', 'auctionsLoading', 'pageAuctions', 'changedAuctions', 'auctionsMessage', false)
            });
        }
    }
}

export function getEvents(payload = null) {
    return function(dispatch){
        var params = payload;

        let route = procSearchFilters(baseUrl + '/searchlots/inv/search', params, 'events');

        return axios.get(route, requestOptions)
            .then( response => {
                dispatch({
                    type: GET_EVENTS,
                    payload: procRes(params, response, 'events', 'eventsLoading', 'pageEvents', 'changedEvents')
                });
            } )
            .catch(error => {
                console.log(error);

                dispatch({
                    type: GET_EVENTS,
                    payload: procRes(params, error.response.data, 'events', 'eventsLoading', 'pageEvents', 'changedEvents', 'eventsMessage', false)
                });
            });
    }
}

export function getNews(payload = null) {
    return async (dispatch) => {
        let route = procSearchFilters(baseUrl + '/searchlots/inv/search', payload, 'news');

        try {
            const response = await axios.get(route, requestOptions);

            return dispatch({
                type: GET_NEWS,
                payload: procRes(payload, response, 'news', 'newsLoading', 'pageNews', 'changedArticles', null, true, true)
            });
        } catch (error) {
            console.log('NEWS|ARTICLES error: ', error);

            return dispatch({
                type: GET_NEWS,
                payload: procRes(payload, error.response.data, 'news', 'newsLoading', 'pageNews', 'changedArticles', 'newsMessage', false)
            });
        }
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
//
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
async function getLotsNew(payload = null, refresh = false) {
    let route = baseUrl + '/searchlots/inv/upcoming' + lotFilter(payload);
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

    return payload;
}

async function getAuctionsNew(payload = null, refresh = false) {
    let route = baseUrl + '/searchlots/inv/auctions' + auctionFilter(payload);

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

    return payload;
}

async function getOtherNew(payload = null, refresh = false) {
    let route = baseUrl + '/searchlots/inv/search' + otherFilter(payload);

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

    return payload;
}


// TODO save URL params changes in store !!!
export function updateTab(payload = null) {
    return async (dispatch) => {
        let newParams = null;

        switch (payload.currentTab) {
            case 'upcoming': newParams = await getLotsNew(payload, true); break;
            case 'past': newParams = await getLotsNew(payload, true); break;
            case 'auctions': newParams = await getAuctionsNew(payload, true); break;
            case 'other': newParams = await getOtherNew(payload, true); break;
        }

        console.log('newParams: ', newParams);

        return dispatch({type: UPDATE_TAB, payload: newParams});
    }
}

export function updateFiltersNew(payload = null, tab = '') {
    return async (dispatch) => {
        let newParams = null;

        switch (tab) {
            case 'upcoming': newParams = await getLotsNew(payload, true); break;
            case 'past': newParams = await getLotsNew(payload, true); break;
            case 'auctions': newParams = await getAuctionsNew(payload, true); break;
            case 'other': newParams = await getOtherNew(payload, true); break;
        }

        return dispatch({type: UPDATE_FILTERS_NEW, payload: payload});
    };
}

export function updateSorting(payload = null) {
    return (dispatch) => (dispatch({type: UPDATE_SORTING, payload: payload}));
}

export function updateSearch(payload = null) {
    return (dispatch) => (dispatch({type: UPDATE_SEARCH, payload: payload}));
}