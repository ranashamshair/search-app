import {GET_CATEGORIES, GET_LOTS, GET_PAST_LOTS} from "../constants/action-types";
import axios from "axios";

const baseUrl = 'https://johnmoran.hksndev2.co.uk/wp-json';

const pageSize = 20;

function procLotFilters(route, params = null, upcoming = false) {
    if(params){
        const filters = params.staticFilters;
        const qs = [];

        if(params.searchQuery){
            qs.push('keyword=' + params.searchQuery)
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
                if(!params) params = {};

                if(response.data.length < pageSize) params.page = -1;

                params.lots = (params.lots && (params.page > 0 || params.page === -1)) ? [...params.lots, ...response.data] : response.data;
                params.upcomingLoading = false;

                dispatch({ type: GET_LOTS, payload: params });
            } )
            .catch(error => {
                console.log(error);

                if(!params) params = {};

                params.lots = (params.lots && params.page > 0) ? params.lots: [];
                params.page = -1;
                params.upcomingLoading = false;

                dispatch({ type: GET_LOTS, payload: params });
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
                if(!params) params = {};

                if(response.data.length < pageSize) params.pagePast = -1;

                params.pastLots = (params.pastLots && (params.pagePast > 0 || params.pagePast === -1)) ? [...params.pastLots, ...response.data] : response.data;
                params.pastLoading = false;

                dispatch({ type: GET_PAST_LOTS, payload: params });
            } )
            .catch(error => {
                console.log(error);

                if(!params) params = {};

                params.pastLots = (params.pastLots && params.pagePast > 0) ? params.pastLots : [];
                params.pagePast = -1;
                params.upcomingLoading = false;

                dispatch({ type: GET_PAST_LOTS, payload: params });
            });
    }
}


export function getArticles(payload = null) {
    return function (dispatch) {
        return axios.get( '../../../json/articles.json' )
            .then( response => {
                dispatch({ type: GET_LOTS, payload: {
                        lots: response.data,
                        upcomingLoading: false
                    }
                });
            } )
            .catch(error => {
                console.log(error);
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
                        categories: response.data,
                        // isLoading: false
                    }
                });
            } )
            .catch(error => {
                console.log(error);
            });
    }
}
