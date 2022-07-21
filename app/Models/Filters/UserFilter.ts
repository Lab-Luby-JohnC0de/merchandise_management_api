import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class UserFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof User, User>

  public name(value: string) {
    this.$query.where('name', 'LIKE', `%${value}%`)
  }

  public createdAt(value: string) {
    this.$query.where('created_at', 'LIKE', `%${value}%`)
  }

  public city(value: string) {
    this.$query.whereHas('addresses', (AddressModel) => {
      AddressModel.where('city', 'LIKE', `%${value}%`)
    })
  }

  public state(value: string) {
    this.$query.whereHas('addresses', (AddressModel) => {
      AddressModel.where('state', 'LIKE', `%${value}%`)
    })
  }
}
