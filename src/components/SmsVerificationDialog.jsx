import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SmsVerificationDialog = ({ data, onSuccess, onCancel }) => {
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [timer, setTimer] = useState(180); // 3 minutes timer
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Countdown timer
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(timer => timer - 1);
            }, 1000);
        } else {
            clearInterval(interval);
            setMessage('Code expired. Please log in again.');
        }
        return () => clearInterval(interval);
    }, [timer]);

    // Format timer to MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        if (code.length !== 6) {
            setMessage('Please enter a valid 6-digit code');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/verify-sms', {
                user_id: data.user.id,
                code
            });

            // Call success callback to proceed
            onSuccess(response.data);
        } catch (error) {
            setIsLoading(false);
            const errorMessage = error.response?.data?.error || 'Failed to verify code';
            setMessage(errorMessage);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 text-white">Two-Factor Authentication</h3>
                <p className="text-gray-300 mb-4">
                    A verification code has been sent to your phone. Please enter it below to complete login.
                </p>

                <p className="text-gray-400 text-sm mb-4">
                    Time remaining: <span className={timer < 60 ? "text-red-500" : "text-green-500"}>{formatTime(timer)}</span>
                </p>

                {message && <div className="mb-4 text-red-500">{message}</div>}

                <form onSubmit={handleVerify}>
                    <div className="mb-4">
                        <label htmlFor="code" className="block text-sm font-medium text-white mb-2">
                            Verification Code
                        </label>
                        <input
                            type="text"
                            id="code"
                            value={code}
                            onChange={(e) => {
                                // Only allow digits and max 6 characters
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                if (value.length <= 6) setCode(value);
                            }}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white bg-gray-700"
                            placeholder="Enter 6-digit code"
                            maxLength="6"
                            required
                        />
                    </div>

                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            disabled={isLoading || code.length !== 6 || timer <= 0}
                        >
                            {isLoading ? 'Verifying...' : 'Verify'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SmsVerificationDialog;