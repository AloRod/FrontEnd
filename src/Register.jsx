import { useState } from "react";
import axios from "axios";

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
      alert("Registration successful");
      console.log(response.data);
    } catch (error) {
      setErrors(error.response?.data?.errors || {});
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4">Register user</h2>
  
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.values(errors).map((err, i) => (
          <div key={i} className="text-red-500 text-sm">{err}</div>
        ))}
        
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="border p-2 w-full text-black" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="border p-2 w-full text-black" />
        <input type="password" name="confirm_password" placeholder="Confirm Password" onChange={handleChange} className="border p-2 w-full text-black" />
        <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} className="border p-2 w-full text-black" />
        <input type="text" name="pin" placeholder="PIN (6 digits)" onChange={handleChange} className="border p-2 w-full text-black" />
        <input type="text" name="name" placeholder="First Name" onChange={handleChange} className="border p-2 w-full text-black" />
        <input type="text" name="lastname" placeholder="Last Name" onChange={handleChange} className="border p-2 w-full text-black" />
        <input type="text" name="country" placeholder="Country" onChange={handleChange} className="border p-2 w-full text-black" />
        <input type="date" name="birthdate" onChange={handleChange} className="border p-2 w-full text-black" />
  
        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">Register</button>
      </form>
    </div>
  );
}
