import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function OTPPage() {
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const sendOtp = async () => {
    await axios.post('http://localhost:5000/api/auth/send-otp', { contact });
    setStep(2);
  };

  const verifyOtp = async () => {
    await axios.post('http://localhost:5000/api/auth/verify-otp', { contact, otp });
    localStorage.setItem('contact', contact);
    navigate('/register');
  };

  return (
    <div>
      {step === 1 ? (
        <>
          <h2>Enter Email or Mobile</h2>
          <input value={contact} onChange={(e) => setContact(e.target.value)} />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      ) : (
        <>
          <h2>Enter OTP</h2>
          <input value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}
    </div>
  );
}

export default OTPPage;
