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
          placeholder={isEditing ? "Nueva contraseña opcional" : "Contraseña"}
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
