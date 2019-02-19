import React, { ComponentType, EventHandler, PureComponent, SyntheticEvent } from "react";
import { Dispatch } from "redux";

import { DispatchContext, IClassNameProps } from "../../../bem/contracts";
import { Enhancer, buildConditionalEnhancer, RemoveModifier } from "../../../bem/enhancer";
import { propagateDomEvent } from "../../../bem/modifier.helper";
import { Actions } from "./actions";
import { ComponentName } from "../../../bem/component-name";

interface IHelperProps {
    onChange?: EventHandler<SyntheticEvent>;
}

export * from "./actions";

export interface IValueProps extends IClassNameProps {
    value?: string;
    onValueChanged?: (string: string) => void;
}

const valueEnhancer: Enhancer<IValueProps> = (WrappedEntity: ComponentType<any>) => (
    class ValueModifier extends PureComponent<IValueProps & IHelperProps> {
        static contextType = DispatchContext;

        private static onValueChangedHandler(
            value: string,
            dispatch: Dispatch,
            onValueChanged?: (value: string) => void,
        ) {
            if (onValueChanged) {
                onValueChanged(value);
            }

            dispatch(Actions.changeValue(value));
        }

        private readonly onValueChanged = (eventArgs: SyntheticEvent) => ValueModifier.onValueChangedHandler(
            (eventArgs.target as HTMLInputElement).value || "",
            this.context,
            this.props.onValueChanged,
        )

        private readonly onChangeEventHandler = propagateDomEvent(this.onValueChanged, this.props.onChange);

        render() {
            return (
                <WrappedEntity
                    {...this.props}
                    onChange={this.onChangeEventHandler}
                />
            );
        }
    }
);

export const valueModifierBuilder = (componentName: ComponentName): Enhancer<IValueProps> =>
        buildConditionalEnhancer(
            componentName,
            valueEnhancer,
            { onValueChanged: RemoveModifier },
        );
