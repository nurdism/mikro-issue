import type { Options } from '@mikro-orm/core'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'

import { Application } from './entity/Application'
import { Media } from './entity/Media'
import { StorageDocument } from './entity/StorageDocument'

const config: Options<PostgreSqlDriver> = {
  driver: PostgreSqlDriver,
  type: 'postgresql',
  entities: [Application, Media, StorageDocument],
  clientUrl: 'postgres://test:test@workspace:5432/test',
}

export default config
