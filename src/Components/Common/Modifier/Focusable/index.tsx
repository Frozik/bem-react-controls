import React, { ComponentType, EventHandler, MouseEvent } from "react";

import { ClassNameFormatter } from "@bem-react/classname";
import { classnames } from "@bem-react/classnames";
import { Enhance, IClassNameProps, withBemMod } from "@bem-react/core";

import { Actions } from "./actions";

export * from "./actions";

export interface IFocusableProps extends IClassNameProps {
    focused?: boolean;
    onFocusChanged?: (hasFocus: boolean) => void;
}

export function focusableModifierBuilder(cn: ClassNameFormatter) {
    const Focusable:Enhance<IFocusableProps> = (WrappedEntity: ComponentType<IFocusableProps & IHelperProps>) =>
        ({ onFocusChanged, focused, className, ...props }) => (
            <WrappedEntity
                {...props}
                onFocus={(eventArgs: MouseEvent) => onFocusChangedHandler("onFocus", eventArgs, props, onFocusChanged )}
                onBlur={(eventArgs: MouseEvent) => onFocusChangedHandler("onBlur", eventArgs, props, onFocusChanged )}
                className={classnames(className, cn({ focused }))}
            />
        );

    interface IHelperProps {
        onFocus?: EventHandler<MouseEvent>;
        onBlur?: EventHandler<MouseEvent>;
    }

    function onFocusChangedHandler(
        event: "onFocus" | "onBlur",
        eventArgs: MouseEvent,
        props: { [prop: string]: any },
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

        props.dispatch(Actions.changeFocus(hasFocus));

        eventArgs.stopPropagation();
    }

    return withBemMod<IFocusableProps>(cn(), { }, Focusable);
}
