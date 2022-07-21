import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

Route.get('test_db_connections', async ({ response }: HttpContextContract) => {
  await Database.report().then(({ health }) => {
    const { healthy, message } = health
    if (healthy) return response.ok({ message })
    return response.status(500).json({ message })
  })
})

// Public Routes Group
Route.group(() => {
  Route.post('login', 'AuthController.login')
  Route.post('users', 'UsersController.store')
}).prefix('v1/api')

//Private Routes for Authentication Group
Route.group(() => {
  Route.resource('users/', 'UsersController').except(['store'])
  Route.resource('users/', 'UsersController').except(['store', 'index', 'destroy'])
})
  .prefix('v1/api')
  .middleware(['auth', 'is:client'])

// Private Routes for Admin Group
Route.group(() => {
  Route.resource('users/', 'UsersController').only(['index', 'destroy'])
})
  .prefix('v1/api')
  .middleware(['auth', 'is:admin'])
