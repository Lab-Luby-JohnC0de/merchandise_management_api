import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

Route.where('id', Route.matchers.number())

Route.get('test_db_connections', async ({ response }: HttpContextContract) => {
  await Database.report().then(({ health }) => {
    const { healthy, message } = health
    if (healthy) return response.ok({ message })
    return response.status(500).json({ message })
  })
})

Route.group(() => {
  Route.resource('users/', 'UsersController').apiOnly()
  Route.post('login', 'AuthController.login')
}).prefix('v1/api')

//Routes for Authentication
Route.group(() => {
  Route.get('test', ({ response }) => response.ok({ message: 'Você foi autenticado com sucesso!' }))
})
  .prefix('v1/auth')
  .middleware(['auth', 'is:admin,client'])
