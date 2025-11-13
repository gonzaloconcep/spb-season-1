// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
      imageURL: i.string().optional(),
      type: i.string().optional(),
    }),
    sessions: i.entity({
      createdAt: i.number(),
      adminUserId: i.string(),
      totalComensales: i.number().optional(),
      status: i.string(), // 'waiting' | 'swiping' | 'completed'
      qrCode: i.string().optional(),
    }),
    billItems: i.entity({
      name: i.string(),
      price: i.number(),
      quantity: i.number(),
      imageUrl: i.string().optional(),
    }),
    participants: i.entity({
      name: i.string(),
      paymentMethod: i.string(), // 'cash' | 'card'
      isAdmin: i.boolean(),
      joinedAt: i.number(),
    }),
    itemSelections: i.entity({
      consumed: i.boolean(),
      quantityConsumed: i.number().optional(),
    }),
  },
  links: {
    $usersLinkedPrimaryUser: {
      forward: {
        on: "$users",
        has: "one",
        label: "linkedPrimaryUser",
        onDelete: "cascade",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "linkedGuestUsers",
      },
    },
    sessionBillItems: {
      forward: {
        on: "billItems",
        has: "one",
        label: "session",
      },
      reverse: {
        on: "sessions",
        has: "many",
        label: "billItems",
      },
    },
    sessionParticipants: {
      forward: {
        on: "participants",
        has: "one",
        label: "session",
      },
      reverse: {
        on: "sessions",
        has: "many",
        label: "participants",
      },
    },
    participantItemSelections: {
      forward: {
        on: "itemSelections",
        has: "one",
        label: "participant",
      },
      reverse: {
        on: "participants",
        has: "many",
        label: "selections",
      },
    },
    itemSelectionBillItem: {
      forward: {
        on: "itemSelections",
        has: "one",
        label: "billItem",
      },
      reverse: {
        on: "billItems",
        has: "many",
        label: "selections",
      },
    },
  },
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
