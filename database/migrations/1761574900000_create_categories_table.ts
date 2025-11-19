import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateCategories extends BaseSchema {
  protected tableName = 'categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.string('name', 100).notNullable()
      table.enum('type', ['income', 'expense']).notNullable()
      table.string('color', 7).nullable()
      table.string('icon', 50).nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
