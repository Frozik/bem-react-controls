import { ActionsUnion, createAction } from "../../action.helper";

export enum ActionTypes {
    FOCUS_CHANGED = "[modifier] FOCUS_CHANGED",
}

export const Actions = {
    changeFocus: (hasFocus: boolean) => createAction(ActionTypes.FOCUS_CHANGED, hasFocus)
};

export type Actions = ActionsUnion<typeof Actions>;
