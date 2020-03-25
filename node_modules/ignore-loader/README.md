# ignore-loader

To ignore certain files when building webpack application.

## Install

```
$ npm install --save-dev ignore-loader
```

## Usage (Ignoring all `.css`)

- In `webpack.config.js`

```js
module.exports = {
  // other configurations
  module: {
    loaders: [
      { test: /\.css$/, loader: 'ignore-loader' }
    ]
  }
};
```
