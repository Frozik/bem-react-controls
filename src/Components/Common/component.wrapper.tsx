import React, { ComponentType, PureComponent } from "react";
import { Reducer } from "redux";

import { compose, IClassNameProps, Wrapper } from "@bem-react/core";

import { IDispatchProps } from "./contracts";
import { buildExternalStorageEnhancer, buildInternalStorageEnhancer } from "./wrappers-builder";

export function wrapToStatefulComponent<T extends IClassNameProps>(
    WrappedComponent: ComponentType<T>,
    componentReducer: Reducer,
) {
    const baseComponentSelector: Wrapper<IDispatchProps> = (NestedWrappedComponent: ComponentType) => (
        class extends PureComponent<IDispatchProps> {
            constructor(props: IDispatchProps) {
                super(props);

                const { useGlobalStore = false } = props;

                this.baseComponent = useGlobalStore
                    ? buildExternalStorageEnhancer()(NestedWrappedComponent)
                    : buildInternalStorageEnhancer(componentReducer)(NestedWrappedComponent);
            }

            private readonly baseComponent: ComponentType<IDispatchProps>;

            render() {
                return React.createElement(this.baseComponent, this.props);
            }
        }
    );

    return compose(baseComponentSelector)(WrappedComponent);
}
