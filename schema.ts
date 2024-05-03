// Welcome to your schema
//   Schema driven development is Keystone's modus operandi
//
// This file is where we define the lists, fields and hooks for our data.
// If you want to learn more about how lists are configured, please read
// - https://keystonejs.com/docs/config/lists

import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example
import {
  text,
  relationship,
  password,
  timestamp,
  select,
  integer,
  json,
  virtual,
  checkbox,
} from '@keystone-6/core/fields';

// the document field is a more complicated field, so it has it's own package
import { document } from '@keystone-6/fields-document';
// if you want to make your own fields, see https://keystonejs.com/docs/guides/custom-fields

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
import type { Lists } from '.keystone/types';

export const lists: Lists = {
  User: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,
    //     access: {
    //   operation: {
    //     query: ({ session }) => isNormalUser({ session }),
    //     create: ({ session }) => isNormalUser({ session }),
    //     update: ({ session }) => isNormalUser({ session }),
    //     delete: ({ session }) => isAdmin({ session }),
    //   },
    // },
    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: text({ validation: { isRequired: true } }),

      email: text({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: 'unique',
      }),

      password: password({ validation: { isRequired: true } }),
      role: select({
        options: ['admin', 'user'], // Define enum options
        defaultValue: 'user', // Set default value
        ui: {
          displayMode: 'segmented-control', // Display as segmented control in the UI
        },
      }),

      createdAt: timestamp({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: 'now' },
      }),
    },
    ui: {
      // Hide the delete action from the UI
      hideDelete: true,
    },
  }),
  Order: list({
    access: allowAll,
    // access: {
    //   operation: {
    //     query: ({ session }) => !!session, // All users can query
    //     create: ({ session }) => session.data.role === 'admin', // Only admin can create
    //     update: ({ session }) => session.data.role === 'admin', // Only admin can update
    //     delete: ({ session }) => session.data.role === 'admin', 
    //   },
    // },
    fields: {
      orderId: text({ validation: { isRequired: true } }),
      currency: text({ validation: { isRequired: true } }),
      value: text({ validation: { isRequired: true } }),
      bff: text(),
      collectedBy: text(),
      paymentType: text({ validation: { isRequired: true } }),
      createdAt: timestamp({ defaultValue: { kind: 'now' } }),
      state: text({ validation: { isRequired: true } }),
      updatedAt: timestamp({ defaultValue: { kind: 'now' } }),
      // Establishing N:1 relationship with Seller
      seller: relationship({ ref: 'Seller.orders', many: false }),
      // Establishing 1:1 relationship with Settlement_Details
      settlementDetails: relationship({ ref: 'Settlement_Details.order', many: false }),
      relatedLinks: json({
        ui: {
          views: './components/component.tsx',
          createView: { fieldMode: 'edit' },
          listView: { fieldMode: 'hidden' },
          itemView: { fieldMode: 'edit' },
        },
      }),
    }
  }),

  Seller: list({
    access: allowAll,
    fields: {
      gst: text(),
      pan: text(),
      bpp_id: text(),
      name: text({ validation: { isRequired: true } }),
      // Establishing 1:N relationship with Order
      orders: relationship({ ref: 'Order.seller', many: true })
    }
  }),

  Settlement_Details: list({
    access: allowAll,
    fields: {
      settlementType: text({ validation: { isRequired: true } }),
      accountNo: text(),
      bankName: text(),
      branchName: text(),
      // Establishing 1:1 relationship with Order
      order: relationship({ ref: 'Order.settlementDetails', many: false })
    }
  })
};
