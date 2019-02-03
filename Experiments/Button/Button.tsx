import React, { FunctionComponent } from "react";
import { cn } from "@bem-react/classname";
import { IClassNameProps } from "@bem-react/core";

export interface IButtonProps extends IClassNameProps {
  text?: string;
}

export const button = cn("Button");

export const Button: FunctionComponent<IButtonProps> = ({ children, text, className }) => (
  <div className={button({}, [className])}>{children || text}</div>
);
