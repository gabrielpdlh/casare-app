import { betterAuth, string } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/db";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      weddingRole: {
        type: ["GROOM", "BRIDE"],
        required: true,
        input: true
      },
      phone: {
        type: "string",
        required: true,
        input: true
      },
      birthDate: {
        type: "date",
        required: true,
        input: true
      },
      
    }
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});
