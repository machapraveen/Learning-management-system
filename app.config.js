export default {
  expo: {
    name: 'bolt-expo-nativewind',
    slug: 'bolt-expo-nativewind',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    extra: {
      GEMINI_API_KEY: 'AIzaSyCUZqvYKDs5of6yk6E2PerwzbeJ8sh-AVM', // Make sure the key is valid
    },
    ios: {
      supportsTablet: true,
    },
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/images/favicon.png',
    },
    plugins: ['expo-router'],
    experiments: {
      typedRoutes: true,
    },
  },
};
