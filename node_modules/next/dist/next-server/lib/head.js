"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const side_effect_1 = __importDefault(require("./side-effect"));
const amp_context_1 = require("./amp-context");
const head_manager_context_1 = require("./head-manager-context");
const amp_1 = require("./amp");
function defaultHead(inAmpMode = false) {
    const head = [react_1.default.createElement("meta", { charSet: "utf-8" })];
    if (!inAmpMode) {
        head.push(react_1.default.createElement("meta", { name: "viewport", content: "width=device-width,minimum-scale=1,initial-scale=1" }));
    }
    return head;
}
exports.defaultHead = defaultHead;
function onlyReactElement(list, child) {
    // React children can be "string" or "number" in this case we ignore them for backwards compat
    if (typeof child === 'string' || typeof child === 'number') {
        return list;
    }
    // Adds support for React.Fragment
    if (child.type === react_1.default.Fragment) {
        return list.concat(react_1.default.Children.toArray(child.props.children).reduce((fragmentList, fragmentChild) => {
            if (typeof fragmentChild === 'string' ||
                typeof fragmentChild === 'number') {
                return fragmentList;
            }
            return fragmentList.concat(fragmentChild);
        }, []));
    }
    return list.concat(child);
}
const METATYPES = ['name', 'httpEquiv', 'charSet', 'itemProp'];
/*
 returns a function for filtering head child elements
 which shouldn't be duplicated, like <title/>
 Also adds support for deduplicated `key` properties
*/
function unique() {
    const keys = new Set();
    const tags = new Set();
    const metaTypes = new Set();
    const metaCategories = {};
    return (h) => {
        let unique = true;
        if (h.key && typeof h.key !== 'number' && h.key.indexOf('$') > 0) {
            const key = h.key.slice(h.key.indexOf('$') + 1);
            if (keys.has(key)) {
                unique = false;
            }
            else {
                keys.add(key);
            }
        }
        // eslint-disable-next-line default-case
        switch (h.type) {
            case 'title':
            case 'base':
                if (tags.has(h.type)) {
                    unique = false;
                }
                else {
                    tags.add(h.type);
                }
                break;
            case 'meta':
                for (let i = 0, len = METATYPES.length; i < len; i++) {
                    const metatype = METATYPES[i];
                    if (!h.props.hasOwnProperty(metatype))
                        continue;
                    if (metatype === 'charSet') {
                        if (metaTypes.has(metatype)) {
                            unique = false;
                        }
                        else {
                            metaTypes.add(metatype);
                        }
                    }
                    else {
                        const category = h.props[metatype];
                        const categories = metaCategories[metatype] || new Set();
                        if (categories.has(category)) {
                            unique = false;
                        }
                        else {
                            categories.add(category);
                            metaCategories[metatype] = categories;
                        }
                    }
                }
                break;
        }
        return unique;
    };
}
/**
 *
 * @param headElement List of multiple <Head> instances
 */
function reduceComponents(headElements, props) {
    return headElements
        .reduce((list, headElement) => {
        const headElementChildren = react_1.default.Children.toArray(headElement.props.children);
        return list.concat(headElementChildren);
    }, [])
        .reduce(onlyReactElement, [])
        .reverse()
        .concat(defaultHead(props.inAmpMode))
        .filter(unique())
        .reverse()
        .map((c, i) => {
        const key = c.key || i;
        return react_1.default.cloneElement(c, { key });
    });
}
const Effect = side_effect_1.default();
/**
 * This component injects elements to `<head>` of your page.
 * To avoid duplicated `tags` in `<head>` you can use the `key` property, which will make sure every tag is only rendered once.
 */
function Head({ children }) {
    return (react_1.default.createElement(amp_context_1.AmpStateContext.Consumer, null, ampState => (react_1.default.createElement(head_manager_context_1.HeadManagerContext.Consumer, null, updateHead => (react_1.default.createElement(Effect, { reduceComponentsToState: reduceComponents, handleStateChange: updateHead, inAmpMode: amp_1.isInAmpMode(ampState) }, children))))));
}
Head.rewind = Effect.rewind;
exports.default = Head;
