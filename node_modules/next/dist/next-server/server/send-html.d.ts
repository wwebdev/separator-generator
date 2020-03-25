/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
export declare function sendHTML(req: IncomingMessage, res: ServerResponse, html: string, { generateEtags, poweredByHeader, }: {
    generateEtags: boolean;
    poweredByHeader: boolean;
}): void;
