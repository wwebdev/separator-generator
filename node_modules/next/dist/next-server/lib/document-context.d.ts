import * as React from 'react';
import { DocumentProps } from './utils';
declare type DocumentContext = {
    readonly _documentProps: DocumentProps;
    readonly _devOnlyInvalidateCacheQueryString: string;
};
export declare const DocumentContext: React.Context<DocumentContext>;
export {};
