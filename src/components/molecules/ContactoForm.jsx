import React, { useState } from 'react';
import { addContactMessage } from '../../Services/firestoreService'; // Función para agregar mensajes a Firestore
import Input from '../atoms/Input'; // Asegúrate de que Input esté bien implementado
import Button from '../atoms/Button'; // Asegúrate de que Button esté bien implementado
import { validarCorreo } from '../../utils/validaciones'; // Validación de correo
import { useNavigate } from 'react-router-dom'; // Redirección después del envío

const ContactoForm = () => {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    tipoMensaje: '',
    mensaje: '',
  });
  const [msg, setMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Actualización del estado del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, correo, tipoMensaje, mensaje } = form;

    // Validaciones
    if (!nombre) {
      setMsg('El nombre es obligatorio.');
      return;
    }
    if (!validarCorreo(correo)) {
      setMsg('Correo inválido. Solo se permite @duoc.cl, @profesor.duoc.cl o @gmail.com');
      return;
    }
    if (!mensaje) {
      setMsg('El mensaje es obligatorio.');
      return;
    }
    if (!tipoMensaje) {
      setMsg('Selecciona un tipo de mensaje.');
      return;
    }

    try {
      setIsLoading(true);
      setMsg('');

      // Enviar los datos al servidor
      const result = await addContactMessage(form);

      if (result.id) {
        console.log('Mensaje enviado con éxito con ID:', result.id);
        setMsg('Mensaje enviado con éxito.');

        // Espera 1 segundo antes de redirigir
        setTimeout(() => {
          navigate('/gracias'); // Redirigir a una página de agradecimiento
        }, 1000);
      } else {
        console.error('Error al enviar mensaje:', result);
        setMsg('Error al enviar el mensaje. Por favor intente nuevamente.');
      }
    } catch (error) {
      console.error('Error en el envío del mensaje:', error);
      setMsg('Error en el servidor. Por favor intente más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contacto-form">
      <Input
        label="Nombre Completo"
        value={form.nombre}
        onChange={handleChange}
        name="nombre"
        required
        disabled={isLoading}
      />
      <Input
        label="Correo Electrónico"
        type="email"
        value={form.correo}
        onChange={handleChange}
        name="correo"
        required
        disabled={isLoading}
      />
      <div className="form-group">
        <label htmlFor="tipoMensaje">Tipo de Mensaje</label>
        <select
          id="tipoMensaje"
          name="tipoMensaje"
          value={form.tipoMensaje}
          onChange={handleChange}
          required
          disabled={isLoading}
        >
          <option value="">Selecciona una opción</option>
          <option value="problema">Dificultad o problema</option>
          <option value="sugerencia">Sugerencia</option>
          <option value="felicitacion">Felicitación</option>
          <option value="consulta">Consulta general</option>
          <option value="otros">Otros</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="mensaje">Mensaje</label>
        <textarea
          id="mensaje"
          name="mensaje"
          value={form.mensaje}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Enviando...' : 'Enviar Mensaje'}
      </Button>
      {msg && (
        <p className={msg.includes('éxito') ? 'success-message' : 'error-message'}>
          {msg}
        </p>
      )}
    </form>
  );
};

export default ContactoForm;
