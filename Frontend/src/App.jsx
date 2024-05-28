import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Home from "@/pages/Home";
import Roads from "@/pages/Roads";
import Zones from "@/pages/Zones";
import Notifications from "@/pages/Notifications";
import ReportForm from "@/components/report/ReportForm";
import CategoryForm from "@/components/category/CategoryForm";
import ZoneForm from "@/components/Zone/ZoneForm";
import ZoneID from "@/components/Zone/ZoneID";
import ReportDetail from "@/components/report/ReportDetail";
import ReportAutomatic from "@/components/ReportAutomatic/ReportAutomaticForm";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/recorridos", element: <Roads /> },
  { path: "/form/reporte", element: <ReportForm /> },
  { path: "/form/reportAutomatic", element: <ReportAutomatic /> },
  { path: "/form/categoria", element: <CategoryForm /> },
  { path: "/zonas", element: <Zones /> },
  { path: "/form/zona", element: <ZoneForm /> },
  { path: "/zonas/:id", element: <ZoneID /> },
  { path: "/notificaciones", element: <Notifications /> },
  { path: "/reportes/:id", element: <ReportDetail /> },
  { path: "*", element: <h1 className="text-center">Estamos trabajando en ello...</h1> }
];

const App = () => {
  return (
    <main>
      <BrowserRouter>
        <Header />
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
        <Footer />
      </BrowserRouter>
    </main>
  );
};

export default App;
