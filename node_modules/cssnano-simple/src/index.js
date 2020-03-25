const postcss = require('postcss')
const createSimplePreset = require('cssnano-preset-simple')

function initializePlugin(plugin, css, result) {
  if (Array.isArray(plugin)) {
    const [processor, opts] = plugin

    if (
      typeof opts === 'undefined' ||
      (typeof opts === 'object' && !opts.exclude) ||
      (typeof opts === 'boolean' && opts === true)
    ) {
      return Promise.resolve(processor(opts)(css, result))
    }
  } else {
    return Promise.resolve(plugin()(css, result))
  }

  return Promise.resolve()
}

module.exports = postcss.plugin('cssnano-simple', () => {
  const preset = createSimplePreset()
  return (css, result) => {
    return preset.plugins.reduce((promise, plugin) => {
      return promise.then(initializePlugin.bind(null, plugin, css, result))
    }, Promise.resolve())
  }
})
