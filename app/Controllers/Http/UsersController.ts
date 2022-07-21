import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Address from 'App/Models/Address'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
import StoreValidator from 'App/Validators/User/StoreValidator'
import UpdateValidator from 'App/Validators/User/UpdateValidator'

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    response.status(200).json({ message: 'Success' })
  }

  public async store({ response, request }: HttpContextContract) {
    await request.validate(StoreValidator)

    const bodyUser = request.only(['name', 'cpf', 'email', 'password'])
    const bodyAddress = request.only([
      'zipCode',
      'state',
      'city',
      'street',
      'district',
      'number',
      'complement',
    ])

    let userCreated

    const trx = await Database.beginGlobalTransaction()

    try {
      userCreated = await User.create(bodyUser, trx)
      const roleClient = await Role.findBy('name', 'client')
      if (roleClient) await userCreated.related('roles').attach([roleClient.id], trx)
    } catch (error) {
      trx.rollback()
      return response.badRequest({ message: 'Error in create user', originalError: error.message })
    }

    try {
      await userCreated.related('addresses').create(bodyAddress)
    } catch (error) {
      trx.rollback()
      return response.badRequest({
        message: 'Error in create address',
        originalError: error.message,
      })
    }

    let userFind
    try {
      userFind = await User.query()
        .where('id', userCreated.id)
        .preload('roles')
        .preload('addresses')
    } catch (error) {
      trx.rollback()
      return response.badRequest({
        message: 'Error in find user',
        originalError: error.message,
      })
    }

    trx.commit()

    return response.ok({ userFind })
  }

  public async show({ response }: HttpContextContract) {
    response.ok({ message: 'Mostrar um usuário' })
  }

  public async update({ response, request, params }: HttpContextContract) {
    await request.validate(UpdateValidator)

    const userSecureId = params.id
    const bodyUser = request.only(['name', 'cpf', 'email', 'password'])
    const bodyAddress = request.only([
      'addressId',
      'zipCode',
      'state',
      'city',
      'street',
      'district',
      'number',
      'complement',
    ])

    let userUpdated

    const trx = await Database.beginGlobalTransaction()

    try {
      userUpdated = await User.findByOrFail('secure_id', userSecureId)

      userUpdated.useTransaction(trx)

      await userUpdated.merge(bodyUser).save()
    } catch (error) {
      trx.rollback()
      return response.badRequest({ message: 'Error in update user', originalError: error.message })
    }

    try {
      const addressesUpdated = await Address.findByOrFail('id', bodyAddress.addressId)

      addressesUpdated.useTransaction(trx)

      delete bodyAddress.addressId

      await addressesUpdated.merge(bodyAddress).save()
    } catch (error) {
      trx.rollback()
      return response.badRequest({
        message: 'Error in update address',
        originalError: error.message,
      })
    }

    let userFind
    try {
      userFind = await User.query()
        .where('id', userUpdated.id)
        .preload('roles')
        .preload('addresses')
    } catch (error) {
      trx.rollback()
      return response.badRequest({
        message: 'Error in find user',
        originalError: error.message,
      })
    }

    trx.commit()

    return response.ok({ userFind })
  }

  public async destroy({ response }: HttpContextContract) {
    response.ok({ message: 'Apagar um usuário' })
  }
}
