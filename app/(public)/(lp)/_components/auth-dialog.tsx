import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SignInForm from "./sign-in-form";
import SignUpForm from "./sign-up-form";

const AuthDialog = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Criar Casamento</Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Crie seu Casamento</DialogTitle>
          <DialogDescription>
            Gerencie seu casamento de forma simples e centralizada
          </DialogDescription>
        </DialogHeader>
        <Tabs>
          <TabsList>
            <TabsTrigger value="sign-in">Entrar</TabsTrigger>
            <TabsTrigger value="sign-up">Criar Conta</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in">
            <SignInForm />
          </TabsContent>
          <TabsContent value="sign-up">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
