import React, { ComponentType, EventHandler, MouseEvent } from "react";
import { Dispatch } from "redux";

import { ClassNameFormatter } from "@bem-react/classname";
import { classnames } from "@bem-react/classnames";
import { Enhance, IClassNameProps, withBemMod } from "@bem-react/core";

import { DispatchContext } from "../../component.translator";
import { Actions } from "./actions";

export * from "./actions";

export interface IFocusableProps extends IClassNameProps {
    focused?: boolean;
    onFocusChanged?: (hasFocus: boolean) => void;
}

function onFocusChangedHandler(
    event: "onFocus" | "onBlur",
    eventArgs: MouseEvent,
    props: { [prop: string]: any },
    dispatch: Dispatch,
    onFocusChanged?: (hasFocus: boolean) => void,
) {
    const hasFocus = event === "onFocus";

    if (onFocusChanged) {
        onFocusChanged(hasFocus);
    }

    const originalEventHandler: EventHandler<MouseEvent> | undefined = props[event];

    if (originalEventHandler) {
        originalEventHandler(eventArgs);
    }

    dispatch(Actions.changeFocus(hasFocus));

    eventArgs.stopPropagation();
}

export function focusableModifierBuilder(cn: ClassNameFormatter) {
    const Focusable:Enhance<IFocusableProps> = (WrappedEntity: ComponentType<IFocusableProps & IHelperProps>) =>
        ({ onFocusChanged, focused, className, ...props }) => (
            <DispatchContext.Consumer>
                {(dispatch) => (
                    <WrappedEntity
                        {...props}
                        onFocus={(eventArgs: MouseEvent) => onFocusChangedHandler("onFocus", eventArgs, props, dispatch, onFocusChanged )}
                        onBlur={(eventArgs: MouseEvent) => onFocusChangedHandler("onBlur", eventArgs, props, dispatch, onFocusChanged )}
                        className={classnames(className, cn({ focused }))}
                    />
                )}
            </DispatchContext.Consumer>
        );

    interface IHelperProps {
        onFocus?: EventHandler<MouseEvent>;
        onBlur?: EventHandler<MouseEvent>;
    }

    return withBemMod<IFocusableProps>(cn(), { }, Focusable);
}
