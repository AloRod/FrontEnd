import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying...");
  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await axios.post("http://localhost:8000/api/email/verify", {
          token: token
        });
        if (response.status === 200) {
          setMessage("Email verified successfully! You can now log in.");
        } else {
          setMessage("Verification failed. The link may be invalid or expired.");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setMessage("Invalid or expired token. Please request a new verification link.");
        } else if (error.response && error.response.status === 500) {
          setMessage("Server error. Please try again later.");
        } else {
          setMessage("An unexpected error occurred. Please try again.");
        }
      }
    };

    if (token) {
      verify();
    } else {
      setMessage("No token found in URL.");
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Email Verification</h1>
        <p className="text-center text-lg">{message}</p>
        <div className="mt-4 text-center">
          <a href="/login" className="text-blue-500 hover:text-blue-700">Go to Login</a>
        </div>
      </div>
    </div>
  );
}
