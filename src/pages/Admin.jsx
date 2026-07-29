// src/pages/AdminCitizensPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CitizenForm } from "../components/CitizenForm";
import { CitizensTable } from "../components/CitizensTable";
import { Loading } from "../components/Loading";

import {
  createAdminCitizen,
  deactivateAdminCitizen,
  listAdminCitizens,
  updateAdminCitizen,
} from "../services/adminCitizenService";

export function AdminPage() {
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
          citizen.id === citizenId ? updatedCitizen : citizen,
        ),
      );

      setSelectedCitizen(null);
      setFeedback("Ciudadano actualizado correctamente.");
    } catch (error) {
      console.error(error);
      setError("No se pudo actualizar el ciudadano.");
    }
  }

  async function handleDeactivate(citizenId) {
    const reason = window.prompt("Indica el motivo de la baja administrativa:");

    if (!reason) return;

    const confirmDeactivate = window.confirm(
      "¿Seguro que quieres dar de baja a este ciudadano?",
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
            : citizen,
        ),
      );

      const updatedCitizen = await deactivateAdminCitizen(citizenId, reason);

      setCitizens(
        citizens.map((citizen) =>
          citizen.id === citizenId ? updatedCitizen : citizen,
        ),
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
    return <p>{error}</p>;
  }

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Gestión de ciudadanos
        </h2>

        <p className="text-slate-500">Panel privado para administradores.</p>
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

      <CitizensTable
        citizens={citizens}
        onEdit={setSelectedCitizen}
        onDeactivate={handleDeactivate}
        onViewDetails={(citizenId) =>
          navigate(`/admin/ciudadanos/${citizenId}`)
        }
      />
      <CitizenForm
        selectedCitizen={selectedCitizen}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onCancelEdit={() => setSelectedCitizen(null)}
      />
    </section>
  );
}
