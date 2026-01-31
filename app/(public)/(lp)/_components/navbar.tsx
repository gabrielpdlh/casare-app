import Link from "next/link";

import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="flex w-full justify-between px-5 py-5">
      <Link className="text-2xl font-bold text-primary" href="/">
        Casare App
      </Link>
      <div className="flex gap-3">
        <Button variant="secondary">Entrar</Button>
        <Button>Crie seu Casamento</Button>
      </div>
    </nav>
  );
};

export default Navbar;
