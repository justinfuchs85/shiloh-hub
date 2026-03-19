import type { GlobalConfig } from 'payload'

const Property: GlobalConfig = {
  slug: 'property',
  label: 'Property Info',
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'address',
      type: 'text',
      defaultValue: '4496 Shiloh Way Dr SE, Kentwood, MI 49546',
    },
    {
      name: 'mlsNumber',
      type: 'text',
      label: 'MLS Number',
      defaultValue: '26009064',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Offer Accepted', value: 'Offer Accepted' },
        { label: 'Under Contract', value: 'Under Contract' },
        { label: 'Closed', value: 'Closed' },
      ],
      defaultValue: 'Offer Accepted',
    },
    {
      name: 'offerPrice',
      type: 'number',
      defaultValue: 500000,
    },
    {
      name: 'listPrice',
      type: 'number',
      defaultValue: 500000,
    },
    {
      name: 'sqft',
      type: 'number',
      label: 'Square footage (above grade)',
      defaultValue: 2042,
    },
    {
      name: 'beds',
      type: 'number',
      defaultValue: 4,
    },
    {
      name: 'bathsFull',
      type: 'number',
      label: 'Full bathrooms',
      defaultValue: 3,
    },
    {
      name: 'bathsHalf',
      type: 'number',
      label: 'Half bathrooms',
      defaultValue: 1,
    },
    {
      name: 'annualTaxes',
      type: 'number',
      label: 'Annual taxes ($)',
      defaultValue: 6720,
    },
    {
      name: 'listingDescription',
      type: 'textarea',
    },
    {
      name: 'highlights',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
    // Hero image URLs
    {
      name: 'heroImages',
      type: 'array',
      label: 'Hero photo URLs (up to 5)',
      fields: [
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
        },
      ],
    },
  ],
}

export default Property
