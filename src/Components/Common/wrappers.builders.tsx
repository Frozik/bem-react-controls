import React, { ComponentType, PureComponent } from "react";
import { ReactReduxContext } from "react-redux";
import { Action, AnyAction, Dispatch, Reducer, Store, Unsubscribe } from "redux";

import { Wrapper } from "@bem-react/core";

import { Actions } from "./actions";
import { buildStore, configureDispatch } from "./configuration";
import { IAnyProps, IDispatchProps } from "./contracts";
import { DispatchContext } from "./modifier.helper";
import { buildReducer } from "./reducer";
import { getDisplayName, getMemoizePropsBuilder, getStateDiff } from "./wrapper.helpers";

export const buildInternalStorageEnhancer = (componentReducer: Reducer): Wrapper<IDispatchProps> =>
    (NestedWrappedComponent: ComponentType<IAnyProps>) => (
        class extends PureComponent<IDispatchProps, Store> {
            constructor(props: IDispatchProps) {
                super(props);

                this.state = buildStore(buildReducer(componentReducer));
            }

            private readonly getMemoizeProps = getMemoizePropsBuilder();
            private watchKeys?: string[];
            private unsubscribeStoreChanges: Unsubscribe | undefined;

            private tryMergeProps() {
                const { state } = this.getMemoizeProps(this.props, this.watchKeys);

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
                const { events } = this.getMemoizeProps(this.props, this.watchKeys);

                return (
                    <DispatchContext.Provider value={this.state.dispatch}>
                        <NestedWrappedComponent {...events} {...this.state.getState()} />
                    </DispatchContext.Provider>
                );
            }
        }
    );

export const buildExternalStorageEnhancer = (): Wrapper<IDispatchProps> =>
    (NestedWrappedComponent: ComponentType<IAnyProps>) => (
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
