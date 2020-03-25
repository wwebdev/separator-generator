"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRouteMatcher(routeRegex) {
    const { re, groups } = routeRegex;
    return (pathname) => {
        const routeMatch = re.exec(pathname);
        if (!routeMatch) {
            return false;
        }
        const decode = decodeURIComponent;
        const params = {};
        Object.keys(groups).forEach((slugName) => {
            const g = groups[slugName];
            const m = routeMatch[g.pos];
            if (m !== undefined) {
                params[slugName] = ~m.indexOf('/')
                    ? m.split('/').map(entry => decode(entry))
                    : g.repeat
                        ? [decode(m)]
                        : decode(m);
            }
        });
        return params;
    };
}
exports.getRouteMatcher = getRouteMatcher;
