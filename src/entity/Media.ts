import {
  Entity,
  ManyToOne,
  OneToOne,
  BaseEntity,
  PrimaryKeyType,
} from '@mikro-orm/core'

import { Application } from './Application'
import { StorageDocument } from './StorageDocument'

@Entity()
export class Media extends BaseEntity<Media, 'storageDocument'> {
  [PrimaryKeyType]?: string

  @OneToOne((type) => StorageDocument, (e) => e.media, { onDelete: 'CASCADE', owner: true, primary: true })
  storageDocument: StorageDocument

  @ManyToOne((type) => Application, { inversedBy: (e) => e.media, onDelete: 'CASCADE' })
  application: Application

  @OneToOne((type) => StorageDocument, (e) => e.media, { onDelete: 'SET NULL', owner: true, nullable: true })
  thumbDocument: StorageDocument | null
}
