import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const usernameInputRef = useRef(null);

  useEffect(() => {
    usernameInputRef.current.focus();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth', {
        username,
        password,
      });

      if (response.data.success) {
        const { token, data } = response.data;

        localStorage.setItem('token', token);

        if (data.role === 'kasir') {
          navigate('/kasir');
        } else if (data.role === 'manajer') {
          navigate('/manajer');
        } else if (data.role === 'admin') {
          navigate('/admin/dashboard');
        }
      } else {
        setError('Login failed, Invalid username or password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="font-poppins min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm transition-transform transform scale-95 hover:scale-100 duration-300 ease-in-out">
        <div className="flex justify-center mb-2">
          <img src={logo} alt="Logo" className="h-16" />
        </div>
        <h2 className="text-2xl font-bold text-green-600 mb-2 text-center">
          Login
        </h2>
        <p className="text-xs text-gray-600 text-center mb-4">
          Silakan masuk untuk melanjutkan ke akun Anda
        </p>

        <form className="text-xs" onSubmit={handleLogin}>
          <div className="mb-4 flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-green-500">
            <FontAwesomeIcon icon={faUser} className="text-gray-400 mx-3" />
            <input
              type="text"
              ref={usernameInputRef}
              placeholder="Username"
              className="w-full px-4 py-2 border-0 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6 relative flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-green-500">
            <FontAwesomeIcon icon={faLock} className="text-gray-400 mx-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full px-4 py-2 border-0 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-2 text-gray-500 focus:outline-none"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <button
            type="submit"
            className="text-sm w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Login
          </button>
        </form>

        {error && (
          <p className="text-red-500 mt-4 text-xs text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Login;
