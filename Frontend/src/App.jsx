import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/Home";

const App = () => {
  return (
    <main>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          {/*           <Route path="/form" element={<ReportForm />} />
          <Route path="/category" element={<CategoryForm />} />
          <Route path="/test" element={<Test />} />
          <Route path="/notificaciones" element={<Notifications />} />
          <Route path="/zonas" element={<ZoneHome />} />
          <Route path="/zonas/crear" element={<ZoneForm />} />
          <Route path="/zonas/:id" element={<Zone />} />
          <Route path="*" element={<h1 className="text-center">Estamos trabajando...</h1>} />

          <Route path="/reportDetail" element={<ReportDetail/>}/> */}
        </Routes>
        <Footer />
      </BrowserRouter>
    </main>
  );
};

export default App;
