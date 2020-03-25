/// <reference types="node" />
import React, { Component } from 'react';
import { UrlObject } from 'url';
import { PrefetchOptions } from '../next-server/lib/router/router';
declare type Url = string | UrlObject;
declare type FormatResult = {
    href: string;
    as?: string;
};
export declare type LinkProps = {
    href: Url;
    as?: Url;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
};
declare class Link extends Component<LinkProps> {
    p: boolean;
    constructor(props: LinkProps);
    cleanUpListeners: () => void;
    componentWillUnmount(): void;
    getPaths(): string[];
    handleRef(ref: Element): void;
    formatUrls: (href: string | UrlObject, as?: string | UrlObject | undefined) => FormatResult;
    linkClicked: (e: React.MouseEvent<Element, MouseEvent>) => void;
    prefetch(options?: PrefetchOptions): void;
    render(): React.DetailedReactHTMLElement<{
        onMouseEnter: (event: React.MouseEvent<Element, MouseEvent>) => void;
        onClick: (event: React.MouseEvent<Element, MouseEvent>) => void;
        href?: string | undefined;
        ref?: any;
    }, HTMLElement>;
}
export default Link;
