import React, { EventHandler, SyntheticEvent } from "react";
import { Action, AnyAction } from "redux";

export const DispatchContext = React.createContext(<T extends Action = AnyAction>(action: T) => action);

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
