const webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'src/**/*.test.js',
      'src/**/*.test.jsx',
      'src/**/*.test.ts',
      'src/**/*.test.tsx',
    ],
    preprocessors: {
      'src/**/*.test.js': ['webpack'],
      'src/**/*.test.jsx': ['webpack'],
      'src/**/*.test.ts': ['webpack'],
      'src/**/*.test.tsx': ['webpack'],
    },
    webpack: {
      ...webpackConfig,
      mode: 'development',
      resolve: {
        ...(webpackConfig.resolve || {}),
        alias: {
          ...(webpackConfig.resolve?.alias || {})
        }
      }
    },
    browsers: ['Edge'], // 👈 ahora sí funciona con msedge.exe
    reporters: ['progress'],
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: process.env.CI === 'true',
    concurrency: Infinity,
    plugins: [
      'karma-jasmine',
      'karma-webpack',
      require('@chiragrupani/karma-chromium-edge-launcher') // 👈 usa este
    ]
  });
};