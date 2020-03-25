import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { DocumentContext as DocumentComponentContext } from '../next-server/lib/document-context';
import { DocumentContext, DocumentInitialProps, DocumentProps } from '../next-server/lib/utils';
export { DocumentContext, DocumentInitialProps, DocumentProps };
export declare type OriginProps = {
    nonce?: string;
    crossOrigin?: string;
};
export declare function middleware({ req, res }: DocumentContext): Promise<void>;
/**
 * `Document` component handles the initial `document` markup and renders only on the server side.
 * Commonly used for implementing server side rendering for `css-in-js` libraries.
 */
export default class Document<P = {}> extends Component<DocumentProps & P> {
    static headTagsMiddleware: Promise<any> | (() => never[]);
    static bodyTagsMiddleware: Promise<any> | (() => never[]);
    static htmlPropsMiddleware: Promise<any> | (() => never[]);
    /**
     * `getInitialProps` hook returns the context object with the addition of `renderPage`.
     * `renderPage` callback executes `React` rendering logic synchronously to support server-rendering wrappers
     */
    static getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps>;
    static renderDocument<P>(Document: new () => Document<P>, props: DocumentProps & P): React.ReactElement;
    render(): JSX.Element;
}
export declare class Html extends Component<React.DetailedHTMLProps<React.HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>> {
    static contextType: React.Context<{
        readonly _documentProps: DocumentProps;
        readonly _devOnlyInvalidateCacheQueryString: string;
    }>;
    static propTypes: {
        children: PropTypes.Validator<string | number | boolean | {} | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
    };
    context: React.ContextType<typeof DocumentComponentContext>;
    render(): JSX.Element;
}
export declare class Head extends Component<OriginProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadElement>, HTMLHeadElement>> {
    static contextType: React.Context<{
        readonly _documentProps: DocumentProps;
        readonly _devOnlyInvalidateCacheQueryString: string;
    }>;
    static propTypes: {
        nonce: PropTypes.Requireable<string>;
        crossOrigin: PropTypes.Requireable<string>;
    };
    context: React.ContextType<typeof DocumentComponentContext>;
    getCssLinks(): JSX.Element[] | null;
    getPreloadDynamicChunks(): (JSX.Element | null)[];
    getPreloadMainLinks(): JSX.Element[] | null;
    render(): JSX.Element;
}
export declare class Main extends Component {
    static contextType: React.Context<{
        readonly _documentProps: DocumentProps;
        readonly _devOnlyInvalidateCacheQueryString: string;
    }>;
    context: React.ContextType<typeof DocumentComponentContext>;
    render(): "__NEXT_AMP_RENDER_TARGET__" | JSX.Element;
}
export declare class NextScript extends Component<OriginProps> {
    static contextType: React.Context<{
        readonly _documentProps: DocumentProps;
        readonly _devOnlyInvalidateCacheQueryString: string;
    }>;
    static propTypes: {
        nonce: PropTypes.Requireable<string>;
        crossOrigin: PropTypes.Requireable<string>;
    };
    context: React.ContextType<typeof DocumentComponentContext>;
    static safariNomoduleFix: string;
    getDynamicChunks(): (JSX.Element | null)[];
    getScripts(): JSX.Element[] | null;
    getPolyfillScripts(): JSX.Element[];
    static getInlineScriptSource(documentProps: DocumentProps): string;
    render(): JSX.Element | null;
}
