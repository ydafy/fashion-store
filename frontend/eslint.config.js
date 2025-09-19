// eslint.config.js
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactNative from 'eslint-plugin-react-native';

export default [
  // 1. Configuración global para todos los archivos
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      // Definimos el parser para TypeScript
      parser: tseslint.parser,
      // Definimos las variables globales disponibles (navegador, Node, ES2021)
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      }
    },
    // Usamos las reglas recomendadas de React
    plugins: {
      react: pluginReact
    },
    settings: {
      react: {
        version: 'detect' // Detecta automáticamente la versión de React
      }
    }
  },

  // 2. Reglas recomendadas de ESLint y TypeScript
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 3. Reglas específicas para React
  {
    plugins: {
      'react-hooks': pluginReactHooks,
      'react-native': pluginReactNative
    },
    rules: {
      // Aplicamos las reglas recomendadas de React Hooks
      ...pluginReactHooks.configs.recommended.rules,

      // Reglas de React Native (puedes añadir más si quieres)
      'react-native/no-unused-styles': 2,
      'react-native/split-platform-components': 2,
      'react-native/no-inline-styles': 1, // '1' es warning, '2' es error
      'react-native/no-color-literals': 1,
      'react-native/no-raw-text': 2
    }
  }
];
