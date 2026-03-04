import { headers } from "next/headers";

import { auth } from "@/lib/auth";

import CreateWeddingFormDialog from "./_components/create-wedding-form-dialog";
export default async function AppPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const firstName = session?.user.name.split(" ")[0];
  return (
    <>
      <h1 className="text-primary relative z-10 max-w-4xl p-5 text-2xl font-bold md:text-4xl lg:text-5xl">
        Olá, {firstName}
      </h1>
      <div className="p-5">
        <CreateWeddingFormDialog />
      </div>
    </>
  );
}
