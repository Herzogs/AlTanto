import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "@components/header/Header";
import Footer from "@components/footer/Footer";
import Home from "@pages/Home";
import Roads from "@pages/Roads";
import Zones from "@pages/Zones";
import Notifications from "@pages/Notifications";
import ReportForm from "@components/report/ReportForm";
import CategoryForm from "@components/category/CategoryForm";
import ZoneForm from "@components/Zone/ZoneForm";
import ZoneID from "@components/Zone/ZoneID";
import ReportDetail from "@components/report/ReportDetail";
import RoutForm from "@components/routs/RoutForm";
import Logout from "@components/auth/Logout";
import { AuthGuard } from "./guards/auth.guard";
import RegisterForm from "@components/auth/RegisterForm.jsx";
import ValidationCodeForm from "@components/auth/CodeForm.jsx";
import LoginForm from "@components/auth/LoginForm.jsx";
import RoadID from "@components/routs/RoadID";
import ReportIA from "@components/ReportAutomatic/ReportIA";
import Group from "@components/group/Group";
import GroupDetail from "@components/group/GroupDetail";

const nonProtectedRoutes = [
  { path: "/auth/registro", element: <RegisterForm /> },
  { path: "/auth/logout", element: <Logout /> },
  { path: "/auth/verificacion", element: <ValidationCodeForm /> },
  { path: "/auth/login", element: <LoginForm /> },
  { path: "/", element: <Home /> },
  {
    path: "*",
    element: <h1 className="text-center">Estamos trabajando en ello...</h1>,
  },
];

// Define las rutas que requieren autenticación
const protectedRoutes = [
  { path: "/recorridos", element: <Roads /> },
  { path: "/recorridos/:id", element: <RoadID /> },
  { path: "/form/ruta", element: <RoutForm /> },
  { path: "/form/reporte", element: <ReportForm /> },
  { path: "/form/reporte/automatico", element: <ReportIA /> },
  { path: "/form/categoria", element: <CategoryForm /> },
  { path: "/zonas", element: <Zones /> },
  { path: "/form/zona", element: <ZoneForm /> },
  { path: "/zonas/:id", element: <ZoneID /> },
  { path: "/notificaciones", element: <Notifications /> },
  { path: "/reportes/:id", element: <ReportDetail /> },
  { path: "/grupos", element: <Group /> },
  { path: "/grupos/:id", element: <GroupDetail /> },
];

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          {/* Rutas que no requieren autenticación */}
          {nonProtectedRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          <Route element={<AuthGuard />}>
            {/* Rutas que requieren autenticación */}
            {protectedRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
