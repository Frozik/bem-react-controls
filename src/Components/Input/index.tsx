import { combineReducers } from "redux";

import { compose } from "../../bem/compose";
import { ActionsUnion } from "../common/action.helper";
import { wrapToStatefulComponent } from "../common/component.wrapper";
import {
    Actions as FocusableActions, focusableModifierBuilder
} from "../common/modifier/focusable";
import { focused } from "../common/modifier/focusable/reducer";
import { valueModifierBuilder } from "../common/modifier/value";
import { Actions as ValueActions } from "../common/modifier/value/actions";
import { value } from "../common/modifier/value/reducer";
import { cnInput } from "./name";
import { InputComponent } from "./root";

const InputStatelessComponent = compose(
    InputComponent,
    focusableModifierBuilder(cnInput),
    valueModifierBuilder(),
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
