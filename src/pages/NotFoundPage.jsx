import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="rounded-xl border bg-white p-8 text-center shadow-sm">
      <h2 className="text-3xl font-bold text-slate-900">404</h2>

      <p className="mt-2 text-slate-500">La página que buscas no existe.</p>

      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        Volver al Dashboard
      </Link>
    </section>
  );
}
