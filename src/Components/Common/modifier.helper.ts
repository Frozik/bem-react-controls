import React, { EventHandler, SyntheticEvent } from "react";
import { Action, AnyAction } from "redux";

import { IAnyProps } from "./contracts";

export const DispatchContext = React.createContext(<T extends Action = AnyAction>(action: T) => action);

export function cleanProps<P extends Partial<IAnyProps>>(originalProps: P, keys: Array<keyof P>): Partial<P> {
    return Object.keys(originalProps).reduce(
        (accumulator: Partial<IAnyProps>, key) => {
            if (keys.indexOf(key) < 0) {
                accumulator[key] = originalProps[key];
            }

            return accumulator;
        },
        {}
    );
}

export function propagateSourceEvent<E extends SyntheticEvent>(
    handler: EventHandler<E>,
    propsEventHandler?: EventHandler<E>,
    stopEventPropagation: boolean = true
) {
    return function (event: E) {
        if (stopEventPropagation) {
            event.stopPropagation();
        }

        handler(event);

        if (propsEventHandler) {
            propsEventHandler(event);
        }
    };
}
