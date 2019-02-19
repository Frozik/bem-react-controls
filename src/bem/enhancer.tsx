import classnames from "classnames";
import React, { ComponentType, PureComponent } from "react";

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
    enhancer: Enhancer<P>,
    modifiers?: Modifiers<P>,
): Enhancer<P> {
    return (Component: ComponentType<any>) => (
        class extends PureComponent<P> {
            constructor(props: P) {
                super(props);

                this._keys = modifiers ? Object.keys(modifiers) as Array<keyof P> : [];

                this._modifiers = this._keys.reduce(
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

                this._omitKeys = this._keys.filter((key) => !this._modifiers[key].keepInProps);
                this._classNameKeys = this._keys.filter((key) => this._modifiers[key].useForClassName);

                this._enhancedComponent = enhancer(this.cleanPropsComponent);

            }

            static contextType = ComponentNameContext;

            private readonly _keys: Array<keyof P>;
            private readonly _omitKeys: Array<keyof P>;
            private readonly _classNameKeys: Array<keyof P>;
            private readonly _enhancedComponent: ComponentType<P>;
            private readonly _modifiers: FullModifiers<P>;

            private shouldWrapInEnhancer() {
                return this._keys.every((key) => {
                    const modifierValue = this._modifiers[key].match;

                    return modifierValue === SkipMatch ||
                        (modifierValue === MatchAny && key in this.props) ||
                        modifierValue === this.props[key];
                });
            }

            private buildSubProps(componentName: ComponentName, props: P) {
                const subProps = {} as P;

                for (const key in props) {
                    if (!props.hasOwnProperty(key) || this._omitKeys.indexOf(key) >= 0) {
                        continue;
                    }

                    subProps[key] = props[key];
                }

                subProps.className = classnames(props.className, this.buildClassNames(componentName));

                return subProps;
            }

            private buildClassNames(componentName: ComponentName): string {
                const modifierClassNames = this._classNameKeys.reduce(
                    (classModifier, key) => {
                        classModifier[key] = this.props[key];

                        return classModifier;
                    },
                    {} as ClassModifiers<P>,
                );

                return componentName(modifierClassNames).toString();
            }

            private cleanPropsComponent = (props: P) => (
                <ComponentNameContext.Consumer>
                    { (componentName) => React.createElement(
                        Component,
                        this.buildSubProps(componentName, props),
                    ) }
                </ComponentNameContext.Consumer>
            )

            render() {
                return this.shouldWrapInEnhancer()
                    ? React.createElement(this._enhancedComponent, this.props)
                    : React.createElement(Component, this.props);
            }
        }
    );
}
