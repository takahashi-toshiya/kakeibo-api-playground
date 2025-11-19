import { configApp } from '@adonisjs/eslint-config'

export default configApp({
  rules: {
    // ファイル名はPascalCaseを使用（プロジェクトの命名規則に合わせる）
    '@unicorn/filename-case': 'off',
  },
})
