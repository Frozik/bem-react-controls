import React, { ComponentType, PureComponent } from "react";
import { ReactReduxContext, ReactReduxContextValue } from "react-redux";
import {
    Action, AnyAction, applyMiddleware, compose as reduxCompose, createStore, Dispatch, Middleware,
    Reducer, Store, Unsubscribe
} from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";

import { ClassNameFormatter } from "@bem-react/classname";
import { compose, IClassNameProps, Wrapper } from "@bem-react/core";

import { Actions } from "./actions";
import { buildReducer } from "./reducer";

export interface IComponentProps extends IClassNameProps {
}

export interface IDispatchProps extends IComponentProps {
    useGlobalStore?: boolean;
    cid?: string;
    dispatch?: Dispatch;
}

export interface IAnyProps {
    [key: string]: any;
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

function getStateDiff(
    previousProps?: { [key: string]: any },
    props?: { [key: string]: any },
    watchKeys?: string[],
): { [key: string]: any } | undefined {
    let diff = undefined;

    if (!props || !watchKeys || !watchKeys.length) {
        return diff;
    }

    return watchKeys.reduce(
        (accumulator: { [key: string]: any } | undefined, key) => {
            if (!props.hasOwnProperty(key)) {
                return accumulator;
            }

            const newValue = props[key];

            if (previousProps && previousProps[key] === newValue) {
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

function configureDispatch({ store }: ReactReduxContextValue, propsDispatch?: Dispatch): Dispatch {
    const middlewares = getMiddleWares(true);

    if (!middlewares.length) {
        return propsDispatch || store.dispatch;
    }

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

    return reduxCompose(...chain)(propsDispatch || store.dispatch) as Dispatch;
}

export function buildStatefulComponent<T extends IClassNameProps>(
    cn: ClassNameFormatter,
    WrappedComponent: ComponentType<T>,
    componentReducer: Reducer,
) {
    const internalStorageEnhancer: Wrapper<IDispatchProps> = ((NestedWrappedComponent: ComponentType<IAnyProps>) => (
        class extends PureComponent<IDispatchProps, Store> {
            constructor(props: IDispatchProps) {
                super(props);

                this.state = buildStore(buildReducer(componentReducer));
            }

            private watchKeys?: string[];
            private unsubscribeStoreChanges: Unsubscribe | undefined;

            componentDidMount() {
                this.watchKeys = Object.keys(this.state.getState());

                this.unsubscribeStoreChanges = this.state.subscribe(this.forceUpdate.bind(this));
            }

            componentDidUpdate(previousProps: IDispatchProps) {
                const stateDiff = getStateDiff(previousProps, this.props, this.watchKeys);

                if (stateDiff) {
                    this.state.dispatch(Actions.merge(stateDiff));
                }
            }

            componentWillUnmount() {
                if (this.unsubscribeStoreChanges) {
                    this.unsubscribeStoreChanges();
                }
            }

            render() {
                return (
                    <NestedWrappedComponent {...this.state.getState()} dispatch={this.state.dispatch} />
                );
            }
        }
    ));

    const externalStorageEnhancer: Wrapper<IDispatchProps> = (NestedWrappedComponent: ComponentType<IAnyProps>) => (
        class extends PureComponent<IDispatchProps, { dispatch: Dispatch }> {
            constructor(props: IDispatchProps) {
                super(props);

                this.state = { dispatch: <T extends Action = AnyAction>(action: T) => action };
            }

            static contextType = ReactReduxContext;

            componentDidMount() {
                if (!this.context) {
                    throw new Error(
                        `Could not find "store" in the context of "${cn()}". Wrap the root component in a <Provider>.`
                    );
                }

                this.setState({
                    dispatch: configureDispatch(this.context as ReactReduxContextValue, this.props.dispatch),
                });
            }

            render() {
                const { dispatch } = this.state;
                const { cid, useGlobalStore, ...props } = this.props;

                return (
                    <NestedWrappedComponent {...props} dispatch={dispatch} />
                );
            }
        }
    );

    const baseComponentSelector: Wrapper<IDispatchProps> = (NestedWrappedComponent: ComponentType) => (
        class extends PureComponent<IDispatchProps> {
            constructor(props: IDispatchProps) {
                super(props);

                const { useGlobalStore = false } = props;

                this.baseComponent = useGlobalStore
                    ? externalStorageEnhancer(NestedWrappedComponent)
                    : internalStorageEnhancer(NestedWrappedComponent);
            }

            private readonly baseComponent: ComponentType<IDispatchProps>;

            render() {
                return (
                    <this.baseComponent {...this.props} />
                );
            }
        }
    );

    return compose(baseComponentSelector)(WrappedComponent);
}
