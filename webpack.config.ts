const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const path = require("path");

module.exports = async function(env:any, argv:any) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Alias para que importaciones de react-native-svg apunten a react-native-svg-web en web
  config.resolve = config.resolve || {};
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    'react-native-svg': 'react-native-svg-web',
  };

  // Regla para importar .svg con SVGR
  config.module.rules.push({
    test: /\.svg$/,
    issuer: /\.[jt]sx?$/,
    use: ["@svgr/webpack"],
  });

  // Regla para cargar fuentes (ttf, otf) en web
  config.module.rules.push({
    test: /\.(ttf|otf)$/,
    use: {
      loader: require.resolve('file-loader'),
      options: {
        name: '[name].[hash:8].[ext]',
      },
    },
  });

  return config;
};