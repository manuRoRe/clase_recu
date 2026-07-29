// src/components/CitizensTable.jsx
import { CitizenStatusBadge } from "./CitizenStatusBadge";

export function CitizensTable({
  citizens,
  onEdit,
  onDeactivate,
  onViewDetails,
}) {
  if (citizens.length === 0) {
    return (
      <p className="rounded-xl border bg-white p-5 text-slate-600 shadow-sm">
        No hay ciudadanos registrados.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">DNI</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {citizens.map((citizen) => (
            <tr key={citizen.id} className="border-t">
              <td className="px-4 py-3 font-medium text-slate-900">
                {citizen.name}
              </td>

              <td className="px-4 py-3 text-slate-600">{citizen.dni}</td>

              <td className="px-4 py-3 text-slate-600">{citizen.email}</td>

              <td className="px-4 py-3">
                <CitizenStatusBadge status={citizen.status} />
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onViewDetails(citizen.id)}
                    className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
                  >
                    Ver
                  </button>

                  <button
                    onClick={() => onEdit(citizen)}
                    className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-medium text-white hover:bg-amber-600"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => onDeactivate(citizen.id)}
                    disabled={citizen.status === "inactive"}
                    className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Dar de baja
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
