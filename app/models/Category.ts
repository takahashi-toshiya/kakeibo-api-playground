import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Record from '#models/Record'

export default class Category extends BaseModel {
  /**
   * 主キー
   */
  @column({ isPrimary: true })
  declare id: number

  /**
   * カテゴリ名
   */
  @column()
  declare name: string

  /**
   * 収入/支出
   */
  @column()
  declare type: 'income' | 'expense'

  /**
   * カラーコード
   */
  @column()
  declare color: string | null

  /**
   * アイコン名
   */
  @column()
  declare icon: string | null

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
}
