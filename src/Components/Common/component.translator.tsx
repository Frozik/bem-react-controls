import React, { ComponentType, PureComponent } from "react";
import { applyMiddleware, createStore, Dispatch, Reducer, Store, Unsubscribe, Middleware } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";

import { ClassNameFormatter } from "@bem-react/classname";
import { compose, Enhance, IClassNameProps, withBemMod } from "@bem-react/core";

interface IDispatchProps extends IClassNameProps {
    dispatch: Dispatch;
}

export interface IOptionalDispatchProps extends Partial<IDispatchProps> {
}

export interface IComponentProps extends IOptionalDispatchProps {
    cid?: string;
}

// todo: Add possibility to take external dispatch, CID

function buildStore(componentReducer: Reducer): Store {
    const middlewares: Middleware[] = [thunk];

    if (process.env.NODE_ENV !== "production") {
        middlewares.push(logger);
    }

    return createStore(
        componentReducer,
        applyMiddleware(...middlewares),
    );
}

export function buildStatefulComponent<T extends IClassNameProps>(
    cn: ClassNameFormatter,
    WrappedComponent: ComponentType<T>,
    componentReducer: Reducer,
) {
    const dispatchable:Enhance<IComponentProps> = (NestedWrappedComponent) => (
        class extends PureComponent<IComponentProps, Store> {
            constructor(props: IComponentProps) {
                super(props);

                this.state = buildStore(componentReducer);
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
                const { cid, ...childProps } = this.state ? this.state.getState() : this.props;
                const dispatch = this.state ? this.state.dispatch : () => { throw new Error("Dispatch is not implemented"); };

                return (
                    <NestedWrappedComponent {...childProps} dispatch={dispatch} />
                );
            }
        }
    );

    const dispatchableModifier = withBemMod<IComponentProps>(cn(), {}, dispatchable);

    return compose(dispatchableModifier)(WrappedComponent);
}
