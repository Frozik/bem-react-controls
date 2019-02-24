import classnames from "classnames";
import React, { ComponentType, memo, PureComponent } from "react";

import { ComponentName } from "./component-name";
import { ComponentNameContext, IClassNameProps } from "./contracts";

export type Enhancer<P = {}> = (Component: ComponentType<any>) => ComponentType<P>;

export const MatchAny = Symbol("*");
export const SkipMatch = Symbol("-");
export const RemoveModifier: ActionModifier = Object.freeze({
    match: SkipMatch,
    keepInProps: false,
    useForClassName: false,
});

type OmitModifier = string | number | boolean | Symbol;

type ActionModifier<M = OmitModifier> = {
    match: M,
    keepInProps?: boolean,
    useForClassName?: boolean,
};

type Modifiers<P> = {
    [key in keyof P]?: P[key] | OmitModifier | ActionModifier<P[key] | OmitModifier>;
};

type FullModifiers<P> = {
    [key in keyof P]: ActionModifier<P[key] | OmitModifier>;
};

type ClassModifiers<P> = {
    [key in keyof P]: P[key];
};

function isActionModifier(modifier: any): modifier is ActionModifier {
    return !!modifier && modifier.hasOwnProperty("match");
}

export function buildConditionalEnhancer<P extends IClassNameProps>(
    modifiers: Modifiers<P>,
    enhancer?: Enhancer<P>,
): Enhancer<P> {
    const keys = modifiers ? Object.keys(modifiers) as Array<keyof P> : [];

    const fullModifiers = keys.reduce(
        (buildModifiers, key) => {
            const modifierValue = (modifiers as Modifiers<P>)[key];

            buildModifiers[key] = Object.assign(
                { useForClassName: true, keepInProps: false },
                isActionModifier(modifierValue)
                    ? modifierValue
                    : { match: modifierValue as OmitModifier },
            );

            return buildModifiers;
        },
        {} as FullModifiers<P>,
    );

    const omitKeys = keys.filter((key) => !fullModifiers[key].keepInProps);
    const classNameKeys = keys.filter((key) => fullModifiers[key].useForClassName);

    function buildClassNames(componentName: ComponentName, props: P): string {
        const modifierClassNames = classNameKeys.reduce(
            (classModifier, key) => {
                classModifier[key] = props[key];

                return classModifier;
            },
            {} as ClassModifiers<P>,
        );

        return componentName(modifierClassNames).toString();
    }

    function buildSubProps(componentName: ComponentName, props: P): P {
        const subProps = {} as P;

        for (const key in props) {
            if (!props.hasOwnProperty(key) || omitKeys.indexOf(key) >= 0) {
                continue;
            }

            subProps[key] = props[key];
        }

        subProps.className = classnames(props.className, buildClassNames(componentName, props));

        return subProps;
    }

    return (Component: ComponentType<any>) => (
        class extends PureComponent<P> {
            constructor(props: P) {
                super(props);

                const safePropertiesComponent = (props: P) => (
                    <ComponentNameContext.Consumer>
                        { (componentName) => React.createElement(Component, buildSubProps(componentName, props)) }
                    </ComponentNameContext.Consumer>
                );

                this._enhancedComponent = enhancer
                    ? enhancer(memo(safePropertiesComponent))
                    : safePropertiesComponent;
            }

            static contextType = ComponentNameContext;

            private readonly _enhancedComponent: ComponentType<P>;

            private shouldWrapInEnhancer() {
                return keys.every((key) => {
                    const modifierValue = fullModifiers[key].match;

                    return modifierValue === SkipMatch ||
                        (modifierValue === MatchAny && key in this.props) ||
                        modifierValue === this.props[key];
                });
            }

            render() {
                return this.shouldWrapInEnhancer()
                    ? React.createElement(this._enhancedComponent, this.props)
                    : React.createElement(Component, this.props);
            }
        }
    );
}
