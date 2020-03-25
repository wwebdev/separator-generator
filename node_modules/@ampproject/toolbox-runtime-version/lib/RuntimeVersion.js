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

const log = require('@ampproject/toolbox-core').log.tag('AMP Runtime Version');

const AMP_CACHE_HOST = 'https://cdn.ampproject.org';
const RUNTIME_METADATA_PATH = '/rtv/metadata';

/**
 * Queries https://cdn.ampproject.org/rtv/metadata for the latest AMP runtime version. Uses a
 * stale-while-revalidate caching strategy to avoid refreshing the version.
 *
 * More details: https://cdn.ampproject.org/rtv/metadata returns the following metadata:
 *
 * <pre>
 * {
 *    "ampRuntimeVersion": "CURRENT_PROD",
 *    "ampCssUrl": "https://cdn.ampproject.org/rtv/CURRENT_PROD/v0.css",
 *    "canaryPercentage": "0.1",
 *    "diversions": [
 *      "CURRENT_OPTIN",
 *      "CURRENT_1%",
 *      "CURRENT_CONTROL"
 *    ]
 *  }
 *  </pre>
 *
 *  where:
 *
 *  <ul>
 *    <li> CURRENT_OPTIN: is when you go to https://cdn.ampproject.org/experiments.html and toggle "dev-channel". It's the earliest possible time to get new code.</li>
 *    <li> CURRENT_1%: 1% is the same code as opt-in that we're now comfortable releasing to 1% of the population.</li>
 *    <li> CURRENT_CONTROL is the same thing as production, but with a different URL. This is to compare experiments against, since prod's immutable caching would affect metrics.</li>
 *  </ul>
 */
class RuntimeVersion {
  constructor(fetch) {
    this.fetch_ = fetch;
  }

  /**
   * Returns the version of the current AMP runtime release. Pass
   * <code>{canary: true}</code> to get the latest canary version.
   *
   * @param {Object} options - the options.
   * @param {bool} options.canary - true if canary should be returned.
   * @param {string} options.ampUrlPrefix - the domain & path to an AMP runtime.
   * @returns {Promise<string>} a promise containing the current version.
   */
  async currentVersion(options = {}) {
    let runtimeMetaUrl = AMP_CACHE_HOST + RUNTIME_METADATA_PATH;
    if (options.ampUrlPrefix) {
      const customMetaUrl = options.ampUrlPrefix.replace(/\/$/, '') + RUNTIME_METADATA_PATH;
      // Check whether ampUrlPrefix is absolute since relative paths are allowed
      // by optimizer
      if (this.isAbsoluteUrl_(customMetaUrl)) {
        runtimeMetaUrl = customMetaUrl;
      } else {
        log.warn('ampUrlPrefix is not an absolute URL. Falling back to https://cdn.ampproject.org.');
      }
    }
    const response = await this.fetch_(runtimeMetaUrl);
    const data = await response.json();
    let version;
    if (options.canary) {
      version = data.diversions[0];
      log.debug('canary version', version);
    } else {
      version = data.ampRuntimeVersion;
      log.debug('prod version', version);
    }
    return this.padVersionString_(version);
  }

  /* PRIVATE */
  padVersionString_(version) {
    return this.pad_(version, 15, 0);
  }

  pad_(n, width, z) {
    z = z || '0';
    n = String(n);
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  isAbsoluteUrl_(url) {
    try {
      new URL(url);
      return true;
    } catch (ex) { }

    return false;
  }
}

module.exports = RuntimeVersion;
