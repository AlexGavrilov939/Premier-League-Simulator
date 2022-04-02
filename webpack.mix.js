const mix = require('laravel-mix');
const tailwindcss = require('tailwindcss');
const path = require('path');
require('laravel-mix-eslint-config');

const negativeRulesList = [
  new RegExp(/(\.(png|jpe?g|gif|webp)$|^((?!font).)*\.svg$)/).toString(),
];

const negativePluginsList = [
  // MiniCssExtractPlugin.constructor.name,
];

mix.extend('addWebpackLoaders', (webpackConfig, loaderRules) => {
  webpackConfig.module.rules = webpackConfig.module.rules.filter((rule) => ! negativeRulesList.includes(new RegExp(rule.test).toString()));

  loaderRules.forEach((loaderRule) => {
    webpackConfig.module.rules.push(loaderRule);
  });
});
mix.extend('addWebpackPlugins', (webpackConfig, plugins) => {
  webpackConfig.plugins = webpackConfig.plugins.filter((plugin) => ! negativePluginsList.includes(plugin.constructor.name));

  plugins.forEach((plugin) => {
    webpackConfig.plugins.push(plugin);
  });
});

mix
    .ts('resources/react/app.tsx', 'public/build/js')
    .eslint({
      enforce: 'pre',
      // test: ['js', 'jsx', 'ts', 'tsx'], // will convert to /\.(js|vue)$/ or you can use /\.(js|vue)$/ by itself.
      test: /\.(tsx?)$/,
      exclude: /(node_modules|\.js)$/, // will convert to regexp and work. or you can use a regular expression like /node_modules/,
      loader: 'eslint-loader',
      options: {
        fix: false,
        cache: false,
        // ...
      },
    })
    .react()
    .sass('resources/react/app.scss', 'public/build/css')
    .webpackConfig({
      context: path.resolve(__dirname, 'resources'),
      resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx'],
      },
    })
    .addWebpackLoaders([
      {
        test: /\.(png|svg|webp|gif|jpg|jpeg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'build/images/[name].[hash][ext]',
        },
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2)$/,
        generator: {
          filename: 'build/fonts/[name].[hash][ext]',
        },
      },
    ])
    .options({
      postCss: [tailwindcss('./tailwind.config.js')],
      hmrOptions: {
        host: 'localhost',
        port: '7001',
      },
    })
    .alias({
      '@': path.resolve(__dirname, 'resources/react'),
      '@components': path.join(__dirname, 'resources/react/components'),
      'ziggy': path.resolve('vendor/tightenco/ziggy/dist'),
    });

// mix.dump();
if (mix.inProduction()) {
  mix.version();
}
