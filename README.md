# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## AxiosClient
```bash
    // src/api/axiosClient.js
import axios from "axios";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

## authService

```bash
// src/services/authService.js
import { axiosClient } from "../api/axiosClient";

export async function loginUser(credentials) {
  const response = await axiosClient.post("/auth/login", credentials);
  return response.data;
}

export async function registerUser(userData) {
  const response = await axiosClient.post("/auth/register", userData);
  return response.data;
}

export async function getCurrentUser() {
  const response = await axiosClient.get("/auth/me");
  return response.data;
}
```
## AuthContext
```bash
// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext(null);

function normalizeRole(role) {
  if (role === "ciudadano") return "citizen";
  if (role === "administrador") return "admin";
  return role;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isAuthenticated = Boolean(token);
  const role = normalizeRole(user?.role);
  const isCitizen = role === "citizen";
  const isAdmin = role === "admin";

  async function login(credentials) {
    const data = await loginUser(credentials);

    const normalizedUser = {
      ...data.user,
      role: normalizeRole(data.user.role),
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));

    setToken(data.token);
    setUser(normalizedUser);

    return normalizedUser;
  }

  async function register(userData) {
    return await registerUser(userData);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  }

  const value = {
    token,
    user,
    role,
    isAuthenticated,
    isCitizen,
    isAdmin,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}
```

## ProtectedRoutes
```bash
// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

```bash
// src/routes/RoleRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RoleRoute({ children, allowedRoles }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return children;
}
```
# Clase 6
## Crear AdminService

```bash
// src/services/adminCitizenService.js
import { axiosClient } from "../api/axiosClient";

export async function listAdminCitizens(search = "") {
  const response = await axiosClient.get("/admin/citizens", {
    params: search ? { search } : {},
  });

  return response.data;
}

export async function getAdminCitizenDetails(citizenId) {
  const response = await axiosClient.get(`/admin/citizens/${citizenId}`);
  return response.data;
}

export async function createAdminCitizen(citizenData) {
  const response = await axiosClient.post("/admin/citizens", citizenData);
  return response.data;
}

export async function updateAdminCitizen(citizenId, citizenData) {
  const response = await axiosClient.patch(
    `/admin/citizens/${citizenId}`,
    citizenData
  );

  return response.data;
}

export async function deactivateAdminCitizen(citizenId, reason) {
  const response = await axiosClient.patch(
    `/admin/citizens/${citizenId}/status`,
    {
      status: "inactive",
      reason,
    }
  );

  return response.data;
}

```

## CitizenForm

```bash
// src/components/CitizenForm.jsx
import { useEffect, useState } from "react";

const initialForm = {
  name: "",
  email: "",
  password: "",
  dni: "",
  birthDate: "",
  street: "",
  postalCode: "",
  city: "",
  province: "",
  phone: "",
  initialPoints: 12,
};

export function CitizenForm({
  selectedCitizen,
  onCreate,
  onUpdate,
  onCancelEdit,
}) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const isEditing = Boolean(selectedCitizen);

  useEffect(() => {
    if (selectedCitizen) {
      setForm({
        name: selectedCitizen.name || "",
        email: selectedCitizen.email || "",
        password: "",
        dni: selectedCitizen.dni || "",
        birthDate: selectedCitizen.birthDate || "",
        street: selectedCitizen.address?.street || "",
        postalCode: selectedCitizen.address?.postalCode || "",
        city: selectedCitizen.address?.city || "",
        province: selectedCitizen.address?.province || "",
        phone: selectedCitizen.phone || "",
        initialPoints: selectedCitizen.initialPoints ?? 12,
      });
    } else {
      setForm(initialForm);
    }
  }, [selectedCitizen]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: name === "initialPoints" ? Number(value) : value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.dni.trim() ||
      !form.birthDate ||
      !form.street.trim() ||
      !form.postalCode.trim() ||
      !form.city.trim() ||
      !form.province.trim() ||
      !form.phone.trim()
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (!isEditing && !form.password.trim()) {
      setError("La contraseña es obligatoria al crear un ciudadano.");
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      dni: form.dni,
      birthDate: form.birthDate,
      address: {
        street: form.street,
        postalCode: form.postalCode,
        city: form.city,
        province: form.province,
      },
      phone: form.phone,
      initialPoints: Number(form.initialPoints),
    };

    if (isEditing && !payload.password) {
      delete payload.password;
    }

    if (isEditing) {
      await onUpdate(selectedCitizen.id, payload);
    } else {
      await onCreate(payload);
    }

    setForm(initialForm);
    setError("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border bg-white p-5 shadow-sm"
    >
      <h3 className="text-lg font-bold text-slate-900">
        {isEditing ? "Editar ciudadano" : "Crear ciudadano"}
      </h3>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="rounded-lg border px-3 py-2"
          placeholder="Nombre completo"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="rounded-lg border px-3 py-2"
          placeholder="Email o usuario"
        />

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className="rounded-lg border px-3 py-2"
          placeholder={
            isEditing ? "Nueva contraseña opcional" : "Contraseña"
          }
        />

        <input
          name="dni"
          value={form.dni}
          onChange={handleChange}
          className="rounded-lg border px-3 py-2"
          placeholder="DNI"
        />

        <input
          name="birthDate"
          type="date"
          value={form.birthDate}
          onChange={handleChange}
          className="rounded-lg border px-3 py-2"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="rounded-lg border px-3 py-2"
          placeholder="Teléfono"
        />

        <input
          name="street"
          value={form.street}
          onChange={handleChange}
          className="rounded-lg border px-3 py-2"
          placeholder="Calle y número"
        />

        <input
          name="postalCode"
          value={form.postalCode}
          onChange={handleChange}
          className="rounded-lg border px-3 py-2"
          placeholder="Código postal"
        />

        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          className="rounded-lg border px-3 py-2"
          placeholder="Ciudad"
        />

        <input
          name="province"
          value={form.province}
          onChange={handleChange}
          className="rounded-lg border px-3 py-2"
          placeholder="Provincia"
        />

        <input
          name="initialPoints"
          type="number"
          min="0"
          max="15"
          value={form.initialPoints}
          onChange={handleChange}
          className="rounded-lg border px-3 py-2"
          placeholder="Puntos iniciales"
        />
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-5 flex gap-2">
        <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
          {isEditing ? "Guardar cambios" : "Crear ciudadano"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg bg-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-300"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
```

