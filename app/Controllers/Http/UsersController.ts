import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    const email = Env.get('E_MAIL')
    response.ok({ message: 'Lista todos usuários!', email })
  }

  public async store({ response }: HttpContextContract) {
    response.ok({ message: 'Cadastra um usuário!' })
  }

  public async show({ response }: HttpContextContract) {
    response.ok({ message: 'Mostra um usuário!' })
  }

  public async update({ response }: HttpContextContract) {
    response.ok({ message: 'Altera um usuário!' })
  }

  public async destroy({ response }: HttpContextContract) {
    response.ok({ message: 'Apaga um usuário!' })
  }
}
