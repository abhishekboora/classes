import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const resetPassword = async () => {
    await axios.post('http://localhost:5000/api/auth/forgot-password', {
      email, newPassword
    });
    navigate('/');
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      <button onClick={resetPassword}>Reset</button>
    </div>
  );
}

export default ForgotPasswordPage;
