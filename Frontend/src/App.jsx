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
import CaptureImage from "@components/ReportAutomatic/CaptureImage";
import RegisterForm from "@components/auth/RegisterForm.jsx";
import ValidationCodeForm from "@components/auth/CodeForm.jsx";
import LoginForm from "@components/auth/LoginForm.jsx";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/recorridos", element: <Roads /> },
  { path: "/form/reporte", element: <ReportForm /> },
  { path: "/form/reporte/automatico", element: <CaptureImage /> },
  { path: "/form/categoria", element: <CategoryForm /> },
  { path: "/zonas", element: <Zones /> },
  { path: "/form/zona", element: <ZoneForm /> },
  { path: "/zonas/:id", element: <ZoneID /> },
  { path: "/notificaciones", element: <Notifications /> },
  { path: "/reportes/:id", element: <ReportDetail /> },
  { path: "/form/registro", element: <RegisterForm/> },
  { path: "/form/validar-codigo", element: <ValidationCodeForm/> },
  { path: "/form/login", element: <LoginForm/> },
  {
    path: "*",
    element: <h1 className="text-center">Estamos trabajando en ello...</h1>,
  },
];

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
