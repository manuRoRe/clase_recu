import { NavLink } from "react-router-dom";
import { cn } from "../lib/utils";

export const NavbarLink = ({ destino, children }) => {
  return (
    <NavLink
      to={destino}
      className={({ isActive }) =>
        cn(
          "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-blue-600 text-white"
            : "text-slate-600 hover:bg-slate-100",
        )
      }
    >
      {children}
    </NavLink>
  );
};
