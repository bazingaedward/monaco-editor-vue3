import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

export default [
  js.configs.recommended,
  ...vue.configs['flat/essential'],
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      vue,
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      ...vue.configs['vue3-essential'].rules,
      'vue/multi-word-component-names': 'off',
      'vue/no-multiple-template-root': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'docs/.vitepress/cache/**', 'docs/.vitepress/dist/**', '*.d.ts'],
  },
];
