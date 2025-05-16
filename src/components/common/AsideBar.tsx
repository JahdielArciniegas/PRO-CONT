import ClerkLayout from "@src/layouts/ClerkLayaout";
import { Suspense } from "react";
import { SignOutButton, UserButton } from "@clerk/clerk-react";

const AsideBar = () => {
  return (
    <ClerkLayout>
      <aside className="w-64 shadow-2xl h-screen p-4 flex flex-col items-center">
        <h3>Panel de control</h3>
        <Suspense fallback={<div>Loading...</div>}>
          <UserButton />
        </Suspense>
        <ul className="flex flex-col gap-4">
          <li>
            <a href="/dashboard">
              <button className="p-2 rounded-lg bg-[var(--primary)] text-white cursor-pointer">
                Mis Pros vs Contras
              </button>
            </a>
          </li>
          <li>
            <a href="/writeboard">
              <button className="p-2 rounded-lg bg-[var(--primary)] text-white cursor-pointer">
                Crear Pros vs Contras
              </button>
            </a>
          </li>
          <li>
            <a href="/profile">
              <button className="p-2 rounded-lg bg-[var(--primary)] text-white cursor-pointer">
                Perfil
              </button>
            </a>
          </li>
          <li>
            <SignOutButton>
              <button className="p-2 rounded-lg bg-[var(--primary)] text-white cursor-pointer">
                Cerrar sesión
              </button>
            </SignOutButton>
          </li>
          <li>
            <a href="/">
              <button className="p-2 rounded-lg bg-[var(--primary)] text-white cursor-pointer">
                Salir
              </button>
            </a>
          </li>
        </ul>
      </aside>
    </ClerkLayout>
  );
};

export default AsideBar;
