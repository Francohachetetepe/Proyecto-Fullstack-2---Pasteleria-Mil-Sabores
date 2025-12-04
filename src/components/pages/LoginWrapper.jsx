import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom"; // Usamos useNavigate en React Router v6

const LoginWrapper = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para verificar si el usuario está logueado
  const [usuario, setUsuario] = useState(null); // Almacenamos los datos del usuario

  useEffect(() => {
    // Revisar si hay usuario logueado en localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (usuario) {
      // Actualizar contexto con el usuario logueado
      setUser(usuario);
      setUsuario(usuario);
      setIsLoggedIn(true); // El usuario está logueado

      // Redirigir a la página correspondiente según el rol
      if (usuario.rol === "admin") {
        navigate("/perfil-admin"); // Redirige a /perfil-admin
      } else {
        navigate("/perfil-cliente"); // Redirige a /perfil-cliente
      }
    } else {
      // Si no hay usuario, redirigir al login
      navigate("/inicio-sesion"); // Redirige al inicio de sesión
    }
  }, [setUser, navigate]); // Se ejecuta una sola vez cuando el componente se monta

  // Función para manejar la redirección a "Mi perfil"
  const handlePerfilClick = () => {
    if (usuario) {
      if (usuario.rol === "admin") {
        navigate("/perfil-admin"); // Redirige a /perfil-admin
      } else {
        navigate(`/perfil-cliente?nombre=${usuario.nombre}`); // Redirige al perfil de cliente con el nombre
      }
    }
  };

  return (
    <div>
      {/* Muestra el botón de "Mi perfil" solo si el usuario está logueado */}
      {isLoggedIn ? (
        <button className="btn btn-secondary" onClick={handlePerfilClick}>
          Mi perfil
        </button>
      ) : (
        <button className="btn btn-primary" onClick={() => navigate("/inicio-sesion")}>
          Iniciar sesión
        </button>
      )}
    </div>
  );
};

export default LoginWrapper;
