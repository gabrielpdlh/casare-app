// hooks/use-sign-in-mutation.ts
import { useMutation } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";

type SignInInput = {
  email: string;
  password: string;
};

export function useSignIn() {
  return useMutation({
    mutationFn: async ({ email, password }: SignInInput) => {
      let response: any = null;
      let errorResult: any = null;

      await authClient.signIn.email({
        email,
        password,
        fetchOptions: {
          onSuccess: (res) => {
            response = res;
          },
          onError: (error) => {
            errorResult = error;
          },
        },
      });

      if (errorResult) {
        throw errorResult; 
      }

      return response;
    },
  });
}
