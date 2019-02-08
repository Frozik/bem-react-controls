import React, { ComponentType, EventHandler, MouseEvent, PureComponent } from "react";
import { Dispatch } from "redux";

import { ClassNameFormatter } from "@bem-react/classname";
import { classnames } from "@bem-react/classnames";
import { IClassNameProps, Wrapper } from "@bem-react/core";

import { DispatchContext } from "../../component.translator";
import { Actions } from "./actions";

enum FocusState {
    Focused,
    Normal,
}

interface IHelperProps {
    onFocus?: EventHandler<MouseEvent>;
    onBlur?: EventHandler<MouseEvent>;
}

export * from "./actions";

export interface IFocusableProps extends IClassNameProps {
    focused?: boolean;
    onFocusChanged?: (hasFocus: boolean) => void;
}

export function focusableModifierBuilder(cn: ClassNameFormatter): Wrapper<IFocusableProps> {
    return (WrappedEntity: ComponentType<IFocusableProps & IHelperProps>) => (
        class FocusableModifier extends PureComponent<IFocusableProps & IHelperProps> {
            static contextType = DispatchContext;

            private static onFocusChangedHandler(
                focusState: FocusState,
                eventArgs: MouseEvent,
                dispatch: Dispatch,
                onFocusChanged?: (hasFocus: boolean) => void,
                originalEventHandler?: EventHandler<MouseEvent>,
            ) {
                eventArgs.stopPropagation();

                if (onFocusChanged) {
                    onFocusChanged(focusState === FocusState.Focused);
                }

                if (originalEventHandler) {
                    originalEventHandler(eventArgs);
                }

                dispatch(Actions.changeFocus(focusState === FocusState.Focused));
            }

            private readonly onFocusEventHandler = (eventArgs: MouseEvent) => FocusableModifier.onFocusChangedHandler(
                FocusState.Focused,
                eventArgs,
                this.context,
                this.props.onFocusChanged,
                this.props.onFocus
            )

            private readonly onBlurEventHandler = (eventArgs: MouseEvent) => FocusableModifier.onFocusChangedHandler(
                FocusState.Focused,
                eventArgs,
                this.context,
                this.props.onFocusChanged,
                this.props.onBlur
            )

            render() {
                const { className, focused, onFocusChanged, ...rest } = this.props;

                return (
                    <WrappedEntity
                        {...rest}
                        onFocus={this.onFocusEventHandler}
                        onBlur={this.onBlurEventHandler}
                        className={classnames(className, cn({ focused }))}
                    />
                );
            }
        }
    );
}
