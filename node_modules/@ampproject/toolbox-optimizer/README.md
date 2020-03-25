# AMP Optimizer

[![npm version](https://badge.fury.io/js/%40ampproject%2Ftoolbox-optimizer.svg)](https://badge.fury.io/js/%40ampproject%2Ftoolbox-optimizer)
[![changelog](https://img.shields.io/badge/Changelog-2.0-%235500d7)](CHANGELOG.md)

AMP Optimizer is a tool to simplify creating AMP pages and improve AMP rendering performance. AMP Optimizer implements [AMP performance best practices](https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/optimize_amp?format=websites) and supports [AMP server-side-rendering](https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/server-side-rendering?format=websites). By default, it will perform the following optimizations:

* Server-side render AMP layouts.
* **Automatically import all missing AMP component scripts**.
* **Automaticallly add any missing mandatary AMP tags**.
* Remove the AMP boilerplate (when possible).
* Move CSS keyframe animations to the bottom of the page.
* Optimize AMP framework and custom font loading
* Generate CSP for inlined [`amp-script`](https://amp.dev/documentation/components/amp-script/) code.

The performance optimizations can improve page rendering times by up to 50%. You can read more about the potential performance gains in this [blog post](https://blog.amp.dev/2018/10/08/how-to-make-amp-even-faster/). To give it a try, check out [the online playground](https://toolbox-optimizer.glitch.me/).

**Good to know:**

* AMP Optimizer will produce valid AMP.
* AMP Optimizer can be used in combination with [AMP Packager](https://github.com/ampproject/amppackager) to create SXGs.

## Usage

Install via:

```
npm install @ampproject/toolbox-optimizer
```

Minimal usage:

```js
const AmpOptimizer = require('@ampproject/toolbox-optimizer');

const ampOptimizer = AmpOptimizer.create();

const originalHtml = `
<!doctype html>
<html ⚡>
  ...
</html>`;

ampOptimizer.transformHtml(originalHtml).then((optimizedHtml) => {
  console.log(optimizedHtml);
});
```

You can find a sample implementation [here](demo/simple/). If you're using express to serve your site, you can use the [AMP Optimizer Middleware](../optimizer-express).

### Incomplete markup

It's possible to pass incomplete documents and AMP Optimizer will add any 
missing tags and extension imports required by a valid AMP document. 

```
const originalHtml = `
  <h1>Hello World!</h1>
  <amp-twitter width="375" 
               height="472" 
               layout="responsive" 
               data-tweetid="1182321926473162752">
  </amp-twitter>
`;

// you can pass the canonical URL, default is `.`
const opts = {
  canonical: '/example.html'
}
ampOptimizer.transformHtml(originalHtml, params).then((optimizedHtml) => {
  // optimizedHtml will be a valid AMP document
  console.log(optimizedHtml);
});
```

### Markup support

AMP Optimizer supports converting Markdown to AMPHTML. A typical conversion flow would be:

```
README.md => HTML => AMP Optimizer => valid AMP
```

The AMP Optimizer converts `<img>` tags into `<amp-img>` or `<amp-anim>` tags when in Markdown mode. Enable Markdown mode via `markdown : true`. AMP Optimizer will try to resolve image dimensions from the actual files. Images wider than 320px will automatically get an `intrinsic` layout.

All other Markdown features are already supported by AMP.

You can pass an additional option `imageBasePath` to specify a base path used to resolve an image during build, this can be a file system path or URL prefix.

**Important:** for image size detection to work, an optional dependency
`probe-image-size` needs to be installed via NPM.

```
npm install probe-image-size --save-dev
```

Example:

```
const AmpOptimizer = require('@ampproject/toolbox-optimizer');
const md = require('markdown-it')({
  // don't sanitize html if you want to support AMP components in Markdown
  html: true,
});

// enable markdown mode
const ampOptimizer = AmpOptimizer.create({
  markdown: true,
});

const markdown = `
# Markdown 🤯

Here is an image declared in Markdown syntax: 

![A random image](https://unsplash.it/800/600).

You can directly declare AMP components:

<amp-twitter width="375" 
             height="472" 
             layout="responsive" 
             data-tweetid="1182321926473162752">
</amp-twitter>

Any missing extensions will be automatically imported.
`;

const html = md.render(markdown);

const amphtml = await ampOptimizer.transformHtml(html, {
  canonical: filePath,
});
```

You can find a working sample [here](demo/markdown/).

### Custom transformations

AMP Optimizer supports custom HTML transformations:

```
const AmpOptimizer = require('@ampproject/toolbox-optimizer');
const {createElement, firstChildByTag, appendChild} = AmpOptimizer.NodeUtils;

class CustomTransformer {
  constructor(config) {
    this.log_ = config.log.tag('CUSTOM');
  }
  transform(tree, params) {
    this.log_.info('Running custom transformation for ', params.filePath);
    const html = firstChildByTag(tree, 'html');
    if (!html) return;
    const head = firstChildByTag(html, 'head');
    if (!head) return;
    const desc = createElement('meta', {
      name: 'description',
      content: 'this is just a demo',
    });
    appendChild(head, desc);
  }
}

// it's best to run custom transformers first
const customTransformations = [CustomTransformer, ...AmpOptimizer.TRANSFORMATIONS_AMP_FIRST];

// pass custom transformers when creating the optimizer
const optimizer = AmpOptimizer.create({
  transformations: customTransformations,
});
// you can add custom parameters on a per document basis
const transformedHtml = await optimizer.transformHtml(html, {
  filePath,
});
```

Checkout [the samples](demo/simple/index.js) to learn how to customize AMP Optimizer.

### CLI

There's also a [command line version](../cli/README.md) available:

```shell
$ npx @ampproject/toolbox-cli myFile.html
```

## Why doesn't my AMP page render faster?

The biggest performance gain results from [removing the AMP boilerplate code](https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/server-side-rendering/#why-is-it-faster?). However, under some circumstances it's not possible to remove the boilerplate code:

* if the`amp-experiment`, `amp-story` or `amp-dynamic-css-classes` components are used ([code](https://github.com/ampproject/amphtml/blob/62a9eab084ccd800d80a371e2cb29cd4f9e8576a/src/render-delaying-services.js#L39-L43)).
* if an AMP component uses the `media`, `sizes` or `heights` attribute ([documentation](https://amp.dev/documentation/guides-and-tutorials/learn/common_attributes/?format=websites#heights)). A simple workaround is to replace the `media`, `sizes` or `heights` attributes with normal CSS media queries.

To find out, why the AMP boilerplate could not be removed, enable `verbose` mode:

```
// globally
const optimizer = ampOptimizer.create({
  verbose: true
} );
```

... or for individual pages:

```
// per transformation
ampOptimizer.transformHtml(originalHtml, {
  verbose: true
})
```

## Best Practices

### Transform AMP pages at build time if possible

Applying the transformations to an AMP file consumes additional server resources. Also, since the entire file is needed to apply the transformations, it also becomes impossible to stream the response while applying it. In order to avoid server overhead, if the set of AMP files to be transformed is known in advance, transformations should be run at build time.

### Cache transformed AMPs at runtime

Most websites have a more dynamic nature though and are not able to apply the transformations statically. For such cases it is possible to run the transformations after AMP pages are rendered, e.g. in an Express middleware. In that case, to achieve best performance, it's best to cache transformed pages for subsequent requests. Caching can take place on the CDN level, on the site's internal infrastructure (eg: Memcached), or even on the server itself, if the set of pages is small enough to fit in memory.

### Regenerate pages at least once a week

AMP Optimizer inlines CSS styles required by AMP. To make sure, that the inlined CSS stays in sync with the latest AMP release, we recommend to re-generate pages at least once a weekOut-of-sync CSS will not break your page, but it could theoretically cause AMP components to briefly appear with the "wrong" styles, such as being visible when they should be hidden. The good news is that these glitches will only be temporary, because as soon as the AMP JS starts, it will check the inlined CSS and update it if required.

## Experimental Features

**Warning: these features are experimental and might result in invalid AMP pages.**

### Paired AMP

When using experimental features resulting in invalid AMP it's best to setup paired AMP mode. Paired AMP mode will add `<link rel=amphtml href=${ampUrl}>` to the transformed page, were `ampUrl` needs to point to the valid version of this page.

Example:

```
const optimizer = AmpOptimizer.create({
  transformations: AmpOptimizer.TRANSFORMATIONS_PAIRED_AMP,
});
const ampFilePath = filePath.substring(1, filePath.length)
    .replace('.html', '.amp.html');
const transformedHtml = await optimizer.transformHtml(html, {
  // needed to calculate the `<link rel=amphtml href=${ampUrl}>`
  ampUrl: ampFilePath,
});
```

### Versioned AMP Runtime

The `ampRuntimeVersion` parameter will rewrite all AMP runtime and extension imports to the specified version. For example:

```
https://cdn.ampproject.org/v0.js
```

will be replaced with:

```
https://cdn.ampproject.org/rtv/001515617716922/v0.js
```

Versioning the AMP runtime URLs has one main benefit: versioned AMP runtime URLs are served with a longer max-age than the unversioned ones. This means AMP pages served with versioned AMP runtime benefit from better browser caching.

**Important:** when using versioned AMP runtime URLs make sure to invalidate all caches whenever a new AMP runtime is released. This is to ensure that your AMP pages always use the latest version of the AMP runtime.

You can use [@ampproject/toolbox-runtime-version](../@ampproject/toolbox-runtime-version) to retrieve the latest version of the AMP runtime. Here is a sample to apply the optimizations including versioning the URLs:

```
const ampOptimizer = require('@ampproject/toolbox-optimizer');
const ampRuntimeVersion = await runtimeVersion.currentVersion();

// The input string
const originalHtml = `
<!doctype html>
<html ⚡>
...
`

// Additional options can be passed as the second argument
const optimizedHtml = await ampOptimizer.transformHtml(originalHtml, {
  ampUrl: 'canonical.amp.html',
  ampRuntimeVersion: ampRuntimeVersion
});

console.log(optimizedHtml);
```

### Blurry image placeholders

Add placeholders for `amp-img` and `amp-video` posters. The placeholders are blurry versions of the corresponding original source. The blur will be displayed as the `<amp-img>` is rendering, and will fade out once the element is loaded. The current requirements of appending a blurry placeholder is for the element is to be a JPEG that is either responsive or a poster for an `amp-video`.

**Important: blurry image placeholder computation is computationally expensive. Make sure to only use it for static or cached pages.**

This transformer supports the following options:

* `blurredPlaceholders`: Enables blurry image placeholder generation. Default is `false`.
* `imageBasePath`: specifies a base path used to resolve an image during build.
* `maxBlurredPlaceholders`: Specifies the max number of blurred images. Defaults to 5.
* `blurredPlaceholdersCacheSize`: Specifies the max number of blurred images to be cached
  to avoid expensive recalculation. Set to 0 if caching should be disabled. Set to -1 if
  all placeholders should be cached (good for static sites). Defaults to 30.

Usage:

```
const optimizer = AmpOptimizer.create({
  // blurry image placeholders are currently not considered valid AMP
  // hence it's recommended to setup paired AMP mode when enabling this feature.
  transformations: AmpOptimizer.TRANSFORMATIONS_PAIRED_AMP,
  blurredPlaceholders: true,
});
```

### Self-hosted AMP components

It's possible to rewrite the AMP framework and component imports to a different domain than `cdn.ampproject.org`.

Example:
```
const ampOptimizer = require('@ampproject/toolbox-optimizer');

// The input string
const originalHtml = `
<!doctype html>
<html ⚡>
...
`

// Additional options can be passed as the second argument
const optimizedHtml = await ampOptimizer.transformHtml(originalHtml, {
  ampUrl: 'canonical.amp.html',
  // this will rewrite https://cdn.ampproject.org/v0.js to /amp/v0.js
  ampUrlPrefix: '/amp'
});

console.log(optimizedHtml);
```

## Development & Testing

AMP Optimizer uses a snapshot based testing approach. To execute the tests, run in the project root:

```
$ npm run test:node
```

Transformer tests are located in:

```
- spec/transformers/valid/TransformerName/test-name/
    expected_output.html
    input.html
```

The transformation input is defined in `input.html`, whereas `expected_output.html` contains the expected
outcome of the transformation. Don't edit `expected_output.html` manually, instead, after changing 
a transformer implementation, run: 

```
$ npm run test:optimizer:snapshot
```

to store a new snapshot version in `expected_output.html`. 


