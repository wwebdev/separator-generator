/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
export declare function serveStatic(req: IncomingMessage, res: ServerResponse, path: string): Promise<void>;
