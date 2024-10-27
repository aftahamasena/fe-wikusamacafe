import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faUsers,
  faUtensils,
  faCouch,
  faMoneyBill,
} from '@fortawesome/free-solid-svg-icons';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../assets/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Set the activeItem based on the current location pathname
  const getActiveItem = (pathname) => {
    const path = pathname.split('/').pop(); // Ambil bagian terakhir dari path
    return path === '' ? 'dashboard' : path; // Jika path kosong, kembalikan 'dashboard'
  };

  const [activeItem, setActiveItem] = useState(
    getActiveItem(location.pathname)
  );

  const handleNavigation = (item) => {
    setActiveItem(item);
    navigate(`/admin/${item}`);
  };

  // Update activeItem setiap kali location.pathname berubah
  useEffect(() => {
    setActiveItem(getActiveItem(location.pathname));
  }, [location.pathname]);

  return (
    <div className="w-64 h-screen bg-white text-gray-900 shadow-lg p-4 fixed font-poppins">
      <div className="flex justify-center mb-6">
        <img src={logo} alt="Logo" className="h-20" />
      </div>
      <hr className="mb-6" />
      <h2 className="text-2xl font-bold mb-4 text-center">Admin Panel</h2>
      <ul className="space-y-2">
        {[
          { name: 'Dashboard', icon: faTachometerAlt },
          { name: 'User', icon: faUsers },
          { name: 'Menu', icon: faUtensils },
          { name: 'Meja', icon: faCouch },
          { name: 'Transaksi', icon: faMoneyBill },
        ].map((item) => (
          <li
            key={item.name}
            onClick={() => handleNavigation(item.name.toLowerCase())}
            className={`relative cursor-pointer flex items-center p-2 rounded-lg hover:bg-gray-100 transition duration-200`}
          >
            <FontAwesomeIcon icon={item.icon} className=" text-lg mr-2" />
            <span className="text-sm absolute left-10">{item.name}</span>
            <div
              className={`absolute -right-4 h-full w-1 rounded-l-3xl ${
                activeItem === item.name.toLowerCase()
                  ? 'bg-green-700'
                  : 'invisible'
              }`}
            ></div>
          </li>
        ))}
      </ul>
      <ToastContainer autoClose={1000} />
    </div>
  );
};

export default Sidebar;
