import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EmailVerificationPage() {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search); 
        const verifyUrl = urlParams.get('verify_url');
        
        if (!verifyUrl) {
          setStatus('error');
          setMessage('Verification URL not found');
          return;
        }

        const response = await axios.get(verifyUrl); 
        
        setStatus('success');
        setMessage(response.data.message || 'Account successfully activated');
      } catch (error) {
        setStatus('error');
        if (error.response && error.response.data && error.response.data.error) {
          setMessage(error.response.data.error);
        } else {
          setMessage('Error verifying e-mail');
        }
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 h-screen w-screen">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Verify account</h2>
              <p className="text-gray-600">Please wait while we process your request...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">¡Successful Verification!</h2>
              <p className="text-gray-600">{message}</p>
              <button 
                className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-md"
                onClick={() => navigate("/")}
              >
                Go to Login
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="bg-red-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Verification Error</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailVerificationPage;