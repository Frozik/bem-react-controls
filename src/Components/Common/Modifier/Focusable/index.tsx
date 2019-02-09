import React, { ComponentType, EventHandler, PureComponent, SyntheticEvent } from "react";
import { Dispatch } from "redux";

import { ClassNameFormatter } from "@bem-react/classname";
import { classnames } from "@bem-react/classnames";
import { IClassNameProps, Wrapper } from "@bem-react/core";

import { DispatchContext } from "../../component.translator";
import { cleanProps, propagateSourceEvent } from "../../props.helper";
import { Actions } from "./actions";

enum FocusState {
    Focused,
    Normal,
}

interface IHelperProps {
    onFocus?: EventHandler<SyntheticEvent>;
    onBlur?: EventHandler<SyntheticEvent>;
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
                dispatch: Dispatch,
                onFocusChanged?: (hasFocus: boolean) => void,
            ) {
                if (onFocusChanged) {
                    onFocusChanged(focusState === FocusState.Focused);
                }

                dispatch(Actions.changeFocus(focusState === FocusState.Focused));
            }

            private readonly onFocus = () => FocusableModifier.onFocusChangedHandler(
                FocusState.Focused,
                this.context,
                this.props.onFocusChanged,
            )

            private readonly onBlur = () => FocusableModifier.onFocusChangedHandler(
                FocusState.Normal,
                this.context,
                this.props.onFocusChanged,
            )

            private readonly onFocusEventHandler = propagateSourceEvent(this.onFocus, this.props.onFocus);

            private readonly onBlurEventHandler = propagateSourceEvent(this.onBlur, this.props.onFocus);

            render() {
                const { className, focused } = this.props;
                const cleanedProps = cleanProps(this.props, ["focused", "onFocusChanged"]);

                return (
                    <WrappedEntity
                        {...cleanedProps}
                        onFocus={this.onFocusEventHandler}
                        onBlur={this.onBlurEventHandler}
                        className={classnames(className, cn({ focused }))}
                    />
                );
            }
        }
    );
}
