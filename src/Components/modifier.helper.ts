import { EventHandler, SyntheticEvent } from "react";

export function propagateDomEvent<E extends SyntheticEvent>(
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
