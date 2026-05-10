import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Policies from "./pages/Policies";
import PolicyReader from "./pages/PolicyReader";
import Contact from "./pages/Contact";
import DocumentPage from "./pages/DocumentPage";
import { SEO } from "./components/SEO";

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
                  <Route path="/" element={<><SEO title="Candidato ITI" description="Candidato al Consejo de Participación del ITI. No una promesa. Alguien que ya está trabajando." canonical="/" /><Home /></>} />
                  <Route path="/politicas" element={<><SEO title="Políticas" description="Propuestas y documentos de campaña. Conocé las ideas y el plan de trabajo para el ITI." canonical="/politicas" /><Policies /></>} />
                  <Route path="/politicas/:slug" element={<><SEO title="Política" description="Detalle de propuesta y documentos políticos." canonical={undefined} /><PolicyReader /></>} />
                  <Route path="/contacto" element={<><SEO title="Contacto" description="Contactate con Facundo Presa. Redes sociales, mail y formas de comunicación." canonical="/contacto" /><Contact /></>} />
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
