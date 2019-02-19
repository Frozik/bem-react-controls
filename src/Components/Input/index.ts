import { combineReducers } from "redux";

import { ActionsUnion } from "../../bem/action.helper";
import { wrapToStatefulComponent } from "../../bem/component.wrapper";
import { compose } from "../../bem/compose";
import { Actions as FocusableActions, focusableModifierBuilder } from "../modifiers/focusable";
import { focused } from "../modifiers/focusable/reducer";
import { valueModifierBuilder } from "../modifiers/value";
import { Actions as ValueActions } from "../modifiers/value/actions";
import { value } from "../modifiers/value/reducer";
import { cnInput } from "./name";
import { InputComponent } from "./root";

const InputStatelessComponent = compose(
    InputComponent,
    focusableModifierBuilder(cnInput),
    valueModifierBuilder(cnInput),
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

export const Input = wrapToStatefulComponent(cnInput, InputStatelessComponent, inputReducer);
