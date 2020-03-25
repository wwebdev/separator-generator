"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const send_1 = __importDefault(require("send"));
function serveStatic(req, res, path) {
    return new Promise((resolve, reject) => {
        send_1.default(req, path)
            .on('directory', () => {
            // We don't allow directories to be read.
            const err = new Error('No directory access');
            err.code = 'ENOENT';
            reject(err);
        })
            .on('error', reject)
            .pipe(res)
            .on('finish', resolve);
    });
}
exports.serveStatic = serveStatic;
