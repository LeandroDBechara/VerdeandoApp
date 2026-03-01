/**
 * Configuración dinámica de Expo.
 * Para EAS Build: definir GOOGLE_MAPS_API_KEY como secret (eas secret:create)
 * Para desarrollo local: EXPO_PUBLIC_GOOGLE_MAPS_API_KEY en .env
 */
const baseConfig = require("./app.json");

const googleMapsApiKey =
  process.env.GOOGLE_MAPS_API_KEY || process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";

module.exports = {
  ...baseConfig,
  expo: {
    ...baseConfig.expo,
    scheme: "verdeandoapp",
    ios: {
      ...baseConfig.expo.ios,
      config: {
        ...baseConfig.expo.ios?.config,
        googleMapsApiKey: googleMapsApiKey || baseConfig.expo.ios?.config?.googleMapsApiKey,
      },
    },
    android: {
      ...baseConfig.expo.android,
      config: {
        ...baseConfig.expo.android?.config,
        googleMaps: {
          ...baseConfig.expo.android?.config?.googleMaps,
          apiKey: googleMapsApiKey || baseConfig.expo.android?.config?.googleMaps?.apiKey,
        },
      },
    },
  },
};
