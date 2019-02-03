import { Actions, ActionTypes } from "./actions";

// todo: Add support of CID

export function value(state: string = "", action: Actions) {
    switch (action.type) {
        case ActionTypes.VALUE_CHANGED:
            const { payload: value } = action;
            return value;

        default:
            return state;
    }
}
