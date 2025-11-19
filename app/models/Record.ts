import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/User'
import Category from '#models/Category'

export default class Record extends BaseModel {
  /**
   * 主キー
   */
  @column({ isPrimary: true })
  declare id: number

  /**
   * ユーザーID
   */
  @column()
  declare userId: number

  /**
   * カテゴリID
   */
  @column()
  declare categoryId: number

  /**
   * 金額
   */
  @column()
  declare amount: number

  /**
   * 収入/支出
   */
  @column()
  declare type: 'income' | 'expense'

  /**
   * 取引日
   */
  @column.date()
  declare date: DateTime

  /**
   * メモ
   */
  @column()
  declare memo: string | null

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
   * リレーション: User（多対1）
   */
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  /**
   * リレーション: Category（多対1）
   */
  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>
}
