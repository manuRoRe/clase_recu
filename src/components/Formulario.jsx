import { useState } from "react";

const initialForm = {
  title: "",
  description: "",
  category: "Front",
};

export function Formulario() {
  const [error, setError] = useState("");
  const [formulario, setFormulario] = useState(initialForm);

  function handleChange(event) {
    const input = event.target;
    setFormulario({ ...formulario, [input.name]: input.value });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !formulario.title.trim() ||
      !formulario.category.trim() ||
      !formulario.description.trim()
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    console.log(formulario);
    setError("");
    setFormulario(initialForm);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-xl border bg-white p-5 shadow-sm"
    >
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Título
          </label>
          <input
            type="text"
            name="title"
            value={formulario.title}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Descripción
          </label>
          <input
            type="text"
            name="description"
            value={formulario.description}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Categoría
          </label>
          <select
            name="category"
            value={formulario.category}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="Front">Front</option>
            <option value="Back">Back</option>
          </select>
        </div>
        <button
          type="submit"
          className="mt-5 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Enviar
        </button>
      </div>
    </form>
  );
}
