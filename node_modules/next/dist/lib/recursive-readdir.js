"use strict";exports.__esModule=true;exports.recursiveReadDir=recursiveReadDir;var _fs=_interopRequireDefault(require("fs"));var _path=require("path");var _util=require("util");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}const readdir=(0,_util.promisify)(_fs.default.readdir);const stat=(0,_util.promisify)(_fs.default.stat);/**
 * Recursively read directory
 * @param  {string} dir Directory to read
 * @param  {RegExp} filter Filter for the file name, only the name part is considered, not the full path
 * @param  {string[]=[]} arr This doesn't have to be provided, it's used for the recursion
 * @param  {string=dir`} rootDir Used to replace the initial path, only the relative path is left, it's faster than path.relative.
 * @returns Promise array holding all relative paths
 */async function recursiveReadDir(dir,filter,ignore,arr=[],rootDir=dir){const result=await readdir(dir);await Promise.all(result.map(async part=>{const absolutePath=(0,_path.join)(dir,part);if(ignore&&ignore.test(part))return;const pathStat=await stat(absolutePath);if(pathStat.isDirectory()){await recursiveReadDir(absolutePath,filter,ignore,arr,rootDir);return;}if(!filter.test(part)){return;}arr.push(absolutePath.replace(rootDir,''));}));return arr.sort();}