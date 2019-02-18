import classnames from "classnames";
import React, { ComponentType, PureComponent } from "react";
import { Reducer } from "redux";

import { ComponentName } from "../../bem/component-name";
import { compose } from "../../bem/compose";
import { IClassNameProps } from "../../bem/contracts";
import { Enhancer } from "../../bem/enhancer";
import { IDispatchProps } from "./contracts";
import { buildExternalStorageEnhancer, buildInternalStorageEnhancer } from "./wrappers.builders";

export function wrapToStatefulComponent<T extends IClassNameProps>(
    componentName: ComponentName,
    WrappedComponent: ComponentType<T>,
    componentReducer: Reducer,
) {
    const baseComponentSelector: Enhancer<IDispatchProps> = (NestedWrappedComponent: ComponentType) => (
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
                return <this.baseComponent {...this.props} className={classnames(this.props.className, componentName.toString())} />;
            }
        }
    );

    return compose(WrappedComponent, baseComponentSelector);
}
