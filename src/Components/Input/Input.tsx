import React, { FunctionComponent, SyntheticEvent } from "react";
import { Dispatch } from "redux";

import { cn } from "@bem-react/classname";
import { IClassNameProps } from "@bem-react/core";

import { DispatchContext } from "../Common/component.translator";
import { Actions } from "./actions";

export interface IInputProps extends IClassNameProps {
  value?: string;
  onChange?: (string: string) => void;
}

function onChangeHandler(
  eventArgs: SyntheticEvent,
  dispatch: Dispatch,
  onChange?: (string: string) => void,
) {
    const value = (eventArgs.target as HTMLInputElement).value || "";

    if (onChange) {
        onChange(value);
    }

    dispatch(Actions.changeValue(value));

    eventArgs.stopPropagation();
}

export const cnInput = cn("Input");

export const Input: FunctionComponent<IInputProps> = ({ className, onChange, ...props }) => (
    <DispatchContext.Consumer>
        {(dispatch) => (
            <input
                {...props}
                onChange={(eventArgs: SyntheticEvent) => onChangeHandler(eventArgs, dispatch, onChange)}
                className={cnInput({}, [className])}
            />
        )}
    </DispatchContext.Consumer>
);
