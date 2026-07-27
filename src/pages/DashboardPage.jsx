import { CheckHealth } from "../components/CheckHealth";
import { FlexCards } from "../components/FlexCards";
import { users } from "../data/userData";

export function DashboardPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">
          Vista de lectura disponible para usuarios autenticados.
        </p>
      </div>
      <CheckHealth></CheckHealth>

      <FlexCards users={users} />
    </>
  );
}
