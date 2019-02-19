import { ActionsUnion, createAction } from "../../../bem/action.helper";

export enum ActionTypes {
    VALUE_CHANGED = "[component] VALUE_CHANGED",
}

export const Actions = {
    changeValue: (value: string) => createAction(ActionTypes.VALUE_CHANGED, value),
};

export type Actions = ActionsUnion<typeof Actions>;
