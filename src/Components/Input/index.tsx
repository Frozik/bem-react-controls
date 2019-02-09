import { combineReducers } from "redux";

import { compose } from "@bem-react/core";

import { ActionsUnion } from "../Common/action.helper";
import { buildStatefulComponent } from "../Common/component.translator";
import {
    Actions as FocusableActions, focusableModifierBuilder
} from "../Common/Modifier/Focusable";
import { focused } from "../Common/Modifier/Focusable/reducer";
import { cnInput, Input as Base } from "./Input";
import { valueModifierBuilder } from "./Value";
import { Actions as ValueActions } from "./Value/actions";
import { value } from "./Value/reducer";

const InputStatelessComponent = compose(
    focusableModifierBuilder(cnInput),
    valueModifierBuilder(cnInput),
)(Base);

export const inputActions = {
    ...FocusableActions,
    ...ValueActions,
};

export type inputActions = ActionsUnion<typeof inputActions>;

export const inputReducer = combineReducers({
    value,
    focused,
});

export const Input = buildStatefulComponent(InputStatelessComponent, inputReducer);
