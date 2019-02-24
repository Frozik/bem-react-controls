import React, { ComponentType, PureComponent } from "react";
import { Store, Unsubscribe } from "redux";

import { DispatchContext, IDispatchProps } from "./contracts";
import { Enhancer } from "./enhancer";
import { Actions } from "./actions";

interface ISplitUpdates {
    stateDiff?: IDispatchProps;
    propsDiff: IDispatchProps | null;
}

function splitUpdates(
    props: IDispatchProps,
    state: IDispatchProps,
    storeKeys: { [key: string]: boolean },
): ISplitUpdates {
    return (Object.keys(props) as Array<keyof IDispatchProps>).reduce(
        (accumulator, key) => {
            const newValue = props[key];

            if (state[key] === newValue) {
                return accumulator;
            }

            if (storeKeys[key]) {
                if (!accumulator.stateDiff) {
                    accumulator.stateDiff = { [key]: newValue };
                } else {
                    accumulator.stateDiff[key] = newValue;
                }
            } else {
                if (!accumulator.propsDiff) {
                    accumulator.propsDiff = { [key]: newValue };
                } else {
                    accumulator.propsDiff[key] = newValue;
                }
            }

            return accumulator;
        },
        {
            stateDiff: undefined,
            propsDiff: null,
        } as ISplitUpdates,
    );
}

export const buildInternalStorageEnhancer = (store: Store): Enhancer<IDispatchProps> =>
    (NestedWrappedComponent: ComponentType<IDispatchProps>) => {
        const storeKeys = Object.keys(store.getState()).reduce(
            (accumulator, key) => {
                accumulator[key] = true;

                return accumulator;
            },
            {} as { [key: string]: boolean },
        );

        return class extends PureComponent<IDispatchProps, IDispatchProps> {
            constructor(props: IDispatchProps) {
                super(props);

                const { stateDiff, propsDiff } = splitUpdates(props, {}, storeKeys);

                this.state = { ...stateDiff, ...propsDiff };
            }

            private unsubscribeStoreChanges?: Unsubscribe;

            state = store.getState() as IDispatchProps;

            componentDidMount() {
                this.unsubscribeStoreChanges = store.
                    subscribe(() => this.setState(store.getState()));
            }

            static getDerivedStateFromProps(props: IDispatchProps, state: IDispatchProps): Partial<IDispatchProps> | null {
                const { stateDiff, propsDiff } = splitUpdates(props, state, storeKeys);

                if (stateDiff) {
                    store.dispatch(Actions.merge(stateDiff));
                }

                return propsDiff;
            }

            componentWillUnmount() {
                if (this.unsubscribeStoreChanges) {
                    this.unsubscribeStoreChanges();
                }
            }

            render() {
                return (
                    <DispatchContext.Provider value={ store.dispatch }>
                        { React.createElement(NestedWrappedComponent, this.state) }
                    </DispatchContext.Provider>
                );
            }
        };
    };
