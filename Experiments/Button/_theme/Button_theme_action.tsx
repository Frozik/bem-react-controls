import { withBemMod } from "@bem-react/core";
import { button } from "./../Button";

export interface IButtonThemeActionProps {
    theme?: "action";
}

export const ButtonThemeAction = withBemMod<IButtonThemeActionProps>(button(), {
    theme: "action"
});
