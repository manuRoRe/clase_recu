import { NavbarLink } from "./NavbarLink";

export const Navbar = () => {
  return (
    <nav className="flex gap-2">
      <NavbarLink destino="/">Home</NavbarLink>
      <NavbarLink destino="/admin">Admin</NavbarLink>
      <NavbarLink destino="/login">Login</NavbarLink>
    </nav>
  );
};
