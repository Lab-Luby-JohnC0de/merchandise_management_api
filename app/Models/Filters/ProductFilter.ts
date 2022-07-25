import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Product from 'App/Models/Product'

export default class ProductFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Product, Product>

  public name(value: string) {
    this.$query.where('name', 'LIKE', `%${value}%`)
  }

  public code(value: string) {
    this.$query.where('code', 'LIKE', `%${value}%`)
  }
}
