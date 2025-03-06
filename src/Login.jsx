import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // React Router v6

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/login", formData);
      
      alert("Login successful");
      console.log(response.data);
      localStorage.setItem("user", JSON.stringify(response.data.user)); // Save user data

      navigate("/dashboard"); // Redirect after login
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data.errors || { general: error.response.data.error });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4 border rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>

        {errors.general && <div className="text-red-500 text-sm">{errors.general}</div>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}

        <button
          type="submit"
          className={`w-full py-2 rounded bg-blue-500 text-white ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        <div className="text-center mt-4">
          <span className="text-sm">Don't have an account? </span>
          <button type="button" className="text-blue-500 hover:underline" onClick={() => navigate("/register")}>
            Register here
          </button>
        </div>
      </form>
    </div>
  );
}