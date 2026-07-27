import { useState } from "react";
import { login } from "../services/authService";
import { Loading } from "../components/Loading";

export function LoginPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    setLoading(true);

    try {
      const response = await login(email, password);
      setData(response.user);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading === true) return <Loading />;
  return (
    <section className="mx-auto max-w-md rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Iniciar sesión</h2>
      {data && (
        <p className="mt-4 text-green-500">
          Login successful! Usuario: {data.name}
        </p>
      )}
      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          className="border border-gray-300 rounded-md p-2"
        ></input>
        <label>Password</label>
        <input
          type="password"
          name="password"
          className="border border-gray-300 rounded-md p-2"
        ></input>

        <button
          type="submit"
          className="rounded-md bg-cyan-500 py-2 px-4 text-white hover:bg-cyan-600"
        >
          Iniciar sesión
        </button>
      </form>
      {error !== null && (
        <p className="mt-4 text-red-500">
          Error: {error.response?.data?.message || error.message}
        </p>
      )}
    </section>
  );
}
