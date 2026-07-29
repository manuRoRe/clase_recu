// src/components/CitizenStatusBadge.jsx
export function CitizenStatusBadge({ status }) {
  const styles = {
    active: "bg-green-50 text-green-700",
    inactive: "bg-red-50 text-red-700",
    suspended: "bg-amber-50 text-amber-700",
  };

  const labels = {
    active: "Activo",
    inactive: "Baja",
    suspended: "Suspendido",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {labels[status] || status || "Sin estado"}
    </span>
  );
}
