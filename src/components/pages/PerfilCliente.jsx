import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PerfilCliente = () => {
  const q = useQuery();
  const nombre = q.get("nombre");

  return <h2>Perfil de Cliente: {nombre}</h2>;
};

export default PerfilCliente;
