import type { CollectionConfig } from 'payload'

export const Reservations: CollectionConfig = {
  slug: 'reservations',
  admin: {
    useAsTitle: 'id',
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          const { checkAvailability } = await import('../lib/checkAvailability')
          const result = await checkAvailability({
            payload: req.payload,
            productId: data.product as string,
            reservedFrom: data.reservedFrom as string,
            reservedTo: data.reservedTo as string,
            quantity: (data.quantity as number) || 1,
          })
          if (!result.available) {
            throw new Error(
              `Brak dostępnych slotów. Pozostało: ${result.remainingSlots}`,
            )
          }
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        if (
          operation === 'update' &&
          doc.status === 'cancelled' &&
          previousDoc.status !== 'cancelled'
        ) {
          const productId =
            typeof doc.product === 'object' ? doc.product.id : doc.product
          const product = await req.payload.findByID({
            collection: 'products',
            id: productId,
          })
          await req.payload.update({
            collection: 'products',
            id: productId,
            data: {
              availableSlots:
                (product.availableSlots || 0) + (doc.quantity || 1),
            },
          })
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Oczekująca', value: 'pending' },
        { label: 'Potwierdzona', value: 'confirmed' },
        { label: 'Anulowana', value: 'cancelled' },
        { label: 'Zakończona', value: 'completed' },
      ],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'reservedFrom',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'reservedTo',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'quantity',
      type: 'number',
      defaultValue: 1,
      min: 1,
      required: true,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'cancelledAt',
      type: 'date',
    },
  ],
}
