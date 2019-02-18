import { ComponentType } from "react";

import { Enhancer } from "./enhancer";

export function compose<P>(
    composition: ComponentType<P>,
): ComponentType<P>;

export function compose<P, P1>(
    composition: ComponentType<P>,
    enhancer1: Enhancer<P1>,
): ComponentType<P & P1>;

export function compose<P, P1, P2>(
    composition: ComponentType<P>,
    enhancer1: Enhancer<P1>,
    enhancer2: Enhancer<P2>,
): ComponentType<P & P1 & P2>;

export function compose<P, P1, P2, P3>(
    composition: ComponentType<P>,
    enhancer1: Enhancer<P1>,
    enhancer2: Enhancer<P2>,
    enhancer3: Enhancer<P3>,
): ComponentType<P & P1 & P2 & P3>;

export function compose<P, P1, P2, P3, P4>(
    composition: ComponentType<P>,
    enhancer1: Enhancer<P1>,
    enhancer2: Enhancer<P2>,
    enhancer3: Enhancer<P3>,
    enhancer4: Enhancer<P4>,
): ComponentType<P & P1 & P2 & P3 & P4>;

export function compose<P, P1, P2, P3, P4, P5>(
    composition: ComponentType<P>,
    enhancer1: Enhancer<P1>,
    enhancer2: Enhancer<P2>,
    enhancer3: Enhancer<P3>,
    enhancer4: Enhancer<P4>,
    enhancer5: Enhancer<P5>,
): ComponentType<P & P1 & P2 & P3 & P4 & P5>;

export function compose<P, P1, P2, P3, P4, P5, P6>(
    composition: ComponentType<P>,
    enhancer1: Enhancer<P1>,
    enhancer2: Enhancer<P2>,
    enhancer3: Enhancer<P3>,
    enhancer4: Enhancer<P4>,
    enhancer5: Enhancer<P5>,
    enhancer6: Enhancer<P6>,
): ComponentType<P & P1 & P2 & P3 & P4 & P5 & P6>;

export function compose<P, P1, P2, P3, P4, P5, P6, P7>(
    composition: ComponentType<P>,
    enhancer1: Enhancer<P1>,
    enhancer2: Enhancer<P2>,
    enhancer3: Enhancer<P3>,
    enhancer4: Enhancer<P4>,
    enhancer5: Enhancer<P5>,
    enhancer6: Enhancer<P6>,
    enhancer7: Enhancer<P7>,
): ComponentType<P & P1 & P2 & P3 & P4 & P5 & P6 & P7>;

export function compose<P, P1, P2, P3, P4, P5, P6, P7, P8>(
    composition: ComponentType<P>,
    enhancer1: Enhancer<P1>,
    enhancer2: Enhancer<P2>,
    enhancer3: Enhancer<P3>,
    enhancer4: Enhancer<P4>,
    enhancer5: Enhancer<P5>,
    enhancer6: Enhancer<P6>,
    enhancer7: Enhancer<P7>,
    enhancer8: Enhancer<P8>,
): ComponentType<P & P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8>;

export function compose<P, P1, P2, P3, P4, P5, P6, P7, P8, P9>(
    composition: ComponentType<P>,
    enhancer1: Enhancer<P1>,
    enhancer2: Enhancer<P2>,
    enhancer3: Enhancer<P3>,
    enhancer4: Enhancer<P4>,
    enhancer5: Enhancer<P5>,
    enhancer6: Enhancer<P6>,
    enhancer7: Enhancer<P7>,
    enhancer8: Enhancer<P8>,
    enhancer9: Enhancer<P9>,
): ComponentType<P & P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8 & P9>;

export function compose<P, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10>(
    composition: ComponentType<P>,
    enhancer1: Enhancer<P1>,
    enhancer2: Enhancer<P2>,
    enhancer3: Enhancer<P3>,
    enhancer4: Enhancer<P4>,
    enhancer5: Enhancer<P5>,
    enhancer6: Enhancer<P6>,
    enhancer7: Enhancer<P7>,
    enhancer8: Enhancer<P8>,
    enhancer9: Enhancer<P9>,
    enhancer10: Enhancer<P10>,
): ComponentType<P & P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8 & P9 & P10>;

export function compose(
    composition: ComponentType<any>,
    ...enhancers: Array<Enhancer<any>>
): ComponentType<any>;

export function compose<P>(C: ComponentType<P>, ...highOrderComponents: Enhancer<any>[]): ComponentType<P> {
    return highOrderComponents.length ? highOrderComponents.reduce((composition, hoc) => hoc(composition), C) : C;
}
