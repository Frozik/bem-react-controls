import React, { Component, ComponentType } from "react";
import { applyMiddleware, createStore, Dispatch, Reducer, Store, Unsubscribe, Middleware } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";

import { ClassNameFormatter } from "@bem-react/classname";
import { compose, Enhance, IClassNameProps, withBemMod, Wrapper } from "@bem-react/core";

export interface IDispatchProps extends IClassNameProps {
    dispatch: Dispatch;
}

export interface IOptionalDispatchProps extends Partial<IDispatchProps> {
}

// todo: Add possibility to take external dispatch, CID

export function buildStatefulComponent<T extends IClassNameProps>(
    cn: ClassNameFormatter,
    WrappedComponent: ComponentType<T>,
    componentReducer: Reducer,
) {
    const dispatchable:Enhance<IOptionalDispatchProps> = (NestedWrappedComponent) => (
        class extends Component<IOptionalDispatchProps, Store> {
            constructor(props: IOptionalDispatchProps) {
                super(props);

                const middlewares:Middleware[] = [thunk];

                if (process.env.NODE_ENV !== "production") {
                    middlewares.push(logger);
                }

                this.state = createStore(
                    componentReducer,
                    applyMiddleware(...middlewares)
                );
            }

            unsubscribeStoreChanges: Unsubscribe | undefined;

            componentDidMount() {
                if (this.state) {
                    this.unsubscribeStoreChanges = this.state.subscribe(this.forceUpdate.bind(this));
                }
            }

            componentWillUnmount() {
                if (this.unsubscribeStoreChanges) {
                    this.unsubscribeStoreChanges();
                }
            }

            render() {
                return (
                    <NestedWrappedComponent {...this.state.getState()} {...this.props} dispatch={this.state.dispatch} />
                );
            }
        }
    );

    const dispatchableModifier = withBemMod<IOptionalDispatchProps>(cn(), {}, dispatchable);

    return compose(dispatchableModifier)(WrappedComponent);
}
