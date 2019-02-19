import { createAction } from "./action.helper";

export enum ActionTypes {
    PROPS_MERGE = "[wrapper] PROPS_MERGE",
}

export const Actions = {
    merge: (diff: { [key: string]: any }) => createAction(ActionTypes.PROPS_MERGE, diff),
};
