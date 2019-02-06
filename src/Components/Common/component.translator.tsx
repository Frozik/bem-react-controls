import React, { ComponentType, PureComponent } from "react";
import { ReactReduxContext, ReactReduxContextValue } from "react-redux";
import {
    applyMiddleware, compose as reduxCompose, createStore, Dispatch, Middleware, Reducer, Store,
    Unsubscribe
} from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";

import { ClassNameFormatter } from "@bem-react/classname";
import { compose, Enhance, IClassNameProps, withBemMod } from "@bem-react/core";

export interface IComponentProps extends IClassNameProps {
    cid?: string;
    useGlobalStore?: boolean;
}

function getMiddleWares(useStoreLogging?: boolean): Middleware[] {
    const middlewares: Middleware[] = [thunk];

    if (!useStoreLogging && process.env.NODE_ENV !== "production") {
        middlewares.push(logger);
    }

    return middlewares;
}

function buildStore(componentReducer: Reducer): Store {
    return createStore(
        componentReducer,
        applyMiddleware(...getMiddleWares()),
    );
}

function configureDispatch({ store }: ReactReduxContextValue): Dispatch {
    const middlewares = getMiddleWares(true);

    let dispatchGuard = () => {
        throw new Error(
          `Dispatching while constructing your middleware is not allowed. ` +
            `Other middleware would not be applied to this dispatch.`
        );
    };

    const middlewareAPI = {
        getState: store.getState,
        dispatch: () => dispatchGuard(),
    };

    const chain = middlewares.map(middleware => middleware(middlewareAPI));

    return reduxCompose(...chain)(store.dispatch) as Dispatch;
}

// todo: Add possibility to take CID
// todo: when props changes we must dispatch to store if we has local store

export function buildStatefulComponent<T extends IClassNameProps>(
    cn: ClassNameFormatter,
    WrappedComponent: ComponentType<T>,
    componentReducer: Reducer,
) {
    const dispatchable:Enhance<IComponentProps> = (NestedWrappedComponent) => (
        class extends PureComponent<IComponentProps, Store> {
            constructor(props: IComponentProps) {
                super(props);

                if (!props.useGlobalStore) {
                    this.state = buildStore(componentReducer);
                }
            }

            static contextType = ReactReduxContext;
            private unsubscribeStoreChanges: Unsubscribe | undefined;
            private dispatch: Dispatch | undefined;

            componentWillMount() {
                if (this.state) {
                    this.dispatch = this.state.dispatch;

                    return;
                }

                if (!this.context) {
                    throw new Error("Redux Store is not provided");
                }

                this.dispatch = configureDispatch(this.context as ReactReduxContextValue);
            }

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
                const { cid, useGlobalStore, ...props} = this.state ? this.state.getState() : this.props;

                return (
                    <NestedWrappedComponent {...props} dispatch={this.dispatch} />
                );
            }
        }
    );

    const dispatchableModifier = withBemMod<IComponentProps>(cn(), {}, dispatchable);

    return compose(dispatchableModifier)(WrappedComponent);
}
