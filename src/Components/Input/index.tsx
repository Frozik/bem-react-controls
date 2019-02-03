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

// todo:
// 1) Add combineCidReducers which accepts reducers with CID
// 2) Add 2 sets of component reducers - with and without CID
// 3) In case we have CID in component.translator - modify action and add CID
// 4) Don't allow not plain object action for global dispatch (stick to several middlewares and process them on our side)
