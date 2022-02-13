/*
 *   _______   ____  __________  ___
 *  / ___/ /  / __ \/ __/ __/  |/  /
 * / /__/ /__/ /_/ /\ \/ _// /|_/ /
 * \___/____/\____/___/___/_/  /_/
 *
 * Copyright (c) 2021 CLOSEM, inc
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * This file is subject to the terms and conditions defined in file 'LICENSE.md'
 * which is part of this source code package.
 *
 * File: StorageDocument.ts
 * Created Date: 02/27/2020
 * Author: Craig Betterly <craigbett@gmail.com>
 */

import {
  Entity,
  ManyToOne,
  OneToOne,
  BaseEntity,
  PrimaryKey,
  BigIntType,
} from '@mikro-orm/core'
import { generate } from '../snowflake'

import { Application } from './Application'
import { Media } from './Media'

@Entity()
export class StorageDocument extends BaseEntity<StorageDocument, 'id'> {
  @PrimaryKey({ type: BigIntType, autoincrement: false })
  id: string = generate()

  @ManyToOne((type) => Application, { inversedBy: (e) => e.storageDocuments, onDelete: 'CASCADE' })
  application: Application

  @OneToOne((type) => Media, (e) => e.storageDocument, { nullable: true })
  media: Media | null
}
