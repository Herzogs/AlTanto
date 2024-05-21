import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import ReportForm from "./components/ReportForm";
import CategoryForm from "./components/CategoryForm";
import Test from "./components/Test";
import Home from "./pages/Home";
import Notifications from "./pages/Notifications";
import ZoneForm from "./components/Zone/ZoneForm";
import ZoneHome from "./components/Zone/ZoneHome";
import Zone from "./components/Zone/Zone";

function App() {
  return (
    <main>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<ReportForm />} />
          <Route path="/category" element={<CategoryForm />} />
          <Route path="/test" element={<Test />} />
          <Route path="/notificaciones" element={<Notifications />} />
          <Route path="/zonas" element={<ZoneHome />} />
          <Route path="/zonas/crear" element={<ZoneForm />} />
          <Route path="/zonas/:id" element={<Zone />} />
          <Route path="*" element={<h1>Not Found</h1>} />

        </Routes>
        <Footer />
      </BrowserRouter>
    </main>
  );
}

export default App;
