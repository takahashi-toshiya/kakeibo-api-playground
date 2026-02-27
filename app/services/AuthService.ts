import UserRepository from '#repositories/UserRepository'

/**
 * 認証サービス
 * 認証関連のビジネスロジックを担当
 */
export default class AuthService {
  /**
   * ユーザーリポジトリ
   */
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  /**
   * ログイン（ユーザー認証とAccess Token発行）
   */
  async login(email: string, password: string) {
    // 1. ユーザー認証
    const user = await this.userRepository.verifyCredentials(email, password)

    // 2. Access Tokenを生成（有効期限: 30日）
    const token = await this.userRepository.createAccessToken(user, 'mobile_app', '30 days')

    // 3. レスポンス用データを返却
    return {
      type: 'bearer',
      token: token.value!.release(),
      expires_at: token.expiresAt,
    }
  }
}
