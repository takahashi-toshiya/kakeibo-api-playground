import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/AuthService'
import { loginValidator } from '#validators/AuthValidator'

/**
 * 認証コントローラー
 * 認証関連のHTTPリクエストを処理
 */
export default class AuthController {
  /**
   * 認証サービス
   */
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  /**
   * ログイン（Access Token発行）
   * POST /v1/auth/tokens
   */
  async store({ request, response }: HttpContext) {
    // 1. バリデーション
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      // 2. サービス層を呼び出し（認証ロジック）
      const tokenData = await this.authService.login(email, password)

      // 3. レスポンス生成
      return response.ok({
        success: true,
        message: 'ログインに成功しました',
        data: tokenData,
      })
    } catch {
      // 認証失敗
      return response.unauthorized({
        success: false,
        message: '認証に失敗しました',
      })
    }
  }
}
