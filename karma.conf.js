module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],

    // Archivos de test
    files: [
      'src/test/unit/**/*.test.js'
    ],

    // Excluir lo que no quieres ejecutar
    exclude: [
      'src/**/*.test.jsx',
      'src/**/*.test.ts',
      'src/**/*.test.tsx',
      'src/App.test.js',
      'src/components/**/*.test.js'
    ],

    preprocessors: {
      'src/test/unit/**/*.test.js': ['webpack']
    },

    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: { presets: ['@babel/preset-env'] }
            }
          }
        ]
      },
      resolve: { extensions: ['.js'] }
    },

    // Edge real con ventana visible
    customLaunchers: {
      EdgeCustom: {
        base: 'Edge',
        flags: ['--no-sandbox'],
        executable: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe' // Ajusta según tu instalación
      }
    },
    browsers: ['EdgeCustom'],

    reporters: ['progress'],
    plugins: [
      'karma-jasmine',
      'karma-webpack',
      require('@chiragrupani/karma-chromium-edge-launcher')
    ],

    autoWatch: true,
    singleRun: false,
    logLevel: config.LOG_INFO,
    colors: true,
    browserNoActivityTimeout: 60000
  });
};
