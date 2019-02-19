import React from "react";
import { Action, AnyAction, Dispatch } from "redux";

import { componentName, ComponentName } from "./component-name";

export const DispatchContext = React.createContext(<T extends Action = AnyAction>(action: T) => action);
export const ComponentNameContext = React.createContext<ComponentName>(componentName(""));

export interface IClassNameProps {
    className?: string;
}

export interface IDispatchProps extends IClassNameProps {
    useGlobalStore?: boolean;
    cid?: string;
    dispatch?: Dispatch;
}
