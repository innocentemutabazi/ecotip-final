import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/eco-tips');
    } catch (error) {
      setError('Login failed: ' + error.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/eco-tips');
    } catch (error) {
      setError('Google login failed: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <img src="/Login.png" alt="Login Illustration" className="illustration"/>
      <h2>Log in</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <div className="password-container">
          <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Log in'}</button>
      </form>
      <div className="links">
        <a href="/register">Sign up</a>
      </div>
      <div className="social-login">
        <button onClick={handleGoogleLogin} disabled={loading}>{loading ? 'Logging in...' : 'Log in with Google'}</button>
      </div>
    </div>
  );
};

export default LoginPage;
