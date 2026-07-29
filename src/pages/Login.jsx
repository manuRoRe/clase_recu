import { FormularioLogin } from "../components/FormularioLogin";

export function LoginPage() {
  return (
    <section className="mx-auto max-w-md rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Iniciar sesión</h2>

      <FormularioLogin />
    </section>
  );
}
