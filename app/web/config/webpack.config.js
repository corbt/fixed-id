/** @returns {import('webpack').Configuration} Webpack Configuration */
module.exports = (config, { mode }) => {
  if (mode === 'development') {
    // Add dev plugin
  }

  // Load Markdown files as plain text. Used to load the whitepaper.
  // config.rules = [{ test: /\.md$/, use: 'raw-loader' }]
  // Add custom rules for your project
  config.module.rules.push({ test: /\.md$/, use: 'raw-loader' })

  // Add custom plugins for your project
  // config.plugins.push(YOUR_PLUGIN)

  return config
}
