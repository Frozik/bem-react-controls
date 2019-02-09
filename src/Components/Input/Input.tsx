import React, { FunctionComponent } from "react";

import { cn } from "@bem-react/classname";

export const cnInput = cn("Input");

export const Input: FunctionComponent = (props) => (
    React.createElement("input", props)
);
