import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function CompleteProfile() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        lastname: "",
        phone: "",
        pin: "",
        country: "",
        birthdate: ""
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Get Google data from sessionStorage
        const googleEmail = sessionStorage.getItem('temp_email');
        const firstName = sessionStorage.getItem('temp_name');
        const lastName = sessionStorage.getItem('temp_lastname');

        setFormData(prev => ({
            ...prev,
            email: googleEmail,
            name: firstName,
            lastname: lastName
        }));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let tempErrors = {};
        const phoneRegex = /^\d{8,15}$/;
        const pinRegex = /^\d{6}$/;

        if (!formData.phone.match(phoneRegex)) tempErrors.phone = "Invalid phone number";
        if (!formData.pin.match(pinRegex)) tempErrors.pin = "PIN must be 6 digits";
        if (!formData.country) tempErrors.country = "Please select a country";
        if (!formData.birthdate) tempErrors.birthdate = "Required birthdate field";
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
    
        const tempToken = localStorage.getItem('auth_token');
    
        try {
          const response = await axios.post("http://localhost:8000/api/complete-google-profile", 
            formData,
            {
              headers: {
                'Authorization': `Bearer ${tempToken}`
              }
            }
          );
          
          if(response.status === 200){
            // Clear temp storage and store permanent token
            sessionStorage.removeItem('temp_email');
            sessionStorage.removeItem('temp_name');
            sessionStorage.removeItem('temp_lastname');
            
            alert("Registration successful!");
            navigate('/HomeScreen');
          }
        } catch (error) {
          setErrors(error.response?.data?.errors || {});
        }
    };

    return (
        <div className="h-screen w-screen flex justify-center items-center bg-black">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-center text-white mb-4">Complete Your Profile</h2>
                <p className="text-gray-400 text-center mb-6">Please provide the additional information to complete your registration.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {Object.values(errors).map((err, i) => (
                        <div key={i} className="text-red-400 text-sm">{err}</div>
                    ))}

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            disabled
                            className="border p-2 w-full bg-gray-700 text-white rounded opacity-70"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="border p-2 w-full bg-gray-700 text-white rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
                            <input
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                className="border p-2 w-full bg-gray-700 text-white rounded"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            onChange={handleChange}
                            className="border p-2 w-full bg-gray-700 text-white rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">PIN (6 digits)</label>
                        <input
                            type="text"
                            name="pin"
                            placeholder="PIN (6 digits)"
                            onChange={handleChange}
                            className="border p-2 w-full bg-gray-700 text-white rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Country</label>
                        <select
                            name="country"
                            onChange={handleChange}
                            className="border p-2 w-full bg-gray-700 text-white rounded"
                        >
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
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Date of Birth</label>
                        <input
                            type="date"
                            name="birthdate"
                            onChange={handleChange}
                            className="border p-2 w-full bg-gray-700 text-white rounded"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 w-full rounded mt-4"
                    >
                        Complete Registration
                    </button>
                </form>
            </div>
        </div>
    );
}