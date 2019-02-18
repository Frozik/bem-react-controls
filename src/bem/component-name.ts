type Parameter = string | { [key: string]: any };

export type ComponentName = (parameter: Parameter, skipCheck?: boolean) => ComponentName | string;

export function componentName(componentName: string): ComponentName {
    let accumulatedComponentName = componentName;

    const componentNameInner = (parameter: Parameter, skipCheck?: boolean): ComponentName | string => {
        if (typeof parameter === "string" || parameter instanceof String) {
            accumulatedComponentName = `${accumulatedComponentName}__${parameter}`;
            return componentNameInner;
        }

        return Object.keys(parameter).reduce(
            (className, key) => skipCheck || parameter[key] || parameter[key] === 0
                ? `${
                    className ? `${className} `: ""
                }${
                    accumulatedComponentName
                }--${
                    key
                }${
                    parameter[key] && typeof parameter[key] !== "boolean" ? `-${parameter[key]}` : ""
                }`
                : className,
            "",
        );
    };

    componentNameInner.toString = () => accumulatedComponentName;
    componentNameInner.valueOf = () => accumulatedComponentName;

    return componentNameInner;
}
