import vine from '@vinejs/vine'

/**
 * ログイン用バリデーター
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)
