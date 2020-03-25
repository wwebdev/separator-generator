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

const {insertText, createElement, hasAttribute, firstChildByTag} = require('../NodeUtils');
const css = require('css');
const OPTIONS_PRETTY_PRINT = {
  indent: '  ',
  compress: false,
};
const OPTIONS_COMPRESS = {
  indent: '',
  compress: true,
};
const allowedKeyframeProps = new Set([
  'animation-timing-function',
  'offset-distance',
  'opacity',
  'visibility',
  'transform',
  '-webkit-transform',
  '-moz-transform',
  '-o-transform',
  '-ms-transform',
]);

/**
 * SeparateKeyframes - moves keyframes, media, and support from amp-custom
 * to amp-keyframes.
 *
 * This transformer supports the following options:
 *
 * - `minify [Boolean]`: compresses the CSS. The default is `true`.
 */
class SeparateKeyframes {
  constructor(config) {
    this.log_ = config.log.tag('SeparateKeyframes');
    if (config.minify === false) {
      this.stringifyOptions_ = OPTIONS_PRETTY_PRINT;
    } else {
      this.stringifyOptions_ = OPTIONS_COMPRESS;
    }
  }

  transform(tree) {
    const html = firstChildByTag(tree, 'html');
    if (!html) return;
    const head = firstChildByTag(html, 'head');
    if (!head) return;
    const body = firstChildByTag(html, 'body') || head;
    let stylesCustomTag;
    let stylesKeyframesTag;

    // Get style[amp-custom] and remove style[amp-keyframes]
    head.children = head.children.filter((tag) => {
      if (tag.tagName !== 'style') return true;

      if (!stylesKeyframesTag && hasAttribute(tag, 'amp-keyframes')) {
        stylesKeyframesTag = tag;
        return false;
      }
      if (!stylesCustomTag && hasAttribute(tag, 'amp-custom')) {
        stylesCustomTag = tag;
      }
      return true;
    });

    // If no custom styles, there's nothing to do
    if (!stylesCustomTag) return;
    let stylesText = stylesCustomTag.children[0];

    if (!stylesText || !stylesText.data) return;
    stylesText = stylesText.data;

    let cssTree;
    try {
      cssTree = css.parse(stylesText);
    } catch (e) {
      // css parser sometimes struggles with malformed css
      // print a warning, but don't fail the transformation
      this.log_.warn('Failed parsing css', e);
      return;
    }
    const keyframesTree = {
      type: 'stylesheet',
      stylesheet: {
        rules: [],
      },
    };

    const isInvalidKeyframe = (keyframe) => {
      let invalidProperty;
      for (const frame of keyframe.keyframes) {
        for (const declaration of frame.declarations) {
          if (!allowedKeyframeProps.has(declaration.property)) {
            invalidProperty = declaration.property;
            break;
          }
        }
        if (invalidProperty) break;
      }
      return invalidProperty;
    };

    cssTree.stylesheet.rules = cssTree.stylesheet.rules.filter((rule) => {
      if (rule.type === 'keyframes') {
        // We can't move a keyframe with an invalid property
        // or else the style[amp-keyframes] is invalid
        const invalidProperty = isInvalidKeyframe(rule);
        if (invalidProperty) {
          this.logInvalid(rule.name, invalidProperty);
          return true;
        }
        keyframesTree.stylesheet.rules.push(rule);
        return false;
      }
      // if rule has any keyframes duplicate rule and move just
      // the keyframes
      if (rule.type === 'media' || rule.type === 'supports') {
        const copiedRule = Object.assign({}, rule, {rules: []});
        rule.rules = rule.rules.filter((rule) => {
          if (rule.type !== 'keyframes') return true;
          const invalidProperty = isInvalidKeyframe(rule);
          if (invalidProperty) {
            this.logInvalid(rule.name, invalidProperty);
            return true;
          }
          copiedRule.rules.push(rule);
        });
        if (copiedRule.rules.length) {
          keyframesTree.stylesheet.rules.push(copiedRule);
        }
        // if no remaining rules remove it
        return rule.rules.length;
      }
      return true;
    });

    // if no rules moved nothing to do
    if (keyframesTree.stylesheet.rules.length === 0) {
      // re-serialize to compress the CSS
      stylesCustomTag.children[0].data = css.stringify(cssTree, this.stringifyOptions_);
      return;
    }

    if (!stylesKeyframesTag) {
      // Check body for keyframes tag, removing it if found
      body.children = body.children.filter((tag) => {
        if (tag.tagName === 'style' && hasAttribute(tag, 'amp-keyframes')) {
          stylesKeyframesTag = tag;
          return false;
        }
        return true;
      });

      if (!stylesKeyframesTag) {
        stylesKeyframesTag = createElement('style', {'amp-keyframes': ''});
      }
    }
    // Insert keyframes styles to Node
    const keyframesTextNode = stylesKeyframesTag.children[0];
    const currentKeyframesTree = css.parse(
        keyframesTextNode && keyframesTextNode.data || '',
    );
    currentKeyframesTree.stylesheet.rules = (
      keyframesTree.stylesheet.rules.concat(
          currentKeyframesTree.stylesheet.rules,
      )
    );
    const keyframesText = css.stringify(currentKeyframesTree, this.stringifyOptions_);

    if (!keyframesTextNode) {
      insertText(stylesKeyframesTag, keyframesText);
    } else {
      keyframesTextNode.data = keyframesText;
    }

    // Add keyframes tag to end of body
    body.children.push(stylesKeyframesTag);
    // Update stylesCustomTag with filtered styles
    stylesCustomTag.children[0].data = css.stringify(cssTree, this.stringifyOptions_);
  }
  logInvalid(name, property) {
    this.log_.warn(`Found invalid keyframe property '${
      property}' in '${name}' not moving to style[amp-keyframes]`);
  }
}

module.exports = SeparateKeyframes;
