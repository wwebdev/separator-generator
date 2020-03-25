"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function optimize(html) {
    let AmpOptimizer;
    try {
        AmpOptimizer = require('@ampproject/toolbox-optimizer');
    }
    catch (_) {
        return html;
    }
    const optimizer = AmpOptimizer.create();
    return optimizer.transformHtml(html);
}
exports.default = optimize;
