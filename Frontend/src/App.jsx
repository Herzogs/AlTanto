import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthGuard } from "./guards/auth.guard";
import Spinner from 'react-bootstrap/Spinner';

const Home = lazy(() => import("@pages/Home"));
const Roads = lazy(() => import("@pages/Roads"));
const Zones = lazy(() => import("@pages/Zones"));
const Notifications = lazy(() => import("@pages/Notifications"));
const ReportForm = lazy(() => import("@components/report/ReportForm"));
const CategoryForm = lazy(() => import("@components/category/CategoryForm"));
const ZoneForm = lazy(() => import("@components/Zone/ZoneForm"));
const ZoneID = lazy(() => import("@components/Zone/ZoneID"));
const ReportDetail = lazy(() => import("@components/report/ReportDetail"));
const RoutForm = lazy(() => import("@components/road/RoutForm"));
const Logout = lazy(() => import("@components/auth/Logout"));
const RegisterForm = lazy(() => import("@components/auth/RegisterForm.jsx"));
const ValidationCodeForm = lazy(() => import("@components/auth/CodeForm.jsx"));
const LoginForm = lazy(() => import("@components/auth/LoginForm.jsx"));
const RoadID = lazy(() => import("@components/road/RoadID"));
const ReportIA = lazy(() => import("@components/ReportAutomatic/ReportIA"));
const Groups = lazy(() => import("@components/group/Groups"));
const GroupDetail = lazy(() => import("@components/group/GroupDetail"));
const GroupSearch = lazy(() => import("@components/group/GroupSearch"));
const GroupForm = lazy(() => import("@components/group/GroupForm"));
const UserProfile = lazy(() => import("@pages/Profile"));
const JoinGroup = lazy(() => import("@components/group/JoinGroup"));

const nonProtectedRoutes = [
  { path: "/auth/registro", element: <RegisterForm /> },
  { path: "/auth/logout", element: <Logout /> },
  { path: "/auth/verificacion", element: <ValidationCodeForm /> },
  { path: "/auth/login", element: <LoginForm /> },
  { path: "/reportes/:id", element: <ReportDetail /> },
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
  { path: "/form/reporte/:groupId?", element: <ReportForm /> },
  { path: "/form/reporte/automatico/:groupId?", element: <ReportIA /> },
  { path: "/form/categoria", element: <CategoryForm /> },
  { path: "/zonas", element: <Zones /> },
  { path: "/form/zona", element: <ZoneForm /> },
  { path: "/zonas/:id", element: <ZoneID /> },
  { path: "/notificaciones", element: <Notifications /> },
  { path: "/grupos", element: <Groups /> },
  { path: "/grupos/:id", element: <GroupDetail /> },
  { path: "/form/grupo", element: <GroupForm /> },
  { path: "group-search", element: <GroupSearch /> },
  { path: "/perfil", element: <UserProfile /> },
  { path: "/join-group", element: <JoinGroup /> },
];

const App = () => {
  return (
    <BrowserRouter>
      <main>
        <Suspense fallback={
           <div className="text-center mt-5">
           <Spinner animation="border" role="status">
             <span className="visually-hidden">Loading...</span>
           </Spinner>
         </div> // Indicador de carga
        }>
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
        </Suspense>
      </main>
    </BrowserRouter>
  );
};

export default App;
