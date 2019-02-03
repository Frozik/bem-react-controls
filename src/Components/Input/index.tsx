import { combineReducers } from "redux";

import { compose } from "@bem-react/core";

import { buildStatefulComponent } from "../Common/component.translator";
import { focusableModifierBuilder } from "../Common/Modifier/Focusable";
import { focused } from "../Common/Modifier/Focusable/reducer";
import { cnInput, Input as Base } from "./Input";
import { value } from "./reducer";

const InputStatelessComponent = compose(
    focusableModifierBuilder(cnInput)
)(Base);

// todo: Adds combineReducers with CID + export component reducer + it's type

export const InputComponent = buildStatefulComponent(
    cnInput,
    InputStatelessComponent,
    combineReducers({
        value,
        focused,
    })
);
