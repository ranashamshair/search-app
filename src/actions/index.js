import {GET_CATEGORIES, GET_LOTS, UPDATE_FILTERS} from "../constants/action-types";
import axios from "axios";

const baseUrl = 'https://johnmoran.hksndev2.co.uk/wp-json';

export function getLots(payload = null) {
    return function (dispatch) {
        var params = payload;

        return axios.get( '../../../json/lot-detail.json' )
            .then( response => {
                console.log('params: ', params);
                if(!params) params = {};

                params.lots = response.data;
                params.isLoading = false;

                console.log('result params before dispatch: ', params);

                dispatch({ type: GET_LOTS, payload: params });
            } )
            .catch(error => {
                console.log(error);
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
