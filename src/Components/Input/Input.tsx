import React, { FunctionComponent, SyntheticEvent } from "react";

import { cn } from "@bem-react/classname";
import { IClassNameProps } from "@bem-react/core";

import { IOptionalDispatchProps } from "../Common/component.translator";
import { Actions } from "./actions";

export interface IInputProps extends IClassNameProps {
  value?: string;
  onChange?: (string: string) => void;
}

function onChangeHandler(
  eventArgs: SyntheticEvent,
  props: { [prop: string]: any },
  onChange?: (string: string) => void,
) {
    const value = (eventArgs.target as HTMLInputElement).value || "";

    if (onChange) {
        onChange(value);
    }

    props.dispatch(Actions.changeValue(value));

    eventArgs.stopPropagation();
}

export const cnInput = cn("Input");

export const Input: FunctionComponent<IInputProps & IOptionalDispatchProps> = ({ dispatch, className, onChange, ...props }) => (
    <input
        {...props}
        onChange={(eventArgs: SyntheticEvent) => onChangeHandler(eventArgs, { dispatch, ...props }, onChange)}
        className={cnInput({}, [className])}
    />
);
