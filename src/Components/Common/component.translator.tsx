import React, { ComponentType, PureComponent } from "react";
import { ReactReduxContext } from "react-redux";
import { Action, AnyAction, Dispatch, Reducer, Store, Unsubscribe } from "redux";

import { compose, IClassNameProps, Wrapper } from "@bem-react/core";

import { Actions } from "./actions";
import { buildStore, configureDispatch } from "./configuration";
import { getDisplayName, getMemoizeProps, getStateDiff } from "./helpers";
import { buildReducer } from "./reducer";
import { IAnyProps, IDispatchProps } from "./types";

export const DispatchContext = React.createContext(<T extends Action = AnyAction>(action: T) => action);

export function buildStatefulComponent<T extends IClassNameProps>(
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

            private tryMergeProps() {
                const { state } = getMemoizeProps(this.props, this.watchKeys);

                const stateDiff = getStateDiff(this.state.getState(), state);

                if (stateDiff) {
                    this.state.dispatch(Actions.merge(stateDiff));
                }
            }

            componentDidMount() {
                this.watchKeys = Object.keys(this.state.getState());

                this.unsubscribeStoreChanges = this.state.subscribe(this.forceUpdate.bind(this));

                this.tryMergeProps();
            }

            componentDidUpdate() {
                this.tryMergeProps();
            }

            componentWillUnmount() {
                if (this.unsubscribeStoreChanges) {
                    this.unsubscribeStoreChanges();
                }
            }

            render() {
                const { events } = getMemoizeProps(this.props, this.watchKeys);

                return (
                    <DispatchContext.Provider value={this.state.dispatch}>
                        <NestedWrappedComponent {...events} {...this.state.getState()} />
                    </DispatchContext.Provider>
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
                        `Could not find "store" in the context of "${
                            getDisplayName(NestedWrappedComponent)
                        }". Wrap the root component in a <Provider>.`
                    );
                }

                this.setState({ dispatch: configureDispatch(this.context, this.props.dispatch) });
            }

            render() {
                const { dispatch } = this.state;
                const { cid, useGlobalStore, ...props } = this.props;

                return (
                    <DispatchContext.Provider value={dispatch}>
                        {React.createElement(NestedWrappedComponent, props)}
                    </DispatchContext.Provider>
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
                return React.createElement(this.baseComponent, this.props);
            }
        }
    );

    return compose(baseComponentSelector)(WrappedComponent);
}
