import React, { ComponentType, PureComponent } from "react";
import { ReactReduxContext } from "react-redux";
import { Action, AnyAction, Dispatch, Reducer, Store, Unsubscribe } from "redux";

import { Actions } from "./actions";
import { buildStore, configureDispatch } from "./configuration";
import { DispatchContext, IDispatchProps } from "./contracts";
import { Enhancer } from "./enhancer";
import { mergePropsReducer } from "./reducers";
import { getDisplayName, getMemoizePropsBuilder, getStateDiff } from "./wrapper.helpers";

export const buildInternalStorageEnhancer = (componentReducer: Reducer): Enhancer<IDispatchProps> =>
    (NestedWrappedComponent: ComponentType<any>) => (
        class extends PureComponent<IDispatchProps, Store> {
            constructor(props: IDispatchProps) {
                super(props);

                this.state = buildStore(mergePropsReducer(componentReducer));
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

export const buildExternalStorageEnhancer = (): Enhancer<IDispatchProps> =>
    (NestedWrappedComponent: ComponentType<any>) => (
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
