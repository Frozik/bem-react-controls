import { Action } from "redux";

export interface IActionWithPayload<T, P> extends Action<T> {
    payload: P;
}

export function createAction<T extends string>(type: T): Action;
export function createAction<T extends string, P>(type: T, payload: P): IActionWithPayload<T, P>;
export function createAction<T extends string, P>(type: T, payload?: P) {
    return payload === undefined ? { type } : { type, payload };
}

type FunctionType = (...agrs: any[]) => any;
type ActionCreatorsMapObject = { [actionCreator: string]: FunctionType };

export type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<A[keyof A]>;
