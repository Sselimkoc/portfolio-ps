//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  {
    ignores: [
      'eslint.config.js',
      'prettier.config.js',
      'node_modules/**',
      '.output/**',
      'dist/**',
      'scripts/**',
    ],
  },
  ...tanstackConfig,
]
