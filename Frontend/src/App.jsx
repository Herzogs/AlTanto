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

import { useStore } from "./store/";

const App = () => {
  const { userLocation } = useStore();
  return (
    <main>
      <BrowserRouter>
        <Header />
        {userLocation && (
          <button onClick={() => console.log(userLocation)}>
            userLocation ver
          </button>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recorridos" element={<Roads />} />
          <Route path="/form/reporte" element={<ReportForm />} />
          <Route path="/form/categoria" element={<CategoryForm />} />
          <Route path="/zonas" element={<Zones />} />
          <Route path="/form/zona" element={<ZoneForm />} />
          <Route path="/zonas/:id" element={<ZoneID />} />
          <Route path="/notificaciones" element={<Notifications />} />
          <Route path="/reportes/:id" element={<ReportDetail />} />
          <Route
            path="*"
            element={<h1 className="text-center">Estamos trabajando...</h1>}
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </main>
  );
};

export default App;
