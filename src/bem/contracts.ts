import React from "react";
import { Action, AnyAction, Dispatch } from "redux";

export const DispatchContext = React.createContext(<T extends Action = AnyAction>(action: T) => action);

export interface IClassNameProps {
    className?: string;
}

export interface IDispatchProps extends IClassNameProps {
    useGlobalStore?: boolean;
    cid?: string;
    dispatch?: Dispatch;
}
