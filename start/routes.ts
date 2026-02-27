/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Auth API
const AuthController = () => import('#controllers/AuthController')
router.group(() => {
  router.post('/tokens', [AuthController, 'store'])
}).prefix('/v1/auth')
