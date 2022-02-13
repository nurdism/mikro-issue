# not a bug, I messed up the relations

## Ref mismatch with multiple OneToOne relationships with the same Entity

**Describe the bug**
Ref mismatch with multiple OneToOne relationships with the same entity.

**To Reproduce**
I have made [a repo](https://github.com/nurdism/mikro-issue/tree/refmissmatch) to reproduce this to help debug:

## Entities:
```ts
@Entity()
export class Application extends BaseEntity<Application, 'id'> {
  @PrimaryKey({ type: BigIntType, autoincrement: false })
  id: string = generate()

  @OneToMany((type) => Media, (e) => e.application)
  media = new Collection<Media>(this)

  @OneToMany((type) => StorageDocument, (e) => e.application)
  storageDocuments = new Collection<StorageDocument>(this)
}

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

@Entity()
export class StorageDocument extends BaseEntity<StorageDocument, 'id'> {
  @PrimaryKey({ type: BigIntType, autoincrement: false })
  id: string = generate()

  @ManyToOne((type) => Application, { inversedBy: (e) => e.storageDocuments, onDelete: 'CASCADE' })
  application: Application

  @OneToOne((type) => Media, (e) => e.storageDocument, { nullable: true })
  media: Media | null
}
```

## Test:
```ts
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
```

## Output:
```
Application {
  id: '627698433487004256',
  media: Collection<Media> { initialized: true, dirty: false },
  storageDocuments: Collection<StorageDocument> { initialized: true, dirty: false }
}

StorageDocument {
  id: '627698433494451657', <-- media.storageDocument = StorageDocument<627698433494451657>
  application: Application {
    id: '627698433487004256',
    media: Collection<Media> { initialized: true, dirty: false },
    storageDocuments: Collection<StorageDocument> { '0': [StorageDocument], initialized: true, dirty: true }
  }
}

StorageDocument {
  id: '627698433504465500', <-- media.thumbDocument = StorageDocument<627698433504465500>
  application: Application {
    id: '627698433487004256',
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
    id: '627698433487004256',
    media: Collection<Media> { '0': [Media], initialized: true, dirty: true },
    storageDocuments: Collection<StorageDocument> {
      '0': [StorageDocument],
      '1': [StorageDocument],
      initialized: true,
      dirty: true
    }
  },
  storageDocument: StorageDocument { <-- media.storageDocument = StorageDocument<627698433494451657>  (Not OK)
    id: '627698433504465500',
    application: Application {
      id: '627698433487004256',
      media: [Collection<Media>],
      storageDocuments: [Collection<StorageDocument>]
    },
    media: Media {
      application: [Application],
      storageDocument: [StorageDocument],
      thumbDocument: [StorageDocument]
    }
  },
  thumbDocument: StorageDocument { <-- media.thumbDocument = StorageDocument<627698433504465500> (OK)
    id: '627698433504465500',
    application: Application {
      id: '627698433487004256',
      media: [Collection<Media>],
      storageDocuments: [Collection<StorageDocument>]
    },
    media: Media {
      application: [Application],
      storageDocument: [StorageDocument],
      thumbDocument: [StorageDocument]
    }
  }
}
[
  Media {
    storageDocument: Ref<StorageDocument> { id: '627698433504465500', media: [Media] }, <-- Refs are the same, they should be different
    thumbDocument: Ref<StorageDocument> { id: '627698433504465500', media: [Media] },
    application: Ref<Application> { id: '627698433487004256' }
  }
]
```
**Expected behavior**
I'd like the Refs for `storageDocument` and `thumbDocument` to reflect what is in the database.

I hope I've explained this well enough took me ages to debug and reproduce, let me know if you need any more info/context. I'd be willing to contribute some time to fix this but would need some guidance on where to look.

**Versions**
| Dependency | Version |
| - | - |
| node |  16.13.2 |
| typescript | 4.5.5 |
| mikro-orm | 5.0.0 |
| your-driver | pg |
