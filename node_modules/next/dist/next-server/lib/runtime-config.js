"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let runtimeConfig;
exports.default = () => {
    return runtimeConfig;
};
function setConfig(configValue) {
    runtimeConfig = configValue;
}
exports.setConfig = setConfig;
