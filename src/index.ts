import config from './config'
import 'reflect-metadata'

import { MikroORM } from '@mikro-orm/core'

import { Application } from './entity/Application'
import { StorageDocument } from './entity/StorageDocument'
import { Media } from './entity/Media'

(async () => {
const orm = await MikroORM.init(config)
let em = orm.em.fork()

const application = new Application()
console.log(application)

const storageDocument = new StorageDocument()
storageDocument.application = application
console.log(storageDocument)

const thumbDocument = new StorageDocument()
thumbDocument.application = application
console.log(thumbDocument)

const media = new Media()
media.assign({
  application,
  storageDocument,
  thumbDocument
}, { em })

console.log(media)

await em.persistAndFlush(media)
em = em.fork()

const find = await em.createQueryBuilder(Media).select('*').where({ application }).getResult()
console.log(find)

  process.exit(0)
})();

/*
Application {
  id: '627716775578559332',
  media: Collection<Media> { initialized: true, dirty: false },
  storageDocuments: Collection<StorageDocument> { initialized: true, dirty: false }
}
StorageDocument {
  id: '627716775581055991',
  application: Application {
    id: '627716775578559332',
    media: Collection<Media> { initialized: true, dirty: false },
    storageDocuments: Collection<StorageDocument> { '0': [StorageDocument], initialized: true, dirty: true }
  }
}
StorageDocument {
  id: '627716775592608955',
  application: Application {
    id: '627716775578559332',
    media: Collection<Media> { initialized: true, dirty: false },
    storageDocuments: Collection<StorageDocument> {
      '0': [StorageDocument],
      '1': [StorageDocument],
      initialized: true,
      dirty: true
    }
  }
}
Media {
  application: Application {
    id: '627716775578559332',
    media: Collection<Media> { '0': [Media], initialized: true, dirty: true },
    storageDocuments: Collection<StorageDocument> {
      '0': [StorageDocument],
      '1': [StorageDocument],
      initialized: true,
      dirty: true
    }
  },
  storageDocument: StorageDocument {
    id: '627716775581055991',
    application: Application {
      id: '627716775578559332',
      media: [Collection<Media>],
      storageDocuments: [Collection<StorageDocument>]
    },
    media: Media {
      application: [Application],
      storageDocument: [StorageDocument],
      thumbDocument: [StorageDocument]
    }
  },
  thumbDocument: StorageDocument {
    id: '627716775592608955',
    application: Application {
      id: '627716775578559332',
      media: [Collection<Media>],
      storageDocuments: [Collection<StorageDocument>]
    },
    mediaThumb: Media {
      application: [Application],
      storageDocument: [StorageDocument],
      thumbDocument: [StorageDocument]
    }
  }
}
[
  Media {
    storageDocument: Ref<StorageDocument> { id: '627716775581055991', media: [Media] },
    application: Ref<Application> { id: '627716775578559332' },
    thumbDocument: Ref<StorageDocument> { id: '627716775592608955', mediaThumb: [Media] }
  }
]
*/

