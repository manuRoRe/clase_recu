export function SearchBar({ search, setSearch }) {
  return (
    <div className="mb-6">
      <label
        htmlFor="search"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Buscar recurso
      </label>

      <input
        id="search"
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar por Nombre o Rol..."
        className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
      />
    </div>
  );
}
