import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nextPayload } from '@payloadcms/next'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Products } from './collections/Products'
import { Categories } from './collections/Categories'
import { Reservations } from './collections/Reservations'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Products, Categories, Reservations, Media],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  serverURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  cors: [process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'],
  csrf: [process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'],
  upload: {
    limits: {
      fileSize: 5000000,
    },
  },
})
