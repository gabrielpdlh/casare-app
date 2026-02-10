"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z, { set } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const signInFormSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string("Senha inválida").min(8, "Senha inválida"),
});

type SignInFormValues = z.infer<typeof signInFormSchema>;

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    await authClient.signIn.email({
      email: values.email,
      password: values.password,
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
        onError: (error) => {
          if (error.error.code === "USER_NOT_FOUND") {
            return form.setError("email", {
              message: "Usuário não encontrado",
            });
          }
          if (error.error.code === "INVALID_EMAIL_OR_PASSWORD") {
            form.setError("email", {
              message: "E-mail ou senha inválidos.",
            });
            return form.setError("password", {
              message: "E-mail ou senha inválidos.",
            });
          }
          toast.error(error.error.message);
        },
      },
    });
  };

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>E-mail</FieldLabel>
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              placeholder="Digite o seu e-mail"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Senha</FieldLabel>
            <div className="relative">
              <Input
                {...field}
                type={showPassword ? "text" : "password"}
                aria-invalid={fieldState.invalid}
                placeholder="Digite a sua senha"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-2 -translate-y-1/2"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <Eye size={2} /> : <EyeClosed size={2} />}
              </Button>
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button className="w-full" type="submit">Entrar</Button>
    </form>
  );
};

export default SignInForm;
