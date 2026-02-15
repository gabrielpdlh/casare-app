"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { subYears } from "date-fns";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMaskInput } from "use-mask-input";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSignUp } from "@/hooks/mutations/use-sign-up";
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

const SignUpForm = () => {
  const signUpMutation = useSignUp();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const phoneMask = useMaskInput({
    mask: "(99) 99999-9999",
    options: {
      showMaskOnHover: false,
    },
  });

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      weddingRole: undefined,
      phone: "",
      birthDate: undefined,
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    signUpMutation.mutate(values, {
      onSuccess: () => {
        router.push("/teste");
      },
      onError: (error: any) => {
        const code = error?.error?.code;

        if (code === "USER_NOT_FOUND") {
          return form.setError("email", {
            message: "Usuário não encontrado",
          });
        }

        if (code === "INVALID_EMAIL_OR_PASSWORD") {
          form.setError("email", {
            message: "E-mail ou senha inválidos.",
          });
          return form.setError("password", {
            message: "E-mail ou senha inválidos.",
          });
        }

        toast.error("Erro ao realizar login");
      },
    });
  };

  const MIN_AGE = 16;
  const maxSelectableDate = subYears(new Date(), MIN_AGE);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Nome Completo</FieldLabel>
            <Input
              {...field}
              placeholder="Digite o seu nome completo"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>E-mail</FieldLabel>
            <Input
              {...field}
              placeholder="Digite o seu email"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="weddingRole"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field {...field}>
            <FieldLabel>Você é noivo ou noiva?</FieldLabel>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione seu papel no casamento" />
              </SelectTrigger>
              <SelectContent aria-invalid={fieldState.invalid}>
                <SelectGroup>
                  <SelectItem value="GROOM">Noivo</SelectItem>
                  <SelectItem value="BRIDE">Noiva</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="phone"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Telefone (com DDD)</FieldLabel>
            <Input
              {...field}
              ref={phoneMask}
              placeholder="Digite o seu telefone com DDD"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="birthDate"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Data de nascimento</FieldLabel>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="justify-start font-normal"
                >
                  {field.value
                    ? field.value.toLocaleDateString()
                    : "Selecione a data"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  captionLayout="dropdown"
                  fromYear={1900}
                  toYear={maxSelectableDate.getFullYear()}
                  onSelect={(date) => {
                    if (date) field.onChange(date);
                  }}
                />
              </PopoverContent>
            </Popover>

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
                className="absolute top-1/2 right-2 -translate-y-1/2 hover:bg-transparent"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <Eye size={2} /> : <EyeClosed size={2} />}
              </Button>
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="passwordConfirmation"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Confirmação de senha</FieldLabel>
            <div className="relative">
              <Input
                {...field}
                type={showPasswordConfirmation ? "text" : "password"}
                aria-invalid={fieldState.invalid}
                placeholder="Digite a sua senha"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-2 -translate-y-1/2 hover:bg-transparent"
                onClick={() => setShowPasswordConfirmation((prev) => !prev)}
              >
                {showPasswordConfirmation ? (
                  <Eye size={2} />
                ) : (
                  <EyeClosed size={2} />
                )}
              </Button>
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit">Enviar</Button>
    </form>
  );
};

export default SignUpForm;
