import {GET_AUCTIONS, GET_CATEGORIES, GET_EVENTS, GET_LOTS, GET_NEWS, GET_PAST_LOTS} from "../constants/action-types";
import axios from "axios";

const baseUrl = 'https://johnmoran.hksndev2.co.uk/wp-json';

const pageSize = 20;

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

            if(filters.contentType) {
                const ct = filters.contentType;
                const types = [];

                if(ct.lots) types.push('auctions');
                if(ct.events) types.push('events');
                if(ct.stories) types.push('news');

                qs.push('type=' + types.join(','));
            }

        }

        qs.push('size=' + pageSize);

        if(upcoming && params.page > 0) qs.push('page=' + params.page);
        else if(!upcoming && params.pagePast > 0) qs.push('page=' + params.pagePast);

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
    if(!params) params = {};

    if(success){
        if(
            (!isSearch && response.data.length < pageSize) ||
            (isSearch && response.data && response.data[itemsKey].length < pageSize)
        ) params[pageKey] = -1;

        let data = isSearch ? response.data[itemsKey] : response.data;

        console.log('itemsKey: ', itemsKey);
        console.log('params: ', params);

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

    return params;
}


export function getLots(payload = null) {
    return function (dispatch) {
        var params = payload;

        let route = procLotFilters(baseUrl + '/searchlots/inv/upcoming', params, true);

        return axios.get(route, {
            headers: {
                'id': 'kniWHWvyfDrEbi1noF'
            }
        })
            .then( response => {
                dispatch({
                    type: GET_LOTS,
                    payload: procRes(params, response, 'lots', 'upcomingLoading', 'page', 'changedLots')
                });
            } )
            .catch(error => {
                console.log(error);

                dispatch({
                    type: GET_LOTS,
                    payload: procRes(params, error.response.data, 'lots', 'upcomingLoading', 'page', 'changedLots', 'lotsMessage', false)
                });
            });
    }
}

export function getPastLots(payload = null) {
    return function (dispatch) {
        var params = payload;

        let route = procLotFilters(baseUrl + '/searchlots/inv/past', params);

        return axios.get(route, {
            headers: {
                'id': 'kniWHWvyfDrEbi1noF'
            }
        })
            .then( response => {
                dispatch({
                    type: GET_PAST_LOTS,
                    payload: procRes(params, response, 'pastLots', 'pastLoading', 'pagePast', 'changedPastLots')
                });
            } )
            .catch(error => {
                console.log(error);

                dispatch({
                    type: GET_PAST_LOTS,
                    payload: procRes(params, error.response.data, 'pastLots', 'pastLoading', 'pagePast', 'changedPastLots', 'pastLotsMessage', false)
                });
            });
    }
}

export function getAuctions(payload = null) {
    return function(dispatch){
        var params = payload;

        let route = procSearchFilters(baseUrl + '/searchlots/inv/search', params, 'auctions');

        return axios.get(route, {
            headers: {
                'id': 'kniWHWvyfDrEbi1noF'
            }
        })
            .then( response => {
                dispatch({
                    type: GET_AUCTIONS,
                    payload: procRes(params, response, 'auctions', 'auctionsLoading', 'pageAuctions', 'changedAuctions')
                });
            } )
            .catch(error => {
                console.log(error);

                dispatch({
                    type: GET_AUCTIONS,
                    payload: procRes(params, error.response.data, 'auctions', 'auctionsLoading', 'pageAuctions', 'changedAuctions', 'auctionsMessage', false)
                });
            });
    }
}

export function getEvents(payload = null) {
    return function(dispatch){
        var params = payload;

        let route = procSearchFilters(baseUrl + '/searchlots/inv/search', params, 'events');

        return axios.get(route, {
            headers: {
                'id': 'kniWHWvyfDrEbi1noF'
            }
        })
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
    return function(dispatch){
        var params = payload;

        let route = procSearchFilters(baseUrl + '/searchlots/inv/search', params, 'news');

        return axios.get(route, {
            headers: {
                'id': 'kniWHWvyfDrEbi1noF'
            }
        })
            .then( response => {
                dispatch({
                    type: GET_NEWS,
                    payload: procRes(params, response, 'news', 'newsLoading', 'pageNews', 'changedArticles', null, true, true)
                });
            } )
            .catch(error => {
                console.log('NEWS|ARTICLES error: ', error);

                dispatch({
                    type: GET_NEWS,
                    payload: procRes(params, error.response.data, 'news', 'newsLoading', 'pageNews', 'changedArticles', 'newsMessage', false)
                });
            });
    }
}




export function getCategories(payload = null) {
    return function (dispatch) {
        return axios.get( baseUrl + '/searchlots/inv/categories', {
            headers: {
                'id': 'kniWHWvyfDrEbi1noF'
            }
        })
            .then( response => {
                dispatch({ type: GET_CATEGORIES, payload: {
                        categories: response.data
                        // isLoading: false
                    }
                });
            } )
            .catch(error => {
                console.log(error);
            });
    }
}
