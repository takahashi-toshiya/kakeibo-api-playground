import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Record from '#models/Record'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  /**
   * 主キー
   */
  @column({ isPrimary: true })
  declare id: number

  /**
   * 氏名
   */
  @column()
  declare fullName: string | null

  /**
   * メールアドレス
   */
  @column()
  declare email: string

  /**
   * パスワード（ハッシュ化）
   */
  @column({ serializeAs: null })
  declare password: string

  /**
   * 作成日時
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  /**
   * 更新日時
   */
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  /**
   * リレーション: Records（1対多）
   */
  @hasMany(() => Record)
  declare records: HasMany<typeof Record>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
