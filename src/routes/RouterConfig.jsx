import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header  from "../components/organisms/Header";
import Footer  from "../components/organisms/Footer";
import Home from "../components/pages/Home";
import PerfilCliente from "../components/pages/PerfilCliente";
import PerfilAdmin from "../components/pages/PerfilAdmin";
import Blogs from "../components/pages/Blogs";
import Contacto from "../components/pages/Contacto";
import Nosotros from "../components/pages/Nosotros";
import Detalle_product from "../components/pages/Detalle_product";
import Inicio_sesion from "../components/pages/Inicio_sesion";
import Registro_usuario from "../components/pages/Registro_usuario";
import Catalogo from "../components/pages/Catalogo";
import Carrito from "../components/pages/Carrito";
import Checkout from "../components/pages/Checkout";
import CompraExitosa from "../components/pages/CompraExitosa";
import ErrorPago from "../components/pages/ErrorPago";
import Header from "../components/organisms/Header";   
import Footer from "../components/organisms/Footer";

const RouterConfig = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/perfil-cliente" component={PerfilCliente} />
        <Route path="/perfil-admin" component={PerfilAdmin} />
        <Route path="/registro-usuario" component={Registro_usuario} />
        <Route path="/inicio-sesion" component={Inicio_sesion} />
        <Route path="/catalogo" component={Catalogo} />
        <Route path="/detalle-producto" component={Detalle_product} />
        <Route path="/blogs" component={Blogs} />
        <Route path="/nosotros" component={Nosotros} />
        <Route path="/contacto" component={Contacto} />
        <Route path="/carrito" component={Carrito} />
      </Switch>
      <Footer />
    </Router>
  );
};

export default RouterConfig;