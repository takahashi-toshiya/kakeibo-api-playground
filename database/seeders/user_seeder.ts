import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/User'

export default class extends BaseSeeder {
  async run() {
    /**
     * テストユーザーを作成
     */
    await User.create({
      email: 'test@example.com',
      password: 'password123',
      fullName: 'テストユーザー',
    })
  }
}
