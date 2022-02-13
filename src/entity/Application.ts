import {
  Entity,
  OneToMany,
  BaseEntity,
  PrimaryKey,
  Collection,
  BigIntType,
} from '@mikro-orm/core'

import { generate } from '../snowflake'

import { Media } from './Media'
import { StorageDocument } from './StorageDocument'

@Entity()
export class Application extends BaseEntity<Application, 'id'> {
  @PrimaryKey({ type: BigIntType, autoincrement: false })
  id: string = generate()

  @OneToMany((type) => Media, (e) => e.application)
  media = new Collection<Media>(this)

  @OneToMany((type) => StorageDocument, (e) => e.application)
  storageDocuments = new Collection<StorageDocument>(this)
}
