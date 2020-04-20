import {GET_CATEGORIES, GET_LOTS} from "../constants/action-types";
import axios from "axios";

const baseUrl = 'https://johnmoran.hksndev2.co.uk/wp-json';

export function getLots(payload = null) {
    return function (dispatch) {
        var params = payload;

        // TODO change URL for all lots !!!
        // let route = baseUrl + '/searchlots/inv/past';
        let route = baseUrl + '/searchlots/inv/upcoming';
        if(params){
            const filters = params.staticFilters;
            const qs = [];

            if(params.searchQuery){
                qs.push('keyword=' + params.searchQuery)
            }

            if(filters){
                if(filters.upcomingOnly){
                    route = baseUrl + '/searchlots/inv/upcoming';
                }

                if(filters.pricemin) qs.push('pricemin=' + filters.pricemin);
                if(filters.pricemin) qs.push('pricemax=' + filters.pricemax);
                if(filters.categories) qs.push('categories=' + filters.categories.join(' '));
            }

            if(qs.length > 0) route += '?' + qs.join('&');
        }

        console.log('params', params);

        return axios.get(route, {
            headers: {
                'id': 'kniWHWvyfDrEbi1noF'
            }
        })
            .then( response => {
                if(!params) params = {};

                if(params.page && params.page > 0){
                    params.lots = [...params.lots, ...response.data];
                }else{
                    params.lots = response.data;
                }
                params.isLoading = false;

                console.log('result params before dispatch: ', params);

                dispatch({ type: GET_LOTS, payload: params });
            } )
            .catch(error => {
                console.log(error);

                if(!params) params = {};

                params.lots = [];
                params.isLoading = false;

                dispatch({ type: GET_LOTS, payload: params });
            });
    }
}

export function updateFilters(payload) {
    console.log('update filters payload : ', payload);

    return getLots(payload);
}

export function getArticles(payload = null) {
    return function (dispatch) {
        return axios.get( '../../../json/articles.json' )
            .then( response => {
                dispatch({ type: GET_LOTS, payload: {
                        lots: response.data,
                        isLoading: false
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
                        categories: JSON.parse(response.data),
                        isLoading: false
                    }
                });
            } )
            .catch(error => {
                console.log(error);
            });
    }
}
