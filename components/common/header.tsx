import Link from "next/link";

import SheetMenu from "./sheet-menu";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-5">
      <Link href="/">
        <h1 className="text-primary font-bold">Casare App</h1>
      </Link>
      <SheetMenu />
    </header>
  );
};

export default Header;
