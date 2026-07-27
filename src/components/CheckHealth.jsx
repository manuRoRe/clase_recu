import { useEffect, useState } from "react";
import { checkHealth } from "../services/citizenService";
import { Loading } from "./Loading";

export const CheckHealth = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const health = await checkHealth();
        setData(health.status);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  if (loading === true) return <Loading />;
  if (error !== null) return <p>{error}</p>;
  return <div>CheckHealth: {data}</div>;
};
