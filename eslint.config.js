import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      ...react.configs.recommended.rules,
      // A. Turn off the base JS quote rule
      'quotes': 'off',

      // B. Enforce Single Quotes in TypeScript/JS
      '@typescript-eslint/quotes': [
        'error',
        'single',
        {
          'avoidEscape': true,
          'allowTemplateLiterals': true
        }
      ],

      // C. Enforce Double Quotes for JSX Attributes (React Standard)
      'jsx-quotes': ['error', 'prefer-double'],

      // Optional: React 17+ doesn't need React in scope
      'react/react-in-jsx-scope': 'off',
    }
  },
])
