import { Dispatch } from "redux";

import { IClassNameProps } from "../../bem/contracts";

export interface IDispatchProps extends IClassNameProps {
    useGlobalStore?: boolean;
    cid?: string;
    dispatch?: Dispatch;
}
