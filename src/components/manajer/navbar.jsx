import React from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Ambil token JWT dari localStorage
  let decodedToken;
  let namaUser = '';
  let userRole = '';

  // Jika token ada, decode token untuk mendapatkan informasi pengguna
  if (token) {
    try {
      decodedToken = jwtDecode(token); // Decode token
      namaUser = decodedToken.nama_user; // Ambil nama pengguna dari token
      userRole = decodedToken.role; // Ambil role dari token
    } catch (error) {
      console.error('Invalid token:', error);
      // Handle error, misalnya dengan logout otomatis jika token tidak valid
      localStorage.clear();
      navigate('/login');
    }
  }

  const handleSignOut = () => {
    if (userRole === 'manajer') {
      localStorage.clear();
      navigate('/login');
    } else if (userRole === 'kasir') {
      navigate('/kasir');
    }
  };

  return (
    <nav className="fixed top-0 left-1/2 transform -translate-x-1/2 w-3/4 bg-white shadow-lg p-4 flex justify-between items-center font-poppins mt-4 rounded-full">
      <div className="text-lg font-bold text-green-700 flex items-center">
        <img
          src={logo}
          alt="Logo"
          className="h-10 w-auto border-r-2 border-gray-400"
        />
        <span className="pl-4">WikusamaCafe</span>
      </div>

      <div className="flex items-center space-x-4 px-4">
        <img
          src="https://jacoblund.com/cdn/shop/products/photo-id-4670656348229-young-supermarket-cashier.jpg?v=1612432428"
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col items-start">
          <span className="text-sm font-bold text-gray-700">{namaUser}</span>
          <button
            onClick={handleSignOut}
            className="relative text-red-700 text-xs transition-all duration-200 hover:text-red-700 after:content-[''] after:absolute after:left-0 after:bg-red-700 after:h-[1px] after:w-0 after:bottom-[-1px] after:transition-all after:duration-300 hover:after:w-full"
          >
            {userRole === 'manajer' ? 'Sign Out' : 'Back to Home'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
