import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import json from '@eslint/json'
import pluginVue from 'eslint-plugin-vue' // Import thêm plugin Vue
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    // Bỏ qua các thư mục build/system
    ignores: ['.nuxt/**', '.output/**', 'node_modules/**', 'dist/**', '.stitch/**', 'package-lock.json', 'tsconfig.json', '**/*.css'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    ...js.configs.recommended,
  },
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: config.files || ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
  })),
  ...pluginVue.configs['flat/recommended'].map(config => ({
    ...config,
    files: config.files || ['**/*.vue'],
  })),
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        process: 'readonly',
      },
      parserOptions: {
        parser: tseslint.parser,
        sourceType: 'module',
      },
    },
    rules: {
      'no-console': 'error',
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/valid-v-slot': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  { files: ['**/*.json'], plugins: { json }, language: 'json/json', extends: ['json/recommended'] },
])
