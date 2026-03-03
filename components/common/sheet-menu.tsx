"use client";

import { LogOutIcon, MenuIcon } from "lucide-react";

import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

const SheetMenu = () => {
  const { data: session } = authClient.useSession();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="px-5">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={session?.user?.image as string | undefined} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {session?.user?.name?.split(" ")?.[0]?.[0]}
                {session?.user?.name?.split(" ")?.[1]?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="">
              <h3 className="font-semibold">
                {""} {session?.user?.name}
              </h3>
              <Badge>
                {session?.user?.weddingRole === "GROOM" ? "Noivo" : "Noiva"}
              </Badge>
            </div>
          </div>
        </div>
        <SheetFooter>
          <Button
            className="w-full"
            onClick={() => authClient.signOut()}
            variant="outline"
            size="icon"
          >
            Sair <LogOutIcon />
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SheetMenu;
