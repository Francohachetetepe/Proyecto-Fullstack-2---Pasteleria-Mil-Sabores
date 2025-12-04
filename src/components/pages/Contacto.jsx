import React from 'react';
import ContactoForm from '../molecules/ContactoForm'; // Asegúrate de que la ruta sea correcta

const Contacto = () => {
  return (
    <div className="contacto-container">
      <h1>Formulario de Contacto</h1>
      {/* Aquí renderizamos el formulario de contacto */}
      <ContactoForm />
    </div>
  );
};

export default Contacto;
