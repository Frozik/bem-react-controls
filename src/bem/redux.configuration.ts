import { ReactReduxContextValue } from "react-redux";
import { applyMiddleware, compose, createStore, Dispatch, Middleware, Reducer, Store } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";

function getMiddleWares(useStoreLogging?: boolean): Middleware[] {
    const middlewares: Middleware[] = [thunk];

    if (!useStoreLogging && process.env.NODE_ENV !== "production") {
        middlewares.push(logger);
    }

    return middlewares;
}

export function buildStore(componentReducer: Reducer): Store {
    return createStore(
        componentReducer,
        applyMiddleware(...getMiddleWares()),
    );
}

export function configureDispatch({ store }: ReactReduxContextValue, propsDispatch?: Dispatch): Dispatch {
    const middlewares = getMiddleWares(true);

    if (!middlewares.length) {
        return propsDispatch || store.dispatch;
    }

    let dispatchGuard = () => {
        throw new Error(`Dispatching while constructing your middleware is not allowed. ` +
            `Other middleware would not be applied to this dispatch.`);
    };

    const middlewareAPI = {
        getState: store.getState,
        dispatch: () => dispatchGuard(),
    };

    const chain = middlewares.map(middleware => middleware(middlewareAPI));

    return compose(...chain)(propsDispatch || store.dispatch) as Dispatch;
}
