"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const createWeddingFormSchema = z.object({
  weddingDate: z
    .date()
    .min(new Date(), "A data do casamento deve ser no futuro"),
  location: z.string().min(1, "Local é obrigatório"),
  partnerTwoName: z.string().min(1, "Nome do parceiro é obrigatório"),
  partnerTwoEmail: z.email("E-mail inválido"),
});

export type CreateWeddingFormValues = z.infer<typeof createWeddingFormSchema>;

const CreateWeddingFormDialog = () => {
  const form = useForm<CreateWeddingFormValues>({
    resolver: zodResolver(createWeddingFormSchema),
    defaultValues: {
      weddingDate: undefined,
      location: "",
      partnerTwoName: "",
      partnerTwoEmail: "",
    },
  });

  const onSubmit = async (values: CreateWeddingFormValues) => {
    console.log(values);
  };

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
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex max-h-[70vh] flex-col gap-y-4 overflow-y-auto pr-2"
        >
          <Controller
            name="partnerTwoName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Nome do Parceiro</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="Digite o nome do seu parceiro"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          /><Controller
            name="partnerTwoEmail"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>E-mail do Parceiro</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="Digite o e-mail do seu parceiro"
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
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Data do Casamento</FieldLabel>

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
                      startMonth={new Date()}
                      endMonth={new Date(2027, 11)}
                      onSelect={(date) => {
                        if (date) field.onChange(date);
                      }}
                    />
                  </PopoverContent>
                </Popover>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
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
                  placeholder="Digite o local do seu casamento"
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
