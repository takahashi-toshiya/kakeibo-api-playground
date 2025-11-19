import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateRecords extends BaseSchema {
  protected tableName = 'records'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.bigInteger('user_id').unsigned().notNullable()
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')

      table.bigInteger('category_id').unsigned().notNullable()
      table.foreign('category_id').references('id').inTable('categories').onDelete('CASCADE')

      table.decimal('amount', 10, 2).notNullable()
      table.enum('type', ['income', 'expense']).notNullable()
      table.date('date').notNullable()
      table.text('memo').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()

      table.index('user_id')
      table.index('category_id')
      table.index('date')
      table.index(['user_id', 'date'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
