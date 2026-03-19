import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fileURLToPath } from 'url'
import path from 'path'

import Users from './collections/Users'
import Tasks from './collections/Tasks'
import Milestones from './collections/Milestones'
import Notes from './collections/Notes'
import Spaces from './collections/Spaces'
import ShoppingRooms from './collections/ShoppingRooms'
import ShoppingItems from './collections/ShoppingItems'
import Expenses from './collections/Expenses'
import Photos from './collections/Photos'
import InventoryItems from './collections/InventoryItems'
import Utilities from './collections/Utilities'
import Projects from './collections/Projects'
import QuickLinks from './collections/QuickLinks'
import Media from './collections/Media'
import Property from './globals/Property'
import Contacts from './globals/Contacts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Shiloh Hub',
      favicon: '/favicon.ico',
    },
  },
  collections: [
    Users,
    Tasks,
    Milestones,
    Notes,
    Spaces,
    ShoppingRooms,
    ShoppingItems,
    Expenses,
    Photos,
    InventoryItems,
    Utilities,
    Projects,
    QuickLinks,
    Media,
  ],
  globals: [
    Property,
    Contacts,
  ],
  editor: lexicalEditor(),
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./shiloh-hub.db',
    },
  }),
  secret: process.env.PAYLOAD_SECRET || 'shiloh-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  cors: [
    process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:5173',
  ],
  csrf: [
    process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:5173',
  ],
})
