import User from '#models/User'

/**
 * ユーザーリポジトリ
 * ユーザー関連のデータアクセスを担当
 */
export default class UserRepository {
  /**
   * メールアドレスでユーザーを検索
   */
  async findByEmail(email: string): Promise<User | null> {
    return await User.findBy('email', email)
  }

  /**
   * IDでユーザーを検索
   */
  async findById(id: number): Promise<User | null> {
    return await User.find(id)
  }

  /**
   * ユーザー認証（認証ライブラリの機能をラップ）
   */
  async verifyCredentials(email: string, password: string): Promise<User> {
    return await User.verifyCredentials(email, password)
  }

  /**
   * Access Tokenを生成
   */
  async createAccessToken(
    user: User,
    name: string = 'mobile_app',
    expiresIn: string | number = '30 days'
  ) {
    return await User.accessTokens.create(user, ['*'], {
      name,
      expiresIn,
    })
  }
}

