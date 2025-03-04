import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Prueba() {
  const [message, setMessage] = useState(''); // 1-leer, 2-alternar, 3. ir cambiando datos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para obtener el mensaje
    const fetchMessage = async () => {
      try {
        // Reemplaza con tu URL base de API
        const response = await axios.get('http://localhost:8000/api/prueba');
        setMessage(response.data.message);
        setLoading(false);
      } catch (error) {
        setError('Error al cargar el mensaje');
        setLoading(false);
        console.error('Error:', error);
      }
    };

    fetchMessage();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="hello-container">
      <h1>{message}</h1>
    </div>
  );
}

export default Prueba;