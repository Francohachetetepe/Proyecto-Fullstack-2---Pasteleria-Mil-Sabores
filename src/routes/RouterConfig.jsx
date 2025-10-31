import { BrowserRouter, Routes, Route } from "react-router-dom";

// === Componentes base ===
import { Header } from "../components/organisms/Header";
import { Footer } from "../components/organisms/Footer";

// === Páginas React ===
import Home from "../components/pages/Home";
import PerfilCliente from "../components/pages/PerfilCliente";
import PerfilAdmin from "../components/pages/Home_admin";
import Blogs from "../components/pages/Blogs";
import Contacto from "../components/pages/Contacto";
import Nosotros from "../components/pages/Nosotros";
import Inicio_sesion from "../components/pages/Inicio_sesion";
import Registro_usuario from "../components/pages/Registro_usuario";
import Catalogo from "../components/pages/Catalogo";
import Carrito from "../components/pages/Carrito";
import Checkout from "../components/pages/Checkout";
import CompraExitosa from "../components/pages/CompraExitosa";
import ErrorPago from "../components/pages/ErrorPago";

// ⚠️ Importa solo si la página se usa dentro del enrutador SPA
// Si se monta por HTML estático, no la incluyas aquí.
import Detalle_product from "../components/pages/Detalle_product";

const RouterConfig = () => {
  return (
    <BrowserRouter basename="/">
      <Header />

      <Routes>
        {/* Páginas generales */}
        <Route path="/" element={<Home />} />
        <Route path="/perfil-cliente" element={<PerfilCliente />} />
        <Route path="/perfil-admin" element={<PerfilAdmin />} />
        <Route path="/registro-usuario" element={<Registro_usuario />} />
        <Route path="/inicio-sesion" element={<Inicio_sesion />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/compra-exitosa" element={<CompraExitosa />} />
        <Route path="/error-pago" element={<ErrorPago />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />

        {/* ⚠️ Esta ruta solo aplica si accedes dentro del SPA */}
        {/* Pero NO servirá para detalle_product.html */}
        <Route path="/detalle-producto/:id" element={<Detalle_product />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default RouterConfig;
