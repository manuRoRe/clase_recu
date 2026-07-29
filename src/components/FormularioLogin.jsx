import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const initialForm = {
  email: "",
  password: "",
};

export function FormularioLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setError("Email y contraseña son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const userLogged = await login(form);

      if (userLogged.role === "citizen") {
        navigate("/citizenDashboard");
      }
      if (userLogged.role === "admin") {
        navigate("/admin");
      }

      setResult(userLogged);
    } catch (error) {
      console.error(error);
      setError("No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="ciudadano@email.com"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Contraseña
          </label>

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="********"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {result && (
        <pre className="mt-6 overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-white">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </>
  );
}
