import { useState } from "react";
import { users } from "./data/userData";
import { Route, Routes } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { AdminPage } from "./pages/Admin";
import { LoginPage } from "./pages/Login";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  const [search, setSearch] = useState("");

  const listFiltered = users.filter((user) => {
    const lowerSearch = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(lowerSearch) ||
      user.role.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="/admin" element={<AdminPage></AdminPage>} />
        <Route path="/login" element={<LoginPage></LoginPage>} />
      </Route>
      <Route path="*" element={<NotFoundPage></NotFoundPage>} />
    </Routes>
  );
}

export default App;
