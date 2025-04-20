import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'; //abre la ventanita de google
import { jwtDecode } from 'jwt-decode'; //decodificar
import SmsVerificationDialog from './components/SmsVerificationDialog';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
      });

      if (response.status == 200) {
        setUserData(response.data);

        if (response.data.requires_verification) {
          setShowVerification(true);
          setMessage('');
        } else {
          // Guardar el token y el userId en localStorage
          saveSession();
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'There was a problem logging in.';
      setMessage(<p className="text-red-500">{errorMessage}</p>);
    }
  };

  const saveSession = () => {
    localStorage.setItem('auth_token', userData.token);
    localStorage.setItem('user_id', userData.user.id);

    setMessage(<p className="text-green-500">{userData.message}</p>);
    navigate('/HomeScreen');
  }

  const handleVerificationCancel = () => {
    setShowVerification(false);
    setPendingUserId(null);
    setMessage(<p className="text-yellow-500">Authentication cancelled. Please try again.</p>);
  };


  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      // Decode the JWT token
      const decodedToken = jwtDecode(credentialResponse.credential);
      
      // Check if the user exists in your backend
      const response = await axios.post('http://localhost:8000/api/check-google-user', {
        email: decodedToken.email,
        name: decodedToken.given_name,
        lastname: decodedToken.family_name
      });
      
      if (response.status == 200) {
        // User exists, process login
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user_id', response.data.user.id);

        if(response.data.needs_completion){
          sessionStorage.setItem('temp_email', decodedToken.email);
          sessionStorage.setItem('temp_name', decodedToken.given_name);
          sessionStorage.setItem('temp_lastname', decodedToken.family_name);
          navigate('/complete-profile');
        } else {
          setMessage(<p className="text-green-500">Successfully logged in with Google!</p>);
          navigate('/HomeScreen');
        }
      }
    } catch (error) {
      console.error("Google login error:", error);
      setMessage(<p className="text-red-500">There was a problem with Google login.</p>);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      
    <div className="h-screen w-screen flex justify-center items-center bg-black">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-gray-800 ">
        <h2 className="text-3xl font-bold text-center text-rose-800 mb-6 ">Welcome KidsYT</h2>
        {message && <div className="mb-4 text-center">{message}</div>}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
          >
            Login
          </button>
        </form>

        <div className="my-4 relative flex items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          <div className="my-4 relative flex items-center justify-center">
            <GoogleLogin
              theme={'filled_blue'}
              shape={'circle'}
              size={'large'}
              onSuccess={handleGoogleLoginSuccess}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </div>

        <div className="mt-4 text-center">
          <p className="text-gray-600">Don't have an account? <a href="/Register" className="text-blue-600 font-semibold hover:underline">Register here</a></p>
        </div>
      </div>
      {/* SMS Verification Dialog */}
      {showVerification && (
          <SmsVerificationDialog
            data={userData}
            onSuccess={saveSession}
            onCancel={handleVerificationCancel}
          />
        )}
    </div>
    </GoogleOAuthProvider>
  );
};

export default Login;

