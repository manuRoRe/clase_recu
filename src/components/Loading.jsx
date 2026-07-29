export function Loading({ text = "Cargando datos..." }) {
  return (
    <div className="rounded-xl border bg-white p-5 text-slate-600 shadow-sm">
      {text}
    </div>
  );
}
