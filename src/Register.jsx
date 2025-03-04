import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    pin: '',
    firstName: '',
    lastName: '',
    country: '',
    birthDate: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { email, password, confirmPassword, phone, pin, firstName, lastName, birthDate } = formData;
    if (!email || !password || !phone || !pin || !firstName || !lastName || !birthDate) {
      return 'Todos los campos requeridos deben ser completados';
    }
    if (password !== confirmPassword) {
      return 'Las contraseñas no coinciden';
    }
    if (pin.length !== 6 || isNaN(pin)) {
      return 'El PIN debe tener 6 dígitos numéricos';
    }
    const birthYear = new Date(birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    if (currentYear - birthYear < 18) {
      return 'Debes ser mayor de 18 años para registrarte';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:8000/api/register', formData);
      setSuccess('Registro exitoso');
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        pin: '',
        firstName: '',
        lastName: '',
        country: '',
        birthDate: ''
      });
    } catch (error) {
      setError('Error al registrar usuario');
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded-lg shadow-lg bg-black">
      <h2 className="text-2xl font-bold mb-5 text-center">Registro</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" name="email" placeholder="Correo Electrónico" onChange={handleChange} value={formData.email} className="w-full p-2 border rounded" required />
        <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} value={formData.password} className="w-full p-2 border rounded" required />
        <input type="password" name="confirmPassword" placeholder="Repetir Contraseña" onChange={handleChange} value={formData.confirmPassword} className="w-full p-2 border rounded" required />
        <input type="tel" name="phone" placeholder="Número Telefónico" onChange={handleChange} value={formData.phone} className="w-full p-2 border rounded" required />
        <input type="text" name="pin" placeholder="PIN (6 dígitos)" onChange={handleChange} value={formData.pin} className="w-full p-2 border rounded" required maxLength={6} />
        <input type="text" name="firstName" placeholder="Nombre" onChange={handleChange} value={formData.firstName} className="w-full p-2 border rounded" required />
        <input type="text" name="lastName" placeholder="Apellidos" onChange={handleChange} value={formData.lastName} className="w-full p-2 border rounded" required />
        <input type="text" name="country" placeholder="País" onChange={handleChange} value={formData.country} className="w-full p-2 border rounded" />
        <input type="date" name="birthDate" onChange={handleChange} value={formData.birthDate} className="w-full p-2 border rounded" required />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;
