"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const amp_context_1 = require("./amp-context");
function isInAmpMode({ ampFirst = false, hybrid = false, hasQuery = false, } = {}) {
    return ampFirst || (hybrid && hasQuery);
}
exports.isInAmpMode = isInAmpMode;
function useAmp() {
    // Don't assign the context value to a variable to save bytes
    return isInAmpMode(react_1.default.useContext(amp_context_1.AmpStateContext));
}
exports.useAmp = useAmp;
