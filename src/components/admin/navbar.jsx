import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'; // Pastikan path logo sesuai
import { jwtDecode } from 'jwt-decode';
const Navbar = () => {
  const token = localStorage.getItem('token');
  const userData = jwtDecode(token);
  const namaUser = userData.nama_user;
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="pl-72 pr-8 fixed top-0 left-0 w-full bg-white shadow-lg p-4 flex justify-end items-center font-poppins ">
      <div className="flex items-center space-x-4">
        <div className="text-xl font-bold text-green-700 flex items-center">
          <span className="border-r-2 border-gray-400 pr-2">Wikusama Cafe</span>
        </div>
        <img
          src="https://www.akun.biz/tips-bisnis/wp-content/uploads/2022/06/tugas-manajer-keuangan-640x427.jpg"
          alt="Profile"
          className="w-10 h-10 object-cover  rounded-full"
        />
        <div className="flex flex-col items-start">
          <span className="text-sm font-bold text-gray-700">{namaUser}</span>
          <button
            onClick={handleSignOut}
            className="relative text-gray-600 text-xs transition-all duration-200 hover:text-gray-500 after:content-[''] after:absolute after:left-0 after:bg-gray-500 after:h-[1px] after:w-0 after:bottom-[-1px] after:transition-all after:duration-300 hover:after:w-full"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
