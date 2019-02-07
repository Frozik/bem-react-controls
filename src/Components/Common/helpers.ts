import memoize from "memoize-one";

import { IAnyProps } from "./types";

export function getDisplayName(WrappedComponent: any) {
    return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export function getStateDiff(state: IAnyProps, props: IAnyProps): IAnyProps | undefined {
    return Object.keys(props).reduce(
        (accumulator: IAnyProps | undefined, key) => {
            const newValue = props[key];

            if (state[key] === newValue) {
                return accumulator;
            }

            if (!accumulator) {
                return { [key]: newValue };
            }

            accumulator[key] = newValue;

            return accumulator;
        },
        undefined
    );
}

export const getMemoizeProps = memoize((props: IAnyProps, stateKeys: string[] = []) => (Object.keys(props).reduce(
    (accumulator: { events: IAnyProps, state: IAnyProps }, key) => {
        const type: keyof (typeof accumulator) = stateKeys.indexOf(key) >= 0 ? "state" : "events";

        accumulator[type][key] = props[key];

        return accumulator;
    },
    { events: {}, state: {} }
)));
