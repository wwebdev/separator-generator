/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
export default function errorOverlayMiddleware(options: {
    dir: string;
}): (req: IncomingMessage, res: ServerResponse, next: Function) => void;
