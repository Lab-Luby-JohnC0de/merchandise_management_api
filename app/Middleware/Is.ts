import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from '../Models/User'

export default class Is {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    guards?: string[]
  ) {
    const userId = await auth.user?.id
    let isNext = false

    if (userId && guards) {
      const user = await User.query().where('id', userId).preload('roles').first()
      const userJson = user?.serialize()
      userJson?.roles?.forEach(({ name }: { name: string }) => {
        guards.forEach((nameRoleGuards) => {
          if (name.toLowerCase() === nameRoleGuards.toLowerCase()) {
            isNext = true
          }
        })
      })
    }

    if (isNext) return next()

    return response.forbidden({ message: 'voce não tem permissão para acessar este recurso' })
  }
}
