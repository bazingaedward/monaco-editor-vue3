module.exports = {
  presets: [
    [
      '@babel/env',
    ],
  ],
  plugins: [
    '@babel/proposal-class-properties',
  ],
  "env": {
    "test": {
      "plugins": ["@babel/plugin-transform-modules-commonjs"]
    }
}
}
