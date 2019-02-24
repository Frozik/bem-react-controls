import { IClassNameProps } from "../../../bem/contracts";
import { buildConditionalEnhancer, MatchAny } from "../../../bem/enhancer";

export interface ITestProps extends IClassNameProps {
    "empty-body"?: string;
}

export const emptyBodyModifier = buildConditionalEnhancer<ITestProps>(
    { "empty-body": MatchAny },
);
