module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@screens': './src/screens',
          '@components': './src/components',
          '@navigation': './src/navigation',
          '@services': './src/services',
          '@hooks': './src/hooks',
          '@utils': './src/utils',
          '@assets': './src/assets',
          '@app-types': './src/types',
          '@contexts': './src/contexts',
          '@theme': './src/theme',
        },
      },
    ],
  ],
};
