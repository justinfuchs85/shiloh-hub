// Shared types matching Payload CMS collections

export interface PayloadDoc {
  id: string | number
  createdAt?: string
  updatedAt?: string
}

export interface PayloadListResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface Task extends PayloadDoc {
  title: string
  detail?: string
  due?: string
  assignee?: '' | 'Justin' | 'Natalie'
  phase: '0' | '1' | '2' | '3' | '4'
  done: boolean
  order: number
}

export interface Milestone extends PayloadDoc {
  label: string
  date: string
  type: 'key' | 'deadline' | 'done'
  order: number
}

export interface Space extends PayloadDoc {
  name: string
  order: number
}

export interface Note extends PayloadDoc {
  title?: string
  body: string
  author: 'Justin' | 'Natalie'
  space?: Space | number | string
  image?: MediaFile | number | string
  createdAt: string
}

export interface ShoppingRoom extends PayloadDoc {
  name: string
  order: number
}

export interface ShoppingItem extends PayloadDoc {
  name: string
  room: ShoppingRoom | number | string
  priority: 'Must have' | 'Nice to have' | 'Someday'
  status: 'Need to buy' | 'Ordered' | 'Delivered' | 'Done'
  store?: string
  priceEst?: string
  priceActual?: string
  dims?: string
  qty: number
  assignee?: '' | 'Justin' | 'Natalie'
  link?: string
  image?: string
  notes?: string
  done: boolean
  order: number
}

export interface Expense extends PayloadDoc {
  description: string
  est?: string
  actual?: string
  order: number
}

export interface Photo extends PayloadDoc {
  url?: string
  media?: MediaFile | number | string
  caption?: string
  category: string
  order: number
}

export interface InventoryItem extends PayloadDoc {
  title: string
  status: 'Undecided' | 'Keep' | 'Sell' | 'Donate' | 'Trash'
  owner: 'Justin' | 'Natalie' | 'Both'
  space?: Space | number | string
  duplicate: boolean
  notes?: string
  photo?: MediaFile | number | string
}

export interface Utility extends PayloadDoc {
  type: string
  provider?: string
  phone?: string
  website?: string
  account?: string
  username?: string
  cost?: string
  status: 'Not set up' | 'Transfer in progress' | 'Active' | 'Cancelled'
  notes?: string
  order: number
}

export interface Subtask {
  id?: string
  label: string
  done: boolean
}

export interface Project extends PayloadDoc {
  name: string
  category: string
  priority: 'before-move' | 'soon' | 'someday'
  status: 'planning' | 'progress' | 'complete'
  costEst?: string
  contractor?: string
  notes?: string
  done: boolean
  subtasks?: Subtask[]
  order: number
}

export interface QuickLink extends PayloadDoc {
  label: string
  url: string
  order: number
}

export interface MediaFile extends PayloadDoc {
  url: string
  filename: string
  alt?: string
  sizes?: {
    thumbnail?: { url: string; width: number; height: number }
    card?: { url: string; width: number; height: number }
  }
}

// Globals
export interface PropertyGlobal {
  address?: string
  mlsNumber?: string
  status?: string
  offerPrice?: number
  listPrice?: number
  sqft?: number
  beds?: number
  bathsFull?: number
  bathsHalf?: number
  annualTaxes?: number
  listingDescription?: string
  highlights?: { text: string; id?: string }[]
  heroImages?: { url: string; alt?: string; id?: string }[]
}

export interface ContactsGlobal {
  laName?: string; laTitle?: string; laPhone?: string; laEmail?: string; laNotes?: string
  baName?: string; baTitle?: string; baPhone?: string; baEmail?: string; baNotes?: string
  lenderName?: string; lenderTitle?: string; lenderPhone?: string; lenderEmail?: string; lenderNotes?: string
  inspectorName?: string; inspectorTitle?: string; inspectorPhone?: string; inspectorEmail?: string; inspectorNotes?: string
  titleName?: string; titleTitle?: string; titlePhone?: string; titleEmail?: string; titleNotes?: string
  attorneyName?: string; attorneyTitle?: string; attorneyPhone?: string; attorneyEmail?: string; attorneyNotes?: string
}

export const PHASES = [
  'Week 1–2 — Inspection & due diligence',
  'Week 1–3 — Financing',
  'Week 2–4 — Appraisal & legal',
  'Closing week',
  'After closing — immediately',
]
