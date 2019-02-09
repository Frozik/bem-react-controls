import React, { ComponentType, EventHandler, PureComponent, SyntheticEvent } from "react";
import { Dispatch } from "redux";

import { IClassNameProps, Wrapper } from "@bem-react/core";

import { cleanProps, DispatchContext, propagateSourceEvent } from "../../modifier.helper";
import { Actions } from "./actions";

interface IHelperProps {
    onChange?: EventHandler<SyntheticEvent>;
}

export * from "./actions";

export interface IValueProps extends IClassNameProps {
    value?: string;
    onValueChanged?: (string: string) => void;
}

export const valueModifierBuilder = (): Wrapper<IValueProps> =>
    (WrappedEntity: ComponentType<IValueProps & IHelperProps>) => (
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
                const cleanedProps = cleanProps(this.props, ["onValueChanged"]);

                return (
                    <WrappedEntity
                        {...cleanedProps}
                        onChange={this.onChangeEventHandler}
                    />
                );
            }
        }
    );
