import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import ReportForm from "./components/ReportForm";
import CategoryForm from "./components/CategoryForm";
import Test from "./components/Test";
import Home from "./pages/Home";
import Notifications from "./pages/Notifications";
import ReportDetail  from "./pages/ReportDetail";

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
          <Route path="/reportDetail" element={<ReportDetail/>}/>
        </Routes>
        <Footer />
      </BrowserRouter>
    </main>
  );
}

export default App;
