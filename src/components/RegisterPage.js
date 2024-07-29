import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase-config';
import './RegisterPage.css';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // New state for popup
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: fullName });
      await setDoc(doc(db, "users", userCredential.user.uid), {
        fullName,
        email,
        createdAt: new Date(),
        savedTips: []
      });
      setShowPopup(true); // Show popup on successful registration
      setTimeout(() => {
        navigate('/login'); // Redirect to login after 2 seconds
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error.message); // Log detailed error message
      setError('Failed to register. Please try again.');
    } finally {
      setLoading(false); // Ensure loading state is updated
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), {
        fullName: user.displayName,
        email: user.email,
        createdAt: new Date(),
        savedTips: []
      });
      setShowPopup(true); // Show popup on successful Google registration
      setTimeout(() => {
        navigate('/login'); // Redirect to login after 2 seconds
      }, 2000);
    } catch (error) {
      console.error("Google registration error:", error.message); // Log detailed error message
      setError('Failed to register with Google. Please try again.');
    } finally {
      setLoading(false); // Ensure loading state is updated
    }
  };

  return (
    <div className="register-container">
      <img src="/Login.png" alt="Login Illustration" className="illustration"/>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>
        <div className="password-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "🙈" : "👁️"}
          </span>
        </div>
        <button type="submit" disabled={loading} className='registering'>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <button onClick={handleGoogleRegister} disabled={loading} className='social-login'>
        {loading ? 'Registering with Google...' : 'Register with Google'}
      </button>
      {error && <p className="error">{error}</p>}
      {showPopup && (
        <div className="popup">
          <p>You've successfully registered! Now, please log in.</p>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
