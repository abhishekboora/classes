import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';

function AuthPage() {
  const [mode, setMode] = useState(null); // null, 'register', 'login'
  const [step, setStep] = useState(1); // for register: 1=email, 2=otp, 3=details
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [alert, setAlert] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Registration flow
  const sendOtp = async () => {
    setLoading(true);
    setAlert('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/send-otp', { contact: email });
      setAlert(res.data.message);
      setStep(2);
    } catch (err) {
      setAlert(err.response?.data?.message || 'Failed to send OTP.');
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true);
    setAlert('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { contact: email, otp });
      setAlert(res.data.message);
      setStep(3);
    } catch (err) {
      setAlert(err.response?.data?.message || 'OTP verification failed.');
    }
    setLoading(false);
  };

  const register = async () => {
    setLoading(true);
    setAlert('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      setAlert(res.data.message);
      setMode('login');
      setStep(1);
      setEmail('');
      setName('');
      setPassword('');
      setOtp('');
    } catch (err) {
      setAlert(err.response?.data?.message || 'Registration failed.');
    }
    setLoading(false);
  };

  // Login flow
  const login = async () => {
    setLoading(true);
    setAlert('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        emailOrMobile: email, password: loginPassword
      });
      setAlert(res.data.message);
      setTimeout(() => navigate('/home'), 1000);
    } catch (err) {
      setAlert(err.response?.data?.message || 'Login failed.');
    }
    setLoading(false);
  };

  // UI
  if (mode === 'register') {
    if (step === 1) {
      return (
        <div className={styles.container}>
          <div className={styles.card}>
            <h2>Register - Step 1: Enter Email</h2>
            {alert && <div style={{color: alert.includes('success') ? 'green' : 'red', marginBottom: 10}}>{alert}</div>}
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" />
            <button onClick={sendOtp} disabled={loading}>{loading ? 'Sending...' : 'Send OTP'}</button>
            <button className={styles.switchBtn} onClick={() => { setMode('login'); setStep(1); setAlert(''); }}>Already have an account? Login</button>
          </div>
        </div>
      );
    }
    if (step === 2) {
      return (
        <div className={styles.container}>
          <div className={styles.card}>
            <h2>Register - Step 2: Enter OTP</h2>
            {alert && <div style={{color: alert.includes('verified') ? 'green' : 'red', marginBottom: 10}}>{alert}</div>}
            <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="OTP" />
            <button onClick={verifyOtp} disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
          </div>
        </div>
      );
    }
    if (step === 3) {
      return (
        <div className={styles.container}>
          <div className={styles.card}>
            <h2>Register - Step 3: Set Details</h2>
            {alert && <div style={{color: alert.includes('success') ? 'green' : 'red', marginBottom: 10}}>{alert}</div>}
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
            <button onClick={register} disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
          </div>
        </div>
      );
    }
  }

  if (mode === 'login') {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2>Login</h2>
          {alert && <div style={{color: alert.includes('success') ? 'green' : 'red', marginBottom: 10}}>{alert}</div>}
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" />
          <input value={loginPassword} onChange={e => setLoginPassword(e.target.value)} type="password" placeholder="Password" />
          <button onClick={login} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
          <button className={styles.switchBtn} onClick={() => { setMode('register'); setStep(1); setAlert(''); }}>Don't have an account? Register</button>
          <p onClick={() => navigate('/forgot-password')} style={{cursor:'pointer', color:'blue', marginTop:'0.5rem'}}>Forgot Password?</p>
        </div>
      </div>
    );
  }

  // Initial choice
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Welcome! Please choose:</h2>
        <button onClick={() => { setMode('register'); setStep(1); setAlert(''); }}>Register</button>
        <button onClick={() => { setMode('login'); setStep(1); setAlert(''); }}>Login</button>
      </div>
    </div>
  );
}

export default AuthPage; 