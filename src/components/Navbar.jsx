import { NavbarLink } from "./NavbarLink";
import { useAuth } from "../context/AuthProvider";

export const Navbar = () => {
  const { isAuthenticated, role, logout, user } = useAuth();

  return (
    <nav className="flex gap-2">
      {user && (
        <span className="text-sm text-slate-600">Bienvenido, {user.name}</span>
      )}
      {isAuthenticated && role === "citizen" && (
        <NavbarLink destino="/citizenDashboard">Citizen Dashboard</NavbarLink>
      )}
      {isAuthenticated && role === "admin" && (
        <NavbarLink destino="/admin">Admin</NavbarLink>
      )}
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <NavbarLink destino="/">Login</NavbarLink>
      )}
    </nav>
  );
};
