import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { InputOTPPattern } from '@/components/InputOTPPattern';
import useAuthStore from '@/store/authStore';
import authApi from '@/api/authApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


const VerifyOTP = () => {
  const [state, setState] = useState({
    timer: 120,
    isVerifyDisabled: false,
    otp: '',
  });
  const navigate= useNavigate()

  const useEmail = useAuthStore((state) => state.current_otp_user);
  const setToken = useAuthStore((state) => state.setResetToken);


  const notifyError = (message) => {
    toast.error(message, {
      position: "top-center"
    });
  };

  useEffect(() => {
    if (state.timer > 0) {
      const intervalId = setInterval(() => {
        setState((prevState) => ({
          ...prevState,
          timer: prevState.timer - 1,
        }));
      }, 1000);
      return () => clearInterval(intervalId);
    } else {
      setState((prevState) => ({
        ...prevState,
        isVerifyDisabled: true,
      }));
    }
  }, [state.timer]);

  const handleOTPChange = (otp) => {
    setState((prevState) => ({
      ...prevState,
      otp,
    }));
  };

  const handleVerify = async () => {
    try {
        const values = {"email":useEmail, "otp":state.otp}
      const resp= await authApi.verifyOtp(values);

      setToken(resp.reset_token)

      navigate('/reset-password')
      
    } catch (error) {
      console.error('OTP verification failed:', error);
      if (error.response && error.response.data && error.response.data.detail) {
        notifyError(error.response.data.detail);
      } else {
        notifyError('OTP verification failed. Please try again.');
      }
    }
  };

  const handleResendOTP = useCallback(async () => {
    try {
      await authApi.otprequest({ email: useEmail });
      setState({
        timer: 120,
        isVerifyDisabled: false,
        otp: '',
      });
      toast.success('OTP resent successfully.');
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      if (error.response && error.response.data && error.response.data.detail) {
        notifyError(error.response.data.detail);
      } else {
        notifyError('OTP request failed. Please try again.');
      }
    }
  }, [useEmail]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(state.timer / 60);
    const seconds = String(state.timer % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [state.timer]);

  return (
    <div className="min-h-screen bg-slate-600 flex justify-center items-center">
      <div className="bg-slate-950 text-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">Verify OTP</h2>
        <p className="text-center mb-4 text-gray-600">
          Enter the 6-digit code sent to your email.
        </p>
        <div className="ms-5 mb-10 mt-5">
          <InputOTPPattern onOTPChange={handleOTPChange} />
        </div>
        <div className="text-center mb-4 text-gray-600">
          Time remaining: {formattedTime}
        </div>
        <button
          onClick={handleVerify}
          className={`mt-5 mb-5 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition ${state.isVerifyDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={state.isVerifyDisabled}
        >
          Verify
        </button>
        <button
          className="mt-5 mb-5 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={handleResendOTP}
          disabled={ state.timer > 0}
        >
          Resend
        </button>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </div>
  );
};

export default VerifyOTP;
