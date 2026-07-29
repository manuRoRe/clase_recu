import { Route, Routes } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { AdminPage } from "./pages/Admin";
import { LoginPage } from "./pages/Login";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RoleRoute } from "./routes/RoleRoute";
import { Home } from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route
          path="/citizenDashboard"
          element={
            <RoleRoute allowedRoles={["citizen"]}>
              <DashboardPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AdminPage />
            </RoleRoute>
          }
        />
        <Route index element={<LoginPage></LoginPage>} />
        <Route path="/login" element={<LoginPage></LoginPage>} />
        <Route path="/home" element={<Home></Home>}></Route>
      </Route>
      <Route path="*" element={<NotFoundPage></NotFoundPage>} />
    </Routes>
  );
}

export default App;
