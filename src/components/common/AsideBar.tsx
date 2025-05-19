import ClerkLayout from "@src/layouts/ClerkLayaout";
import { ModeToggle } from "./ModeToggle";
import { User, Plus, FileStack, Columns2, LogOut } from "lucide-react";
import { SignOutButton, UserButton } from "@clerk/clerk-react";
import { Button } from "../ui/button";
import { useState } from "react";

const AsideBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <ClerkLayout>
      <aside
        className={`shadow-page h-screen flex flex-col items-center justify-between transition-transform duration-300  ${
          open ? " lg:w-16 w-0" : "lg:w-64 w-16"
        }`}
      >
        <div className="flex flex-col gap-8 p-4">
          <div className="absolute left-4 top-4 text-2xl font-bold flex gap-2 items-center">
            {!open && <ModeToggle />}
            <Button
              className="cursor-pointer"
              variant="ghost"
              onClick={() => setOpen(!open)}
            >
              <Columns2 />
            </Button>
            <h1 className={`${open && "pl-4"}`}>
              <span className="text-green-500">PRO</span>/
              <span className="text-red-500">CONT</span>
            </h1>
          </div>
          <ul
            className={`flex flex-col gap-1 w-full mt-20 ${
              open ? "hidden lg:flex" : "flex"
            }`}
          >
            <li>
              <a href="/dashboard" className="w-full">
                <Button
                  className="cursor-pointer w-full justify-start"
                  variant="ghost"
                >
                  <FileStack />
                  {!open && (
                    <p className="hidden lg:block">Mis Pros y Contras</p>
                  )}
                </Button>
              </a>
            </li>
            <li>
              <a href="/writeboard" className="w-full">
                <Button
                  className="cursor-pointer w-full justify-start"
                  variant="ghost"
                >
                  <Plus />
                  {!open && (
                    <p className="hidden lg:block">Crear Pros vs Contras</p>
                  )}
                </Button>
              </a>
            </li>
            <li>
              <a href="/profile" className="w-full">
                <Button
                  className="cursor-pointer w-full justify-start"
                  variant="ghost"
                >
                  <User />
                  {!open && <p className="hidden lg:block">Perfil</p>}
                </Button>
              </a>
            </li>
          </ul>
        </div>

        <div
          className={`flex gap-4 justify-center w-full p-4 rounded-t-2xl ${
            !open ? "bg-muted flex-col lg:flex-row " : "hidden lg:flex"
          }`}
        >
          {!open && <UserButton />}
          <SignOutButton>
            <Button className="cursor-pointer" variant="outline">
              <LogOut />
              {!open && <p className="hidden lg:block">Cerrar sesión</p>}
            </Button>
          </SignOutButton>
        </div>
      </aside>
    </ClerkLayout>
  );
};

export default AsideBar;
