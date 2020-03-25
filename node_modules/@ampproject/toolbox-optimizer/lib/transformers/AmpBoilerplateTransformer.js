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

const {
  insertText,
  createElement,
  insertBefore,
  hasAttribute,
  firstChildByTag,
} = require('../NodeUtils');
const {AMP_CACHE_HOST, appendRuntimeVersion} = require('../AmpConstants.js');

const V0_CSS_PATH = '/v0.css';

/**
 * AmpBoilerplateTransformer - This DOM transformer adds
 * https://cdn.ampproject.org/v0.css if server-side-rendering is applied
 * (known by the presence of <style amp-runtime> tag). AMP runtime css (v0.css)
 * will always be inlined as it'll get automatically updated to the latest version
 * once the AMP runtime has loaded.
 */
class AmpBoilerplateTransformer {
  constructor(config) {
    this.fetch_ = config.fetch;
    this.runtimeVersion_ = config.runtimeVersion;
    this.log_ = config.log.tag('AmpBoilerplateTransformer');
  }

  transform(root, params) {
    const html = firstChildByTag(root, 'html');
    const head = firstChildByTag(html, 'head');
    if (!head) {
      return; // invalid doc
    }
    // amp-runtime is added by server-side-rendering
    const ampRuntimeStyle = this._findAmpRuntimeStyle(head);
    if (!ampRuntimeStyle) {
      return; // keep existing boilerplate
    }
    return this._addStaticCss(ampRuntimeStyle, params);
  }

  _findAmpRuntimeStyle(head) {
    let node = head.firstChild;
    while (node) {
      if (hasAttribute(node, 'amp-runtime')) {
        return node;
      }
      node = node.nextSibling;
    }
    return null;
  }

  async _addStaticCss(node, params) {
    // we can always inline v0.css as the AMP runtime will take care of keeping v0.css in sync
    try {
      return this._inlineCss(node, params);
    } catch (error) {
      this.log_.error(error);
      this._linkCss(node);
    }
  }

  _linkCss(node) {
    const cssStyleNode = createElement('link', {
      rel: 'stylesheet',
      href: AMP_CACHE_HOST + V0_CSS_PATH,
    });
    insertBefore(node.parent, cssStyleNode, node);
  }

  async _inlineCss(node, params) {
    let version = params.ampRuntimeVersion;
    const ampUrlPrefix = params.ampUrlPrefix;

    // use version passed in via params if available
    // otherwise fetch the current prod version
    let v0CssUrl = AMP_CACHE_HOST + V0_CSS_PATH;
    if (!ampUrlPrefix) {
      if (version) {
        v0CssUrl = appendRuntimeVersion(AMP_CACHE_HOST, version) + V0_CSS_PATH;
      } else {
        version = await this.runtimeVersion_.currentVersion();
      }
    } else {
      // TODO: If ampUrlPrefix is a relative URL, this will fall back to
      // fetching the latest runtime version and boilerplate CSS from
      // cdn.ampproject.org. Is this our best option?
      if (version) {
        const customCssUrl = appendRuntimeVersion(ampUrlPrefix, version) + V0_CSS_PATH;
        if (this._isAbsoluteUrl(customCssUrl)) {
          v0CssUrl = customCssUrl;
        }
      } else {
        version = await this.runtimeVersion_.currentVersion({ampUrlPrefix});
        const customCssUrl = ampUrlPrefix + V0_CSS_PATH;
        if (this._isAbsoluteUrl(customCssUrl)) {
          v0CssUrl = customCssUrl;
        }
      }
    }

    node.attribs['i-amphtml-version'] = version;

    // Fetch and inline contents of v0.css
    const response = await this.fetch_(v0CssUrl);
    if (!response.ok) {
      throw new Error(`Could not inline v0.css. Request to ${v0CssUrl} failed with status ` +
          `${response.status}.`);
    }
    const body = await response.text();
    insertText(node, body);
  }

  _isAbsoluteUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (ex) { }

    return false;
  }
}

module.exports = AmpBoilerplateTransformer;
