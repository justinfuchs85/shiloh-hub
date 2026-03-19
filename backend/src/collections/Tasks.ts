import type { CollectionConfig } from 'payload'

const Tasks: CollectionConfig = {
  slug: 'tasks',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'phase', 'assignee', 'done'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'detail',
      type: 'text',
    },
    {
      name: 'due',
      type: 'text',
      label: 'Due / Timing',
    },
    {
      name: 'assignee',
      type: 'select',
      options: [
        { label: 'Unassigned', value: '' },
        { label: 'Justin', value: 'Justin' },
        { label: 'Natalie', value: 'Natalie' },
      ],
      defaultValue: '',
    },
    {
      name: 'phase',
      type: 'select',
      required: true,
      options: [
        { label: 'Week 1–2 — Inspection & due diligence', value: '0' },
        { label: 'Week 1–3 — Financing', value: '1' },
        { label: 'Week 2–4 — Appraisal & legal', value: '2' },
        { label: 'Closing week', value: '3' },
        { label: 'After closing — immediately', value: '4' },
      ],
      defaultValue: '0',
    },
    {
      name: 'done',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}

export default Tasks
