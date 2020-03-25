"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Identify /[param]/ in route string
const TEST_ROUTE = /\/\[[^/]+?\](?=\/|$)/;
function isDynamicRoute(route) {
    return TEST_ROUTE.test(route);
}
exports.isDynamicRoute = isDynamicRoute;
