import React, { ComponentType, EventHandler, PureComponent, SyntheticEvent } from "react";
import { Dispatch } from "redux";

import { IClassNameProps } from "../../../../bem/contracts";
import { Enhancer } from "../../../../bem/enhancer";
import { DispatchContext, propagateSourceEvent } from "../../modifier.helper";
import { Actions } from "./actions";

interface IHelperProps {
    onChange?: EventHandler<SyntheticEvent>;
}

export * from "./actions";

export interface IValueProps extends IClassNameProps {
    value?: string;
    onValueChanged?: (string: string) => void;
}

export const valueModifierBuilder = (): Enhancer<IValueProps> =>
    (WrappedEntity: ComponentType<any>) => (
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

            private readonly onChangeEventHandler = propagateSourceEvent(this.onValueChanged, this.props.onChange);

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
