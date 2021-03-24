import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import rootReducer from "../reducers/index";
import thunk from "redux-thunk";

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function lastActionType(state = null, action) {
    return action.type;
}

const rootReducer2 = combineReducers({
    rootReducer,
    lastActionType // <-- use it!
});

const onAction = (action)=> {
    return action.type;
};

const actionCatchMiddleware = ({dispatch}) => next => action => {
    console.log(action);
    onAction(action);
    next(action);
};

const store = createStore(
    rootReducer,
    storeEnhancers(applyMiddleware(thunk))
);

export default store;
