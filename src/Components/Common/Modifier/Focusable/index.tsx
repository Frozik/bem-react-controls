import classnames from "classnames";
import React, { ComponentType, EventHandler, PureComponent, SyntheticEvent } from "react";
import { Dispatch } from "redux";

import { ComponentName } from "../../../../bem/component-name";
import { IClassNameProps } from "../../../../bem/contracts";
import { Enhancer } from "../../../../bem/enhancer";
import { DispatchContext, propagateSourceEvent } from "../../modifier.helper";
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

export const focusableModifierBuilder = (componentName: ComponentName): Enhancer<IFocusableProps> =>
    (WrappedEntity: ComponentType<any>) => (
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

            private readonly onFocusEventHandler = propagateSourceEvent(this.onFocus, this.props.onFocus);

            private readonly onBlurEventHandler = propagateSourceEvent(this.onBlur, this.props.onFocus);

            render() {
                const { className, focused } = this.props;

                return (
                    <WrappedEntity
                        {...this.props}
                        onFocus={this.onFocusEventHandler}
                        onBlur={this.onBlurEventHandler}
                        className={classnames(className, componentName({ focused }) as string)}
                    />
                );
            }
        }
    );
