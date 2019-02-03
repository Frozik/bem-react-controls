import React, { Component, ComponentType } from "react";
import { AnyAction, Dispatch, Reducer } from "redux";

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
        class extends Component<IOptionalDispatchProps> {
            constructor(props: IOptionalDispatchProps) {
                super(props);

                this.state = componentReducer(undefined, { type: "[component] DUMMY_ACTION" });
            }

            dispatch: Dispatch = <T extends AnyAction>(action: T) => {
                this.setState((originalState) => {
                    const previousState = originalState || undefined;

                    console.groupCollapsed("STATE CHANGED");

                    console.group("PREVIOUS STATE");
                    console.log(previousState);
                    console.groupEnd();

                    const nextState = componentReducer(previousState, action);

                    console.group("NEXT STATE");
                    console.log(nextState);
                    console.groupEnd();

                    console.groupEnd();

                    return nextState;
                });

                return action;
            }

            render() {
                return (
                    <NestedWrappedComponent {...this.state} {...this.props} dispatch={this.dispatch} />
                );
            }
        }
    );

    const dispatchableModifier = withBemMod<IOptionalDispatchProps>(cn(), {}, dispatchable);

    return compose(dispatchableModifier)(WrappedComponent);
}
