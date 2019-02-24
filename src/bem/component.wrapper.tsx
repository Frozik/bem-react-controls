import classnames from "classnames";
import React, { ComponentType, PureComponent } from "react";
import { Reducer } from "redux";

import { ComponentName } from "./component-name";
import { compose } from "./compose";
import { ComponentNameContext, IClassNameProps, IDispatchProps } from "./contracts";
import { Enhancer } from "./enhancer";
import { buildExternalStorageEnhancer } from "./external-storage-enhancer";
import { buildInternalStorageEnhancer } from "./internal-storage-enhancer";
import { buildStore } from "./redux.configuration";
import { mergePropsReducer } from "./reducers";

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

                if (useGlobalStore) {
                    this.baseComponent = buildExternalStorageEnhancer()(NestedWrappedComponent);
                } else {
                    const store = buildStore(mergePropsReducer(componentReducer));

                    this.baseComponent = buildInternalStorageEnhancer(store)(NestedWrappedComponent);
                }
            }

            private readonly baseComponent: ComponentType<IDispatchProps>;

            render() {
                return (
                    <ComponentNameContext.Provider value={ componentName }>
                        <this.baseComponent
                            { ...this.props }
                            className={ classnames(this.props.className, componentName.toString()) }
                        />
                    </ComponentNameContext.Provider>
                );
            }
        }
    );

    return compose(WrappedComponent, baseComponentSelector);
}
