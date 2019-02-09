import { combineReducers } from "redux";

import { compose } from "@bem-react/core";

import { ActionsUnion } from "../Common/action.helper";
import { wrapToStatefulComponent } from "../Common/component.wrapper";
import {
    Actions as FocusableActions, focusableModifierBuilder
} from "../Common/Modifier/Focusable";
import { focused } from "../Common/Modifier/Focusable/reducer";
import { cnInput } from "./name";
import { InputComponent } from "./root";
import { valueModifier } from "./Value";
import { Actions as ValueActions } from "./Value/actions";
import { value } from "./Value/reducer";

const InputStatelessComponent = compose(
    focusableModifierBuilder(cnInput),
    valueModifier,
)(InputComponent);

export const inputActions = {
    ...FocusableActions,
    ...ValueActions,
};

export type inputActions = ActionsUnion<typeof inputActions>;

export const inputReducer = combineReducers({
    value,
    focused,
});

export const Input = wrapToStatefulComponent(InputStatelessComponent, inputReducer);
