import React, { ComponentType, PureComponent } from "react";
import { Store, Unsubscribe } from "redux";

import { DispatchContext, IDispatchProps } from "./contracts";
import { Enhancer } from "./enhancer";
import { Actions } from "./actions";

export const buildInternalStorageEnhancer = (store: Store): Enhancer<IDispatchProps> =>
    (NestedWrappedComponent: ComponentType<IDispatchProps>) => (
        class InternalStorageComponent extends PureComponent<IDispatchProps, IDispatchProps> {
            private static readonly StoreKeys = Object.keys(store.getState()).reduce(
                (accumulator, key) => {
                    accumulator[key] = true;

                    return accumulator;
                },
                {} as { [key: string]: boolean },
            );

            private unsubscribeStoreChanges?: Unsubscribe;

            state = store.getState() as IDispatchProps;

            componentDidMount() {
                this.unsubscribeStoreChanges = store.
                    subscribe(() => this.setState(store.getState()));
            }

            static getDerivedStateFromProps(props: IDispatchProps, state: IDispatchProps): Partial<IDispatchProps> | null {
                const diff = (Object.keys(props) as Array<keyof IDispatchProps>).reduce(
                    (accumulator, key) => {
                        const newValue = props[key];

                        if (state[key] === newValue) {
                            return accumulator;
                        }


                        if (InternalStorageComponent.StoreKeys[key]) {
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
                    } as { stateDiff?: IDispatchProps, propsDiff: IDispatchProps | null },
                );

                if (diff.stateDiff) {
                    store.dispatch(Actions.merge(diff.stateDiff));
                }

                return diff.propsDiff;
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
        }
    );
