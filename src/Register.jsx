import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
    pin: "",
    name: "",
    lastname: "",
    country: "",
    birthdate: ""
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{8,15}$/;
    const pinRegex = /^\d{6}$/;
    
    if (!formData.email.match(emailRegex)) tempErrors.email = "Invalid email";
    if (formData.password.length < 8) tempErrors.password = "At least 8 characters";
    if (formData.password !== formData.confirm_password) tempErrors.confirm_password = "Passwords do not match";
    if (!formData.phone.match(phoneRegex)) tempErrors.phone = "Invalid phone number";
    if (!formData.pin.match(pinRegex)) tempErrors.pin = "PIN must be 6 digits";
    if (!formData.name) tempErrors.name = "Required field";
    if (!formData.lastname) tempErrors.lastname = "Required field";
    if (!formData.birthdate) tempErrors.birthdate = "Required field";
    else {
      const birthDate = new Date(formData.birthdate);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      if (age < 18) tempErrors.birthdate = "You must be over 18 years old";
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post("http://localhost:8000/api/register", formData);
      if(response.status === 201){
        alert("Registration success, please check your email to activate your account.");
        navigate('/');
      }
    } catch (error) {
      setErrors(error.response?.data?.errors || {});
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-black">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-white mb-4">Register User</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.values(errors).map((err, i) => (
            <div key={i} className="text-red-400 text-sm">{err}</div>
          ))}

          <input type="email" name="email" placeholder="Email" onChange={handleChange} 
            className="border p-2 w-full bg-gray-700 text-white rounded" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} 
            className="border p-2 w-full bg-gray-700 text-white rounded" />
          <input type="password" name="confirm_password" placeholder="Confirm Password" onChange={handleChange} 
            className="border p-2 w-full bg-gray-700 text-white rounded" />
          <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} 
            className="border p-2 w-full bg-gray-700 text-white rounded" />
          <input type="text" name="pin" placeholder="PIN (6 digits)" onChange={handleChange} 
            className="border p-2 w-full bg-gray-700 text-white rounded" />
          <input type="text" name="name" placeholder="First Name" onChange={handleChange} 
            className="border p-2 w-full bg-gray-700 text-white rounded" />
          <input type="text" name="lastname" placeholder="Last Name" onChange={handleChange} 
            className="border p-2 w-full bg-gray-700 text-white rounded" />

          <select name="country" onChange={handleChange} 
            className="border p-2 w-full bg-gray-700 text-white rounded">
            <option value="">Select a country</option>
            <option value="CR">Costa Rica</option>
            <option value="USA">United States</option>
            <option value="Mexico">Mexico</option>
            <option value="Canada">Canada</option>
            <option value="Spain">Spain</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Brazil">Brazil</option>
            <option value="Argentina">Argentina</option>
            <option value="Colombia">Colombia</option>
            <option value="Chile">Chile</option>
            <option value="Peru">Peru</option>
          </select>

          <input type="date" name="birthdate" onChange={handleChange} 
            className="border p-2 w-full bg-gray-700 text-white rounded" />

          <button type="submit" 
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 w-full rounded">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
