import { useMutation } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";

type SignInInput = {
  email: string;
  password: string;
};

export function useSignIn() {
  return useMutation({
    mutationFn: ({ email, password }: SignInInput) =>
      new Promise((resolve, reject) => {
        authClient.signIn.email({
          email,
          password,
          fetchOptions: {
            onSuccess: (res) => resolve(res),
            onError: (error) => reject(error),
          },
        });
      }),
  });
}
