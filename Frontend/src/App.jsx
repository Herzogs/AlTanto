import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Form from "./components/Form";
import CategoryForm from "./components/CategoryForm";
import Test from "./components/Test";
import Home from "./pages/Home";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <main>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<Form />} />
          <Route path="/category" element={<CategoryForm />} />
          <Route path="/test" element={<Test />} />
          <Route path="/notificaciones" element={<Notifications />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </main>
  );
}

export default App;
