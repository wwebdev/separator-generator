"use strict";exports.__esModule=true;exports.default=void 0;var _loaderUtils=_interopRequireDefault(require("loader-utils"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}const nextClientPagesLoader=function(){const{absolutePagePath,page}=_loaderUtils.default.getOptions(this);const stringifiedAbsolutePagePath=JSON.stringify(absolutePagePath);const stringifiedPage=JSON.stringify(page);return`
    (window.__NEXT_P=window.__NEXT_P||[]).push([${stringifiedPage}, function() {
      var mod = require(${stringifiedAbsolutePagePath})
      if(module.hot) {
        module.hot.accept(${stringifiedAbsolutePagePath}, function() {
          if(!next.router.components[${stringifiedPage}]) return
          var updatedPage = require(${stringifiedAbsolutePagePath})
          next.router.update(${stringifiedPage}, updatedPage)
        })
      }
      return mod
    }]);
  `;};var _default=nextClientPagesLoader;exports.default=_default;