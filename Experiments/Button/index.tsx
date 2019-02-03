import { compose } from "@bem-react/core";
import { Button  as  Base } from "./Button";
import { ButtonTypeLink } from "./_type/Button_type_link";
import { ButtonThemeAction } from "./_theme/Button_theme_action";

export const Button = compose(ButtonThemeAction, ButtonTypeLink)(Base);
