import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const createWeddingSchema = z.object({
  partnerOneName: z.string().min(2, "Informe seu nome"),
  partnerOneEmail: z.string().email("Email inválido"),

  partnerTwoName: z.string().min(2, "Informe o nome do parceiro(a)"),
  partnerTwoEmail: z.string().email("Email inválido"),

  weddingDate: z.date(),

  location: z.string().optional(),
});

type CreateWeddingSchema = z.infer<typeof createWeddingSchema>;

const CreateWeddingFormDialog = () => {
  const form = useForm<CreateWeddingSchema>({
    resolver: zodResolver(createWeddingSchema),
    defaultValues: {
      partnerOneName: "",
      partnerOneEmail: "",
      partnerTwoName: "",
      partnerTwoEmail: "",
      weddingDate: new Date(),
      location: "",
    },
  });

  function onSubmit(data: CreateWeddingSchema) {
    console.log(data);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Criar Casamento</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crie seu Casamento</DialogTitle>
          <DialogDescription>
            Gerencie seu casamento de forma simples e centralizada
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex max-h-[70vh] flex-col gap-y-4 overflow-y-auto pr-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Controller
            name="partnerOneName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Seu Nome Completo</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="Digite o seu nome completo"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="partnerOneEmail"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Seu E-mail</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="Digite o seu e-mail"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="partnerTwoName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Nome Completo do seu parceiro(a)</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="Digite o nome completo do seu parceiro(a)"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="partnerTwoEmail"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>E-mail do seu parceiro(a)</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="Digite o e-mail do seu parceiro(a)"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="weddingDate"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Data do Casamento</FieldLabel>
                <Calendar
                  className="mx-auto"
                  mode="single"
                  selected={field.value}
                  captionLayout="dropdown"
                  onSelect={field.onChange}
                  initialFocus
                />
              </Field>
            )}
          />
          <Controller
            name="location"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Local do Casamento</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="Digite o local do casamento"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button type="submit">Criar Casamento</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWeddingFormDialog;
