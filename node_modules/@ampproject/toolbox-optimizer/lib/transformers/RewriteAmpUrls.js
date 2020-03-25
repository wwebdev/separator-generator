/**
 * Copyright 2017 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const {createElement, firstChildByTag, insertAfter} = require('../NodeUtils');
const {AMP_CACHE_HOST} = require('../AmpConstants.js');
const {findMetaViewport} = require('../HtmlDomHelper');
const {calculateHost} = require('../RuntimeHostHelper');

/**
 * RewriteAmpUrls - rewrites AMP runtime URLs.
 *
 * This transformer supports two parameters:
 *
 * * `ampRuntimeVersion`: specifies a
 *   [specific version](https://github.com/ampproject/amp-toolbox/tree/master/runtime-version")
 *   version</a> of the AMP runtime. For example: `ampRuntimeVersion:
 *   "001515617716922"` will result in AMP runtime URLs being re-written
 *   from `https://cdn.ampproject.org/v0.js` to
 *   `https://cdn.ampproject.org/rtv/001515617716922/v0.js`.
 *
 * * `ampUrlPrefix`: specifies an URL prefix for AMP runtime
 *   URLs. For example: `ampUrlPrefix: "/amp"` will result in AMP runtime
 *   URLs being re-written from `https://cdn.ampproject.org/v0.js` to
 *   `/amp/v0.js`. This option is experimental and not recommended.
 *
 * Both parameters are optional. If no option is provided, runtime URLs won't be
 * re-written. You can combine both parameters to rewrite AMP runtime URLs
 * to versioned URLs on a different origin.
 *
 * This transformer also adds a preload header for the AMP runtime (v0.js) to trigger HTTP/2
 * push for CDNs (see https://www.w3.org/TR/preload/#server-push-(http/2)).
 */
class RewriteAmpUrls {
  transform(root, params) {
    const html = firstChildByTag(root, 'html');
    const head = firstChildByTag(html, 'head');
    if (!head) return;

    const host = calculateHost(params);

    let node = head.firstChild;
    let referenceNode = findMetaViewport(head);

    while (node) {
      if (node.tagName === 'script' && this._usesAmpCacheUrl(node.attribs.src)) {
        node.attribs.src = this._replaceUrl(node.attribs.src, host);
        referenceNode = this._addPreload(head, referenceNode, node.attribs.src, 'script');
      } else if (node.tagName === 'link' &&
                  node.attribs.rel === 'stylesheet' &&
                  this._usesAmpCacheUrl(node.attribs.href)) {
        node.attribs.href = this._replaceUrl(node.attribs.href, host);
        referenceNode = this._addPreload(head, referenceNode, node.attribs.href, 'style');
      }
      node = node.nextSibling;
    }
  }

  _usesAmpCacheUrl(url) {
    if (!url) {
      return;
    }
    return url.startsWith(AMP_CACHE_HOST);
  }

  _replaceUrl(url, ampUrlPrefix) {
    return ampUrlPrefix + url.substring(AMP_CACHE_HOST.length);
  }

  _addPreload(parent, node, href, type) {
    if (!href.endsWith('v0.js') &&
      !href.endsWith('v0.css')) {
      return node;
    }
    const preload = createElement('link', {
      rel: 'preload',
      href: href,
      as: type,
    });
    insertAfter(parent, preload, node);
    return preload;
  }
}

module.exports = RewriteAmpUrls;
