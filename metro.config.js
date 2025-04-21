const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  const {
    resolver: { assetExts, sourceExts },
  } = config;

  return {
    ...config,
    transformer: {
      ...config.transformer,
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
      // Añade el transformer de SVG
      babelTransformerPath: require.resolve("react-native-svg-transformer"),
      assetPlugins: ["expo-asset/tools/hashAssetFiles"],
    },
    resolver: {
      ...config.resolver,
      extraNodeModules: {
        ...config.resolver.extraNodeModules,
        react: path.resolve(__dirname, "./node_modules/react"),
      },
      // Excluye .svg de assetExts y agrégalo a sourceExts
      assetExts: assetExts.filter(ext => ext !== "svg").concat(["png", "jpg"]),
      sourceExts: [...sourceExts, "cjs", "svg"],
    },
  };
})();