import React, { ComponentType, EventHandler, PureComponent, SyntheticEvent } from "react";
import { Dispatch } from "redux";

import { ComponentName } from "../../../bem/component-name";
import { DispatchContext, IClassNameProps } from "../../../bem/contracts";
import {
    buildConditionalEnhancer, Enhancer, RemoveModifier, SkipMatch
} from "../../../bem/enhancer";
import { propagateDomEvent } from "../../modifier.helper";
import { Actions } from "./actions";

enum FocusState {
    Focused,
    Normal,
}

interface IHelperProps {
    onFocus?: EventHandler<SyntheticEvent>;
    onBlur?: EventHandler<SyntheticEvent>;
}

export * from "./actions";

export interface IFocusableProps extends IClassNameProps {
    focused?: boolean;
    onFocusChanged?: (hasFocus: boolean) => void;
}

const focusableEnhancer: Enhancer<IFocusableProps> = (WrappedEntity: ComponentType<any>) => (
    class FocusableModifier extends PureComponent<IFocusableProps & IHelperProps> {
        static contextType = DispatchContext;

        private static onFocusChangedHandler(
            focusState: FocusState,
            dispatch: Dispatch,
            onFocusChanged?: (hasFocus: boolean) => void,
        ) {
            if (onFocusChanged) {
                onFocusChanged(focusState === FocusState.Focused);
            }

            dispatch(Actions.changeFocus(focusState === FocusState.Focused));
        }

        private readonly onFocus = () => FocusableModifier.onFocusChangedHandler(
            FocusState.Focused,
            this.context,
            this.props.onFocusChanged,
        )

        private readonly onBlur = () => FocusableModifier.onFocusChangedHandler(
            FocusState.Normal,
            this.context,
            this.props.onFocusChanged,
        )

        private readonly onFocusEventHandler = propagateDomEvent(this.onFocus, this.props.onFocus);

        private readonly onBlurEventHandler = propagateDomEvent(this.onBlur, this.props.onFocus);

        render() {
            return (
                <WrappedEntity
                    {...this.props}
                    onFocus={this.onFocusEventHandler}
                    onBlur={this.onBlurEventHandler}
                />
            );
        }
    }
);

export const focusableModifier = buildConditionalEnhancer(
    focusableEnhancer,
    {
        focused: SkipMatch,
        onFocusChanged: RemoveModifier,
    },
);
