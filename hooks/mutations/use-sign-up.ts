import { useMutation } from "@tanstack/react-query";
import z from "zod";

import { authClient } from "@/lib/auth-client";
import { isAtLeastAge } from "@/lib/validators/age";

const signUpFormSchema = z
  .object({
    name: z.string().min(8, "Nome muito curto."),
    email: z.email("E-mail inválido"),
    weddingRole: z.enum(["GROOM", "BRIDE"]),
    phone: z.string().min(11, "Número de telefone inválido."),
    birthDate: z
      .date()
      .refine(
        (date) => isAtLeastAge(date, 16),
        "Você deve ter pelo menos 16 anos.",
      ),
    password: z.string().min(8, "A senha deve conter no mínimo 8 caracteres."),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem",
    path: ["passwordConfirmation"],
  });

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export function useSignUp() {
  return useMutation({
    mutationFn: (data: SignUpFormValues) =>
      new Promise((resolve, reject) => {
        authClient.signUp.email({
          email: data.email,
          name: data.name,
          password: data.password,
          weddingRole: data.weddingRole,
          birthDate: data.birthDate,
          phone: data.phone,
          fetchOptions: {
            onSuccess: (res) => resolve(res),
            onError: (error) => reject(error),
          },
        });
      }),
  });
}
