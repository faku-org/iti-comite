import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Policies from "./pages/Policies";
import PolicyReader from "./pages/PolicyReader";
import Contact from "./pages/Contact";
import DocumentPage from "./pages/DocumentPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Document viewer: full-screen, no global nav/footer */}
        <Route path="/documento/:encodedUrl" element={<DocumentPage />} />

        {/* Main site layout */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-navy text-white font-sans">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/politicas" element={<Policies />} />
                  <Route path="/politicas/:slug" element={<PolicyReader />} />
                  <Route path="/contacto" element={<Contact />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
