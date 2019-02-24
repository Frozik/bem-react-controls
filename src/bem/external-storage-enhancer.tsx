import React, { ComponentType, PureComponent } from "react";
import { ReactReduxContext } from "react-redux";
import { Action, AnyAction, Dispatch } from "redux";

import { DispatchContext, IDispatchProps } from "./contracts";
import { Enhancer } from "./enhancer";
import { configureDispatch } from "./redux.configuration";

function getDisplayName(WrappedComponent: any) {
    return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export const buildExternalStorageEnhancer = (): Enhancer<IDispatchProps> =>
    (NestedWrappedComponent: ComponentType<any>) => (
        class extends PureComponent<IDispatchProps, { dispatch: Dispatch }> {
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
                if (!this.state) {
                    return null;
                }

                const { dispatch } = this.state;

                const { cid, useGlobalStore, ...props } = this.props;

                return (
                    <DispatchContext.Provider value={ dispatch }>
                        { React.createElement(NestedWrappedComponent, props) }
                    </DispatchContext.Provider>
                );
            }
        }
    );
