import { Dispatch } from "redux";

import { IClassNameProps } from "@bem-react/core";

export interface IDispatchProps extends IClassNameProps {
    useGlobalStore?: boolean;
    cid?: string;
    dispatch?: Dispatch;
}

export interface IAnyProps {
    [key: string]: any;
}
