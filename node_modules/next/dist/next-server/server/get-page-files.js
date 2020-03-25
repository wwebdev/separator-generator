"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const normalize_page_path_1 = require("./normalize-page-path");
function getPageFiles(buildManifest, page) {
    const normalizedPage = normalize_page_path_1.normalizePagePath(page);
    let files = buildManifest.pages[normalizedPage];
    if (!files) {
        files = buildManifest.pages[normalizedPage.replace(/\/index$/, '') || '/'];
    }
    if (!files) {
        // tslint:disable-next-line
        console.warn(`Could not find files for ${normalizedPage} in .next/build-manifest.json`);
        return [];
    }
    return files;
}
exports.getPageFiles = getPageFiles;
