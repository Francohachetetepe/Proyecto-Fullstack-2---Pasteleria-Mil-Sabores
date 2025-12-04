import React, { useEffect, useState } from "react";
import DashboardAPI from "../organisms/DashboardAPI";

const Home_admin = () => {
  const [reactMontado, setReactMontado] = useState(false);

  useEffect(() => {
    console.log("REACT: Home_admin montado");
    setReactMontado(true);
  }, []);

  return (
    <>
      {/* Indicador React */}
      <div
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          background: reactMontado ? "#10b981" : "#ef4444",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          zIndex: 10000,
        }}
      >
        React: {reactMontado ? "Montado" : "No montado"}
      </div>

      {/* Tus APIs */}
      <DashboardAPI />

      {/* HTML estático sin scripts */}
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <div class="admin-container">
              <!-- TODO TU HTML ESTÁTICO AQUÍ -->
              <!-- Pegado desde home_admin.html o como lo tenías -->
            </div>
          `,
        }}
      />
    </>
  );
};

export default Home_admin;
