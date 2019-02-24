import { combineReducers } from "redux";

import { ActionsUnion } from "../../bem/action.helper";
import { componentName } from "../../bem/component-name";
import { wrapToStatefulComponent } from "../../bem/component.wrapper";
import { compose } from "../../bem/compose";
import { emptyBodyModifier } from "../modifiers/empty-body";
import { Actions as FocusableActions, focusableModifier } from "../modifiers/focusable";
import { focused } from "../modifiers/focusable/reducer";
import { valueModifier } from "../modifiers/value";
import { Actions as ValueActions } from "../modifiers/value/actions";
import { value } from "../modifiers/value/reducer";
import { InputComponent } from "./root";

const InputStatelessComponent = compose(
    InputComponent,
    focusableModifier,
    valueModifier,
    emptyBodyModifier,
);

export const inputActions = {
    ...FocusableActions,
    ...ValueActions,
};

export type inputActions = ActionsUnion<typeof inputActions>;

export const inputReducer = combineReducers({
    value,
    focused,
});

export const Input = wrapToStatefulComponent(
    componentName("input"),
    InputStatelessComponent,
    inputReducer,
);
