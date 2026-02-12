import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.BASE_APP_URL!,
  plugins: [inferAdditionalFields<typeof auth>()],
});
