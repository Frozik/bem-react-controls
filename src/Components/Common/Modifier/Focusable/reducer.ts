import { Actions, ActionTypes } from "./actions";

// todo: Add support of CID

export function focused(state: boolean = false, action: Actions) {
    switch (action.type) {
        case ActionTypes.FOCUS_CHANGED:
            const { payload: hasFocus } = action;
            return hasFocus;

        default:
            return state;
    }
}
