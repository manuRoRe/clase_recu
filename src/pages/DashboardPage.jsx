import { CheckHealth } from "../components/CheckHealth";
import { FlexCards } from "../components/FlexCards";
import { users } from "../data/userData";
import { useAuth } from "../context/AuthProvider";
import { useEffect, useState } from "react";
import { getCitizenProfile } from "../services/citizenService";
import { Loading } from "../components/Loading";

export function DashboardPage() {
  const { isAuthenticated } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiCall = async () => {
      try {
        const userData = await getCitizenProfile();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    apiCall();
  }, []);

  if (loading) {
    return <Loading></Loading>;
  }
  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          {isAuthenticated ? " Autenticado" : " No autenticado"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Vista de lectura disponible para usuarios autenticados.
        </p>
      </div>
      <CheckHealth></CheckHealth>

      {/* <FlexCards users={users} /> */}

      <h2 className="text-amber-800">{user.name}</h2>
      <h2 className="text-amber-800">{user.email}</h2>
      <h2 className="text-amber-800">{user.role}</h2>
      <h2>Tu Fecha de Nacimiento:{user.birthDate}</h2>
    </>
  );
}
