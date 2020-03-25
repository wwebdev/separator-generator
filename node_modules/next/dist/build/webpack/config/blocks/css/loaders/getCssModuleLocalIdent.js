"use strict";exports.__esModule=true;exports.getCssModuleLocalIdent=getCssModuleLocalIdent;var _loaderUtils=_interopRequireDefault(require("loader-utils"));var _path=_interopRequireDefault(require("path"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}const regexLikeIndexModule=/(?<!pages[\\/])index\.module\.(scss|sass|css)$/;function getCssModuleLocalIdent(context,_,exportName,options){const relativePath=_path.default.relative(context.rootContext,context.resourcePath).replace(/\\+/g,'/');// Generate a more meaningful name (parent folder) when the user names the
// file `index.module.css`.
const fileNameOrFolder=regexLikeIndexModule.test(relativePath)?'[folder]':'[name]';// Generate a hash to make the class name unique.
const hash=_loaderUtils.default.getHashDigest(Buffer.from(`filePath:${relativePath}#className:${exportName}`),'md5','base64',5);// Have webpack interpolate the `[folder]` or `[name]` to its real value.
return _loaderUtils.default.interpolateName(context,fileNameOrFolder+'_'+exportName+'__'+hash,options).replace(// Webpack name interpolation returns `about.module_root__2oFM9` for
// `.root {}` inside a file named `about.module.css`. Let's simplify
// this.
/\.module_/,'_');}