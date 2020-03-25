"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
/**
 * Recursively read directory
 * @param  {string[]=[]} arr This doesn't have to be provided, it's used for the recursion
 * @param  {string=dir`} rootDir Used to replace the initial path, only the relative path is left, it's faster than path.relative.
 * @returns Array holding all relative paths
 */
function recursiveReadDirSync(dir, arr = [], rootDir = dir) {
    const result = fs_1.default.readdirSync(dir);
    result.forEach((part) => {
        const absolutePath = path_1.join(dir, part);
        const pathStat = fs_1.default.statSync(absolutePath);
        if (pathStat.isDirectory()) {
            recursiveReadDirSync(absolutePath, arr, rootDir);
            return;
        }
        arr.push(absolutePath.replace(rootDir, ''));
    });
    return arr;
}
exports.recursiveReadDirSync = recursiveReadDirSync;
