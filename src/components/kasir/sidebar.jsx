import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUtensils,
  faCoffee,
  faPizzaSlice,
  faSignOutAlt,
  faHistory,
} from '@fortawesome/free-solid-svg-icons';
// import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // for navigation
import 'react-toastify/dist/ReactToastify.css';

import makananBg from '../../assets/bgMakanan.png';
import minumanBg from '../../assets/bgMinuman.png';
import allBg from '../../assets/bgAll.png';
import logo from '../../assets/logo.png';

const Sidebar = ({ setFilter }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const navigate = useNavigate(); // Initialize navigate

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setFilter(filter);
  };

  const handleSignOut = () => {
    localStorage.clear();
    // toast.success('You have successfully signed out!');
    window.location.href = '/login';
  };

  return (
    <div className="w-64 h-screen bg-white text-gray-900 shadow-xl p-4 text-xs fixed">
      <div className="flex justify-center mb-6">
        <img src={logo} alt="Logo" className="h-20" />
      </div>
      <hr className="mb-6" />
      <h2 className="text-2xl font-bold mb-4 text-center">Menu Filter</h2>
      <ul className="space-y-4">
        <li
          onClick={() => handleFilterChange('all')}
          className={`relative cursor-pointer flex items-center justify-center bg-cover bg-center rounded-lg h-16 p-3 transition-transform transform hover:scale-105 ${
            selectedFilter === 'all' ? 'bg-opacity-50' : ''
          }`}
          style={{
            backgroundImage: `url(${allBg})`,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backgroundBlendMode: 'darken',
          }}
        >
          <FontAwesomeIcon
            icon={faUtensils}
            className="text-2xl mr-2 text-white"
          />
          <span className="text-white text-base font-semibold">Semua Menu</span>
        </li>
        <li
          onClick={() => handleFilterChange('makanan')}
          className={`relative cursor-pointer flex items-center justify-center bg-cover bg-center rounded-lg h-16 p-3 transition-transform transform hover:scale-105 ${
            selectedFilter === 'makanan' ? 'bg-opacity-50' : ''
          }`}
          style={{
            backgroundImage: `url(${makananBg})`,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backgroundBlendMode: 'darken',
          }}
        >
          <FontAwesomeIcon
            icon={faPizzaSlice}
            className="text-2xl mr-2 text-white"
          />
          <span className="text-white text-base font-semibold">Makanan</span>
        </li>
        <li
          onClick={() => handleFilterChange('minuman')}
          className={`relative cursor-pointer flex items-center justify-center bg-cover bg-center rounded-lg h-16 p-3 transition-transform transform hover:scale-105 ${
            selectedFilter === 'minuman' ? 'bg-opacity-50' : ''
          }`}
          style={{
            backgroundImage: `url(${minumanBg})`,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backgroundBlendMode: 'darken',
          }}
        >
          <FontAwesomeIcon
            icon={faCoffee}
            className="text-2xl mr-2 text-white"
          />
          <span className="text-white text-base font-semibold">Minuman</span>
        </li>
      </ul>

      <div className="absolute bottom-4 left-6  cursor-pointer flex items-center justify-center">
        <button
          onClick={handleSignOut}
          className="relative bottom-0 pb-0.5 text-red-700 text-xs transition-all duration-300 hover:text-red-700 after:content-[''] after:absolute after:left-0 after:bg-red-700 after:h-[1px] after:w-0 after:bottom-[-1px] after:transition-all after:duration-300 hover:after:w-full flex justify-center items-center"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
