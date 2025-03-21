import React, { useState } from 'react';
import axios from 'axios';

const RestrictedUser = ({ onSubmit }) => {
  const [user, setUser] = useState({
    name: '',
    pin: '',
    avatar: null, // Aquí vamos a almacenar la imagen
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setUser({ ...user, avatar: e.target.files[0] }); // Guardar el archivo de imagen
  };

  const validateForm = () => {
    const newErrors = {};
    if (!user.name) newErrors.name = 'El nombre es requerido';
    if (!user.pin || user.pin.length !== 6) newErrors.pin = 'El PIN debe ser de 6 dígitos';
    if (!user.avatar) newErrors.avatar = 'El avatar es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('pin', user.pin);
    formData.append('avatar', user.avatar); // Agregar la imagen al formulario

    try {
      const response = await axios.post('http://localhost:8000/api/restricted-users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Importante para subir archivos
        },
      });
      setMessage(response.data.message);
      setUser({ name: '', pin: '', avatar: null });
    } catch (error) {
      setMessage('Error al crear el usuario');
    }
  };

  return (
    <div>
      <h2>Crear Usuario Restringido</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        {errors.name && <p>{errors.name}</p>}

        <input
          type="text"
          placeholder="PIN"
          value={user.pin}
          onChange={(e) => setUser({ ...user, pin: e.target.value })}
        />
        {errors.pin && <p>{errors.pin}</p>}

        <input
          type="file"
          onChange={handleFileChange}
        />
        {errors.avatar && <p>{errors.avatar}</p>}

        <button type="submit">Crear Usuario</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default RestrictedUser;
