import React, { FunctionComponent } from "react";
import { withBemMod, Enhance } from "@bem-react/core";
import { button, IButtonProps } from "./../Button";

export interface IButtonTypeLinkProps {
    type?: "link";
}

const ButtonLink:Enhance<IButtonProps & IButtonTypeLinkProps> = (WrappedEntity) => ({ text }) => (
    <WrappedEntity>
        <a className={button()}>{text}</a>
    </WrappedEntity>
);

export const ButtonTypeLink = withBemMod<IButtonTypeLinkProps>(button(), { type: "link" }, ButtonLink);
