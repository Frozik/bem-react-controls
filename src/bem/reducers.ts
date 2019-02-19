import { AnyAction, Reducer } from "redux";

import { ActionTypes } from "./actions";

export function mergePropsReducer(combinedReducer: Reducer): Reducer {
    return (state: any, action: AnyAction) => {
        switch (action.type) {
            case ActionTypes.PROPS_MERGE:
                return {
                    ...state,
                    ...action.payload,
                };

            default:
                return combinedReducer(state, action);
        }
    };
}