## CitizenStatusBadge
```bash
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

```

## CitizensTable
```bash
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

              <td className="px-4 py-3 text-slate-600">
                {citizen.dni}
              </td>

              <td className="px-4 py-3 text-slate-600">
                {citizen.email}
              </td>

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
```

## Admin

```bash
// src/pages/AdminCitizensPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CitizenForm } from "../components/CitizenForm";
import { CitizensTable } from "../components/CitizensTable";
import { Loading } from "../components/Loading";
import { ErrorMessage } from "../components/ErrorMessage";
import {
  createAdminCitizen,
  deactivateAdminCitizen,
  listAdminCitizens,
  updateAdminCitizen,
} from "../services/adminCitizenService";

export function AdminCitizensPage() {
  const [citizens, setCitizens] = useState([]);
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  async function loadCitizens(searchValue = "") {
    try {
      setLoading(true);
      setError("");

      const data = await listAdminCitizens(searchValue);

      setCitizens(data);
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar los ciudadanos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCitizens();
  }, []);

  async function handleSearch(event) {
    event.preventDefault();
    await loadCitizens(search);
  }

  async function handleCreate(citizenData) {
    try {
      setError("");
      setFeedback("");

      const createdCitizen = await createAdminCitizen(citizenData);

      setCitizens([createdCitizen, ...citizens]);
      setFeedback("Ciudadano creado correctamente.");
    } catch (error) {
      console.error(error);
      setError("No se pudo crear el ciudadano.");
    }
  }

  async function handleUpdate(citizenId, citizenData) {
    try {
      setError("");
      setFeedback("");

      const updatedCitizen = await updateAdminCitizen(citizenId, citizenData);

      setCitizens(
        citizens.map((citizen) =>
          citizen.id === citizenId ? updatedCitizen : citizen
        )
      );

      setSelectedCitizen(null);
      setFeedback("Ciudadano actualizado correctamente.");
    } catch (error) {
      console.error(error);
      setError("No se pudo actualizar el ciudadano.");
    }
  }

  async function handleDeactivate(citizenId) {
    const reason = window.prompt(
      "Indica el motivo de la baja administrativa:"
    );

    if (!reason) return;

    const confirmDeactivate = window.confirm(
      "¿Seguro que quieres dar de baja a este ciudadano?"
    );

    if (!confirmDeactivate) return;

    const previousCitizens = citizens;

    try {
      setError("");
      setFeedback("");

      // Feedback optimista: actualizamos la UI antes de que responda la API.
      setCitizens(
        citizens.map((citizen) =>
          citizen.id === citizenId
            ? { ...citizen, status: "inactive" }
            : citizen
        )
      );

      const updatedCitizen = await deactivateAdminCitizen(citizenId, reason);

      setCitizens(
        citizens.map((citizen) =>
          citizen.id === citizenId ? updatedCitizen : citizen
        )
      );

      setFeedback("Ciudadano dado de baja correctamente.");
    } catch (error) {
      console.error(error);

      // Si la API falla, restauramos el estado anterior.
      setCitizens(previousCitizens);
      setError("No se pudo dar de baja al ciudadano.");
    }
  }

  if (loading) {
    return <Loading text="Cargando ciudadanos..." />;
  }

  if (error && citizens.length === 0) {
    return <ErrorMessage message={error} />;
  }

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Gestión de ciudadanos
        </h2>

        <p className="text-slate-500">
          Panel privado para administradores.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm md:flex-row"
      >
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="flex-1 rounded-lg border px-3 py-2"
          placeholder="Buscar por nombre, DNI o email..."
        />

        <button className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700">
          Buscar
        </button>

        <button
          type="button"
          onClick={() => {
            setSearch("");
            loadCitizens();
          }}
          className="rounded-lg bg-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-300"
        >
          Limpiar
        </button>
      </form>

      {feedback && (
        <p className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
          {feedback}
        </p>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <CitizenForm
        selectedCitizen={selectedCitizen}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onCancelEdit={() => setSelectedCitizen(null)}
      />

      <CitizensTable
        citizens={citizens}
        onEdit={setSelectedCitizen}
        onDeactivate={handleDeactivate}
        onViewDetails={(citizenId) =>
          navigate(`/admin/ciudadanos/${citizenId}`)
        }
      />
    </section>
  );
}
```

