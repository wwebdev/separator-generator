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

const treeParser = require('./TreeParser');
const log = require('./log');
const {oneBehindFetch} = require('@ampproject/toolbox-core');
const validatorRules = require('@ampproject/toolbox-validator-rules');
const RuntimeVersion = require('@ampproject/toolbox-runtime-version/lib/RuntimeVersion');

/**
 * AMP Optimizer Configuration only applying AMP validity perserving transformations.
 */
const TRANSFORMATIONS_AMP_FIRST = [
  // Adds missing AMP tags
  'AddMandatoryTags',
  // Optional Markdown compatibility
  // needs to run before ServerSideRendering
  'Markdown',
  // Adds missing AMP extensions
  'AutoExtensionImporter',
  // Applies server-side-rendering optimizations
  'ServerSideRendering',
  // Removes the boilerplate
  // needs to run after ServerSideRendering
  'AmpBoilerplateTransformer',
  // Optimizes script import order
  // needs to run after ServerSideRendering
  'ReorderHeadTransformer',
  // needs to run after ReorderHeadTransformer
  'RewriteAmpUrls',
  'GoogleFontsPreconnect',
  'PruneDuplicateResourceHints',
  // Move keyframes into a separate style tag
  'SeparateKeyframes',
  'AddTransformedFlag',
  // Removes unsupported nonce attribute from scripts
  'RemoveCspNonce',
  // Minifies HTML, JSON, inline amp-script
  'MinifyHtml',
  // Inject CSP script has required for inline amp-script
  // needs to run after MinifyHtml which changes the inline script
  'AmpScriptCsp',
];

/**
 * AMP Optimizer Configuration for transformations resulting in invalid AMP pages setting up paired AMP mode.
 *
 * @deprecated
 */
const TRANSFORMATIONS_PAIRED_AMP = [
  // Adds missing AMP extensions
  'AutoExtensionImporter',
  // Adds a link to the valid AMP version
  'AddAmpLink',
  // Applies server-side-rendering optimizations
  'ServerSideRendering',
  // Removes ⚡ or 'amp' from the html tag
  'RemoveAmpAttribute',
  // Removes the boilerplate
  // needs to run after ServerSideRendering
  'AmpBoilerplateTransformer',
  // Optimizes script import order
  // needs to run after ServerSideRendering
  'ReorderHeadTransformer',
  // needs to run after ReorderHeadTransformer
  'RewriteAmpUrls',
  'GoogleFontsPreconnect',
  'PruneDuplicateResourceHints',
  'AddBlurryImagePlaceholders',
  'SeparateKeyframes',
  'AddTransformedFlag',
  // Minifies HTML, JSON, inline amp-script
  'MinifyHtml',
  // Inject CSP script has required for inline amp-script
  // needs to run after MinifyHtml which changes the inline script
  'AmpScriptCsp',
];

const DEFAULT_CONFIG = {
  fetch: oneBehindFetch,
  log,
  transformations: TRANSFORMATIONS_AMP_FIRST,
  validatorRules,
  verbose: false,
};

/**
 * Applies a set of transformations to a DOM tree.
 */
class DomTransformer {
  /**
   * Create a DomTransformer.
   * @param {Object} config - The config.
   * @param {Array.<Transformer>} config.transformers - a list of transformers to be applied.
   */
  constructor(config=DEFAULT_CONFIG) {
    this.setConfig(config);
  }

  /**
   * Transforms an html string.
   * @param {string} html - a string containing valid HTML.
   * @param {Object} params - a dictionary containing transformer specific parameters.
   * @return {string} - the transformed html string
   */
  async transformHtml(html, params) {
    const tree = await treeParser.parse(html);
    await this.transformTree(tree, params);
    return treeParser.serialize(tree);
  }

  /**
   * Transforms a DOM tree.
   * @param {Tree} tree - a DOM tree.
   * @param {Object} params - a dictionary containing transformer specific parameters.
   */
  transformTree(tree, params) {
    params = params || {};
    log.verbose(params.verbose || false);
    const sequence = async (promise, transformer) => {
      await promise;
      return transformer.transform(tree, params);
    };
    return this.transformers_.reduce(sequence, Promise.resolve());
  }

  /**
   * Set the config.
   * @param {Object} config - The config.
   * @param {boolean} config.verbose - true if verbose mode should be enabled [default: false].
   * @param {Array.<Transformer>} config.transformations - a list of transformers to be applied.
   */
  setConfig(config) {
    config = Object.assign({}, DEFAULT_CONFIG, config);
    if (!config.runtimeVersion) {
    // Re-use custom fetch implementation for runtime version provider
      config.runtimeVersion = new RuntimeVersion(config.fetch);
    }
    log.verbose(config.verbose);
    this.initTransformers_(config);
  }

  /**
   * @private
   */
  initTransformers_(config) {
    this.transformers_ = config.transformations.map((Transformer) => {
      if (typeof Transformer === 'string') {
        Transformer = require(`./transformers/${Transformer}.js`);
      }
      return new Transformer(config);
    });
  }
}

module.exports = {
  DomTransformer,
  DEFAULT_CONFIG,
  TRANSFORMATIONS_AMP_FIRST,
  TRANSFORMATIONS_PAIRED_AMP,
};
