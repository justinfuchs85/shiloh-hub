import type { GlobalConfig } from 'payload'

const contactFields = (prefix: string, label: string) => [
  {
    name: `${prefix}Name`,
    type: 'text' as const,
    label: `${label} — Name`,
  },
  {
    name: `${prefix}Title`,
    type: 'text' as const,
    label: `${label} — Title`,
  },
  {
    name: `${prefix}Phone`,
    type: 'text' as const,
    label: `${label} — Phone`,
  },
  {
    name: `${prefix}Email`,
    type: 'text' as const,
    label: `${label} — Email`,
  },
  {
    name: `${prefix}Notes`,
    type: 'text' as const,
    label: `${label} — Notes`,
  },
]

const Contacts: GlobalConfig = {
  slug: 'contacts',
  label: 'Key Contacts',
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    // Listing Agent
    ...contactFields('la', 'Listing Agent'),
    // Buyer Agent
    ...contactFields('ba', "Buyer's Agent"),
    // Lender
    ...contactFields('lender', 'Lender'),
    // Home Inspector
    ...contactFields('inspector', 'Home Inspector'),
    // Title / Closing
    ...contactFields('title', 'Title / Closing'),
    // Attorney
    ...contactFields('attorney', 'Attorney'),
  ],
}

export default Contacts
