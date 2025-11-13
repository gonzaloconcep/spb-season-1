// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react";

const rules = {
  sessions: {
    allow: {
      view: "true",
      create: "true",
      update: "true",
      delete: "false",
    },
  },
  billItems: {
    allow: {
      view: "true",
      create: "true",
      update: "true",
      delete: "false",
    },
  },
  participants: {
    allow: {
      view: "true",
      create: "true",
      update: "true",
      delete: "false",
    },
  },
  itemSelections: {
    allow: {
      view: "true",
      create: "true",
      update: "true",
      delete: "false",
    },
  },
} satisfies InstantRules;

export default rules;
